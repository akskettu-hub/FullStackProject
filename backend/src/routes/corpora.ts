import express from "express";
import { CollectionModel, CorpusModel } from "../models/index.ts";

const router = express.Router();

router.get("/", async (_req, res) => {
  const corpora: CorpusModel[] = await CorpusModel.findAll();
  res.json(corpora);
});

router.get("/collections", async (_req, res) => {
  const corpora: CorpusModel[] = await CorpusModel.findAll({
    include: [
      {
        model: CollectionModel,
        as: "collections",
        attributes: ["id", "xml_id"],
      },
    ],
  });
  res.json(corpora);
});

export default router;
