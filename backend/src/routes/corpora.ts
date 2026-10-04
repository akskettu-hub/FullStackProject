import express from "express";
import Corpus from "../models/corpora.ts";

const router = express.Router();

router.get("/", async (_req, res) => {
  const corpora: Corpus[] = await Corpus.findAll();
  res.json(corpora);
});

export default router;
