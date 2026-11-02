import express from "express";

import {
  CollectionModel,
  CorpusCollectionModel,
  CorpusModel,
  LetterModel,
} from "../models/index.ts";
import { parseResponse } from "../utils/errors.ts";
import {
  CorpusCollectionsWithCorporaSchema,
  SearchOptionsSchema,
  YearRangeRowSchema,
} from "@mono/types";
import { col, fn } from "sequelize";
import { z } from "zod";

const router = express.Router();

router.get("/searchOptions", async (_req, res): Promise<void> => {
  const collections = await CorpusCollectionModel.findAll({
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
    collections.map((cc): unknown => cc.toJSON()),
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

  res.status(200).json(parseResponse(SearchOptionsSchema, withYears));
});

export default router;
