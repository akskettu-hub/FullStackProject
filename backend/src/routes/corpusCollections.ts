import express from "express";
import {
  CollectionModel,
  CorpusCollectionModel,
  CorpusModel,
} from "../models/index.ts";
import { parseResponse } from "../utils/errors.ts";
import type { CorpusCollectionSummary } from "@mono/types";
import {
  CorpusCollectionSummarySchema,
  CorpusCollectionsWithCorporaSchema,
  IdSchema,
} from "@mono/types";
import LetterModel from "../models/letters.ts";
import { col, fn } from "sequelize";

const router = express.Router();

router.get("/", async (_req, res): Promise<void> => {
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

  res.status(200).json(
    parseResponse(
      CorpusCollectionsWithCorporaSchema,
      collections.map((c): unknown => c.toJSON()),
    ),
  );
});

router.get("/:id/summary", async (req, res) => {
  const idCheck = IdSchema.safeParse(Number(req.params.id));

  if (!idCheck.success) {
    res.status(400).json({ error: "Invalid id" });
    return;
  }

  const id = idCheck.data;

  const corpusCollection = (await CorpusCollectionModel.findOne({
    where: { id },
    attributes: [
      "id",
      "name",
      [fn("COUNT", fn("DISTINCT", col("corpora.id"))), "corpusCount"],
      [
        fn("COUNT", fn("DISTINCT", col("corpora->collections.id"))),
        "collectionCount",
      ],
      [
        fn("COUNT", fn("DISTINCT", col("corpora->collections->letters.id"))),
        "letterCount",
      ],
      [
        fn(
          "COUNT",
          fn(
            "DISTINCT",
            col("corpora->collections->letters.correspondent_code"),
          ),
        ),
        "authorCount",
      ],
      [fn("MIN", col("corpora->collections->letters.year")), "minYear"],
      [fn("MAX", col("corpora->collections->letters.year")), "maxYear"],
    ],
    include: [
      {
        model: CorpusModel,
        as: "corpora",
        attributes: [],
        through: { attributes: [] },
        required: false,
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
      },
    ],
    group: ["CorpusCollectionModel.id"],
    subQuery: false,
    raw: true,
  })) as unknown as CorpusCollectionSummary | null;

  if (!corpusCollection) {
    res.status(404).json({ error: "Corpus collection not found" });
    return;
  }
  res
    .status(200)
    .json(parseResponse(CorpusCollectionSummarySchema, corpusCollection));
});

/*
router.get("/summaries", async (_req, res) => {
  const summaries = await CorpusCollectionModel.findAll({
    
  })
})
  */

export default router;
