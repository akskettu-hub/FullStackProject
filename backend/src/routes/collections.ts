import express from "express";
import {
  CollectionModel,
  CollectionTitleStatementModel,
} from "../models/index.ts";

const router = express.Router();

router.get("/", async (_req, res) => {
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
