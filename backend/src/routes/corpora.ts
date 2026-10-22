import express from "express";
import {
  CollectionModel,
  CorpusCollectionModel,
  CorpusModel,
} from "../models/index.ts";
import {
  CorporaSchema,
  CorporaWithCollectionsSchema,
  CorporaWithCorpusCollectionsSchema,
  IdSchema,
} from "@mono/types";
import { col, fn } from "sequelize";
import type { CorpusSummary } from "@mono/types";
import LetterModel from "../models/letters.ts";

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

  res.status(200).json({
    id: corpus.id,
    name: corpus.name,
    collectionCount: Number(corpus.collectionCount),
    letterCount: Number(corpus.letterCount),
    minYear: corpus.minYear,
    maxYear: corpus.maxYear,
  });
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
