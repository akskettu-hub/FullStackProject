import type {
  SearchOptions,
  SearchOptionsCorpusCollections,
} from "@mono/types";
import {
  CorpusCollectionsWithCorporaSchema,
  YearRangeRowSchema,
} from "@mono/types";

import {
  CollectionModel,
  CorpusCollectionModel,
  CorpusModel,
  LetterModel,
} from "../models/index.ts";

import { col, fn, Op } from "sequelize";
import { z } from "zod";

export const getSearchOptions = async (): Promise<SearchOptions> => {
  const [withYears, authenticity, relationshipCodes] = await Promise.all([
    getCorpusCollectionWithYears(),
    getDistictValues("authenticity"),
    getDistictValues("relationship_code"),
  ]);

  return {
    corpusCollections: withYears,
    authenticity,
    relationshipCodes,
  };
};

export const getCorpusCollectionWithYears =
  async (): Promise<SearchOptionsCorpusCollections> => {
    const corCol = await CorpusCollectionModel.findAll({
      include: [
        {
          model: CorpusModel,
          as: "corpora",
          through: { attributes: [] },
        },
      ],
      order: [
        ["id", "ASC"],
        [{ model: CorpusModel, as: "corpora" }, "name", "ASC"],
      ],
    });

    const base = CorpusCollectionsWithCorporaSchema.parse(
      corCol.map((cc): unknown => cc.toJSON()),
    );

    const rangeRows = await CorpusModel.findAll({
      attributes: [
        "id",
        [fn("MIN", col("collections->letters.year")), "minYear"],
        [fn("MAX", col("collections->letters.year")), "maxYear"],
      ],
      include: [
        {
          model: CollectionModel,
          as: "collections",
          attributes: [],
          required: false,
          include: [
            {
              model: LetterModel,
              as: "letters",
              attributes: [],
              required: false,
            },
          ],
        },
      ],
      group: ["CorpusModel.id"],
      subQuery: false,
      raw: true,
    });

    const ranges = z.array(YearRangeRowSchema).parse(rangeRows);
    const rangeByCorpus = new Map(ranges.map((r) => [r.id, r]));

    const withYears = base.map((cc) => ({
      ...cc,
      corpora: cc.corpora.map((corpus) => ({
        ...corpus,
        minYear: rangeByCorpus.get(corpus.id)?.minYear ?? null,
        maxYear: rangeByCorpus.get(corpus.id)?.maxYear ?? null,
      })),
    }));
    return withYears;
  };

export const getDistictValues = async (
  column: "authenticity" | "relationship_code",
): Promise<string[]> => {
  const rows = await LetterModel.findAll({
    attributes: [column],
    where: { [column]: { [Op.ne]: null } },
    group: [column],
    order: [[column, "ASC"]],
    raw: true,
  });

  return z
    .array(z.object({ [column]: z.string() }))
    .parse(rows)
    .map((row) => row[column]);
};
