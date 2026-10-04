import express from "express";
import { Collection, Corpus } from "../models/index.ts";

const router = express.Router();

router.get("/", async (_req, res) => {
  const corpora: Corpus[] = await Corpus.findAll();
  res.json(corpora);
});

router.get("/collections", async (_req, res) => {
  const corpora: Corpus[] = await Corpus.findAll({
    include: [
      {
        model: Collection,
        as: "collections",
        attributes: ["id", "xml_id"],
      },
    ],
  });
  res.json(corpora);
});

export default router;
