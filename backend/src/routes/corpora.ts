import express from "express";
import { CollectionModel, CorpusModel } from "../models/index.ts";
import { CorporaSchema } from "../../../types/src/index.ts";

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
      },
    ],
  });
  res.json(corpora);
});

export default router;
