import express from "express";
import {
  CollectionModel,
  CollectionTitleStatementModel,
} from "../models/index.ts";
import {
  CollectionIdSchema,
  CollectionSchema,
  CollectionsSchema,
} from "../../../types/src/index.ts";

const router = express.Router();

router.get("/", async (_req, res): Promise<void> => {
  const collections = await CollectionModel.findAll();

  res
    .status(200)
    .json(CollectionsSchema.parse(collections.map((c): unknown => c.toJSON())));
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

  res.status(200).json(CollectionSchema.parse(collection.toJSON()));
});

router.get("/titleStmts", async (_req, res): Promise<void> => {
  const collections: CollectionModel[] = await CollectionModel.findAll({
    include: [
      {
        model: CollectionTitleStatementModel,
        as: "titleStatements",
        attributes: ["seq", "text"],
        order: [["seq", "ASC"]],
      },
    ],
    order: [["xml_id", "ASC"]],
  });
  res.header("Access-Control-Allow-Origin", "*");
  res.json(collections);
});

export default router;
