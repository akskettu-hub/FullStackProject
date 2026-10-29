//Mostly LLM Generated: Claude Sonnet 5.5 Medium
import express from "express";
import {
  CollectionIdSchema,
  LetterSchema,
  LetterSearchResultSchema,
  LetterSearchSchema,
} from "@mono/types";
import { CollectionModel, LetterModel } from "../models/index.ts";
import { parseResponse } from "../utils/errors.ts";
import { Op, type WhereOptions } from "sequelize";

const router = express.Router();

router.get("/search", async (req, res) => {
  const parsedSearchQuery = LetterSearchSchema.safeParse(req.query);
  if (!parsedSearchQuery.success) {
    res.status(400).json({ error: "Invalid search, forehead" });
    return;
  }
  const { corpusIds, yearFrom, yearTo, page, pageSize } =
    parsedSearchQuery.data;

  const conditions: WhereOptions[] = [];
  if (yearFrom !== undefined) conditions.push({ year: { [Op.gte]: yearFrom } });
  if (yearTo !== undefined) conditions.push({ year: { [Op.lte]: yearTo } });

  const { rows, count } = await LetterModel.findAndCountAll({
    attributes: { exclude: ["raw_xml"] },
    where: conditions.length ? { [Op.and]: conditions } : undefined,
    include: [
      {
        model: CollectionModel,
        as: "collection",
        attributes: ["id", "xml_id", "in_corpus"],
        required: true,
        where: corpusIds.length
          ? { in_corpus: { [Op.in]: corpusIds } }
          : undefined,
      },
    ],
    order: [
      ["year", "ASC"],
      ["id", "ASC"],
    ],
    limit: pageSize,
    offset: page * pageSize,
  });

  res.status(200).json(
    parseResponse(LetterSearchResultSchema, {
      total: count,
      rows: rows.map((r): unknown => r.get({ plain: true })),
    }),
  );
});

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
