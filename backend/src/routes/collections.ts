import express from "express";
import { Collection, CollectionTitleStatement } from "../models/index.ts";
import { describeError } from "../utils/errors.ts";

const router = express.Router();

router.get("/", async (_req, res) => {
  try {
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
    //res.header("Access-Control-Allow-Origin", "*");
    res.json(collections);
  } catch (e) {
    const { message, detail, code } = describeError(e);
    console.error("Sequalize error:", message);
    //console.error("Original error:", original);
    console.error(
      "Sequalize error:",
      message,
      "| detail:",
      detail,
      "| code:",
      code,
    );
    res.status(500).json({ error: message });
  }
});

export default router;
