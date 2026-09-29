import express from "express";
import Collection from "../models/collections.ts";
import { describeError } from "../utils/errors.ts";

const router = express.Router();

router.get("/", async (_req, res) => {
  try {
    const collections: Collection[] = await Collection.findAll();
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
