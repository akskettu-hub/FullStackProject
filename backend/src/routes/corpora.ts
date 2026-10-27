import express from "express";
import {
  CollectionModel,
  CorpusCollectionModel,
  CorpusModel,
} from "../models/index.ts";
import {
  AuthorSummariesSchema,
  CorporaSchema,
  CorporaWithCollectionsSchema,
  CorporaWithCorpusCollectionsSchema,
  CorpusSummarySchema,
  IdSchema,
} from "@mono/types";
import { col, fn } from "sequelize";
import type { AuthorSummaries, CorpusSummary } from "@mono/types";
import LetterModel from "../models/letters.ts";
import { parseResponse } from "../utils/errors.ts";

const router = express.Router();

router.get("/", async (_req, res): Promise<void> => {
  const corpora = await CorpusModel.findAll();
  res
    .status(200)
    .json(CorporaSchema.parse(corpora.map((c): unknown => c.toJSON())));
});

router.get("/collections", async (_req, res) => {
  const corpora: CorpusModel[] = await CorpusModel.findAll({
    include: [
      {
        model: CollectionModel,
        as: "collections",
        attributes: ["id", "xml_id"],
        separate: true,
        order: [["xml_id", "ASC"]],
      },
    ],
    order: [["id", "ASC"]],
  });
  res
    .status(200)
    .json(
      CorporaWithCollectionsSchema.parse(
        corpora.map((c): unknown => c.toJSON()),
      ),
    );
});

router.get("/:id/summary", async (req, res): Promise<void> => {
  const idCheck = IdSchema.safeParse(Number(req.params.id));

  if (!idCheck.success) {
    res.status(400).json({ error: "Invalid id" });
    return;
  }

  const id = idCheck.data;

  const corpus = (await CorpusModel.findOne({
    where: { id },
    attributes: [
      "id",
      "name",
      [fn("COUNT", fn("DISTINCT", col("collections.id"))), "collectionCount"],
      [fn("COUNT", col("collections->letters.id")), "letterCount"],
      [
        fn(
          "COUNT",
          fn("DISTINCT", col("collections->letters.correspondent_code")),
        ),
        "authorCount",
      ],
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
  })) as unknown as CorpusSummary | null;

  if (!corpus) {
    res.status(404).json({ error: "Corpus not found" });
    return;
  }

  res.status(200).json(parseResponse(CorpusSummarySchema, corpus));
});

router.get("/:id/authors", async (req, res) => {
  const idCheck = IdSchema.safeParse(req.params.id);

  if (!idCheck.success) {
    res.status(400).json({ error: "Invalid collection id" });
    return;
  }

  const id = idCheck.data;

  const rows = (await LetterModel.findAll({
    attributes: [
      ["author_key", "authorKey"],
      [fn("COUNT", col("LetterModel.id")), "letterCount"],
      [fn("MIN", col("LetterModel.year")), "minYear"],
      [fn("MAX", col("LetterModel.year")), "maxYear"],
    ],
    include: [
      {
        model: CollectionModel,
        as: "collection",
        attributes: [],
        required: true,
        where: { in_corpus: id },
      },
    ],
    group: ["LetterModel.author_key"],
    order: [
      [fn("COUNT", col("LetterModel.id")), "DESC"],
      ["author_key", "ASC"],
    ],
    raw: true,
  })) as unknown as AuthorSummaries;

  if (!rows) {
    res.status(404).json({ error: "Collection not found" });
    return;
  }

  res.status(200).json(parseResponse(AuthorSummariesSchema, rows));
});

router.get("/wCorpusCollections", async (_req, res): Promise<void> => {
  const corpora: CorpusModel[] = await CorpusModel.findAll({
    include: [
      {
        model: CorpusCollectionModel,
        as: "corpus_collections",
        through: { attributes: [] },
      },
    ],
    order: [
      ["id", "ASC"],
      [{ model: CorpusCollectionModel, as: "corpus_collections" }, "id", "ASC"],
    ],
  });

  res
    .status(200)
    .json(
      CorporaWithCorpusCollectionsSchema.parse(
        corpora.map((c): unknown => c.toJSON()),
      ),
    );
});

export default router;
