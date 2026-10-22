import express from "express";
import LetterModel from "../models/letters.ts";
import { CollectionIdSchema, LetterSchema } from "@mono/types";
import { parseResponse } from "../utils/errors.ts";

const router = express.Router();

router.get("/:id", async (req, res) => {
  const id = CollectionIdSchema.safeParse(req.params.id);

  if (!id.success) {
    res.status(400).json({ error: "Invalid letter id" });
    return;
  }
  const letter = await LetterModel.findByPk(id.data);

  if (!letter) {
    res.status(404).json({ error: "Letter not found" });
    return;
  }

  res.status(200).json(parseResponse(LetterSchema, letter.toJSON()));
});

export default router;
