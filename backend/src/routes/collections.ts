import express from "express";
import {
  CollectionModel,
  CollectionTitleStatementModel,
} from "../models/index.ts";
import {
  CollectionIdSchema,
  CollectionSchema,
  CollectionsSchema,
  CollectionsWithTitleStmtsSchema,
} from "../../../types/src/index.ts";
import { parseResponse } from "../utils/errors.ts";

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
