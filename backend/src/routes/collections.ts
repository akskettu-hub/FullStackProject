import express from "express";
import {
  CollectionModel,
  CollectionTitleStatementModel,
} from "../models/index.ts";
import { parseResponse } from "../utils/errors.ts";
import type { CollectionSummaries } from "@mono/types";
import {
  CollectionIdSchema,
  CollectionSchema,
  CollectionsSchema,
  CollectionSummariesSchema,
  CollectionsWithTitleStmtsSchema,
  IdSchema,
} from "@mono/types";
import { col, fn } from "sequelize";
import LetterModel from "../models/letters.ts";

const router = express.Router();

router.get("/", async (_req, res): Promise<void> => {
  const collections = await CollectionModel.findAll();

  res.status(200).json(
    parseResponse(
      CollectionsSchema,
      collections.map((c): unknown => c.toJSON()),
    ),
  );
});

router.get("/:corpusId/summaries", async (req, res): Promise<void> => {
  const corpusIdCheck = IdSchema.safeParse(Number(req.params.corpusId));

  if (!corpusIdCheck.success) {
    res.status(400).json({ error: "Invalid id" });
    return;
  }

  const corpusId = corpusIdCheck.data;

  const collections = (await CollectionModel.findAll({
    where: { in_corpus: corpusId },
    attributes: [
      "id",
      "xml_id",
      "in_corpus",
      [fn("COUNT", col("letters.id")), "letterCount"],
      [
        fn("COUNT", fn("DISTINCT", col("letters.correspondent_code"))),
        "authorCount",
      ],
      [fn("MIN", col("letters.year")), "minYear"],
      [fn("MAX", col("letters.year")), "maxYear"],
    ],
    include: [
      {
        model: LetterModel,
        as: "letters",
        attributes: [],
        required: false,
      },
    ],
    group: ["CollectionModel.id"],
    order: [["xml_id", "ASC"]],
    subQuery: false,
    raw: true,
  })) as unknown as CollectionSummaries | null;

  if (!collections) {
    res
      .status(404)
      .json({ error: "Collections not found with provided corpus id" });
    return;
  }

  res.status(200).json(parseResponse(CollectionSummariesSchema, collections));
});

router.get("/id/:id", async (req, res): Promise<void> => {
  const id = CollectionIdSchema.safeParse(req.params.id);

  if (!id.success) {
    res.status(400).json({ error: "Invalid collection id" });
    return;
  }

  const collection = await CollectionModel.findByPk(id.data);
  if (!collection) {
    res.status(404).json({ error: "Collection not found" });
    return;
  }

  res.status(200).json(parseResponse(CollectionSchema, collection.toJSON()));
});

router.get("/titleStmts", async (_req, res): Promise<void> => {
  const collections: CollectionModel[] = await CollectionModel.findAll({
    include: [
      {
        model: CollectionTitleStatementModel,
        as: "titleStatements",
        attributes: ["seq", "text"],
        separate: true,
        order: [["seq", "ASC"]],
      },
    ],
    order: [["xml_id", "ASC"]],
  });
  res.status(200).json(
    parseResponse(
      CollectionsWithTitleStmtsSchema,
      collections.map((c): unknown => c.toJSON()),
    ),
  );
});

export default router;
