import express from "express";
import { CorpusCollectionModel, CorpusModel } from "../models/index.ts";
import { parseResponse } from "../utils/errors.ts";
import { CorpusCollectionsWithCorporaSchema } from "../../../types/src/index.ts";

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

export default router;
