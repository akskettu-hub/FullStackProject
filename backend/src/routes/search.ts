import express from "express";

import { CollectionModel, LetterModel } from "../models/index.ts";
import { parseRequest, parseResponse } from "../utils/errors.ts";
import {
  HistogramResponseSchema,
  HistogramRowSchema,
  LetterSearchResultSchema,
  LetterSearchSchema,
  SearchOptionsSchema,
} from "@mono/types";
import type { WhereOptions } from "sequelize";
import { col, fn, Op } from "sequelize";
import { z } from "zod";
import { getSearchOptions } from "../services/searchOptions.ts";

const router = express.Router();

router.get("/", async (req, res) => {
  const parsedSearchQuery = parseRequest(LetterSearchSchema, req.query);
  const { corpusIds, yearFrom, yearTo, page, pageSize } = parsedSearchQuery;

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

router.get("/histogram", async (req, res) => {
  const parsedSearchQuery = parseRequest(LetterSearchSchema, req.query);
  const { corpusIds, yearFrom, yearTo } = parsedSearchQuery;

  const conditions: WhereOptions[] = [];
  if (yearFrom !== undefined) conditions.push({ year: { [Op.gte]: yearFrom } });
  if (yearTo !== undefined) conditions.push({ year: { [Op.lte]: yearTo } });

  const rawRows = await LetterModel.findAll({
    where: conditions.length ? { [Op.and]: conditions } : undefined,
    attributes: [
      ["year", "year"],
      [fn("COUNT", fn("DISTINCT", col("LetterModel.id"))), "count"],
    ],
    include: [
      {
        model: CollectionModel,
        as: "collection",
        attributes: [],
        required: true,
        where: corpusIds.length
          ? { in_corpus: { [Op.in]: corpusIds } }
          : undefined,
      },
    ],
    group: ["LetterModel.year"],
    order: [[col("year"), "ASC"]],
    raw: true,
  });

  const parsed = z.array(HistogramRowSchema).parse(rawRows);

  let undated = 0;
  const rows: { year: number; count: number }[] = [];

  for (const row of parsed) {
    if (row.year === null) undated = row.count;
    else rows.push({ year: row.year, count: row.count });
  }

  res
    .status(200)
    .json(parseResponse(HistogramResponseSchema, { rows, undated }));
});

router.get("/options", async (_req, res): Promise<void> => {
  const options = await getSearchOptions();

  res.status(200).json(parseResponse(SearchOptionsSchema, options));
});

export default router;
