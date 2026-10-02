import express from "express";
import { Collection, CollectionTitleStatement } from "../models/index.ts";

const router = express.Router();

router.get("/", async (_req, res) => {
  const collections: Collection[] = await Collection.findAll({
    include: [
      {
        model: CollectionTitleStatement,
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
