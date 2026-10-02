import express from "express";
import { User } from "../models/index.ts";
import { describeError } from "../utils/errors.ts";

const router = express.Router();

router.get("/", async (_req, res) => {
  try {
    const users: User[] = await User.findAll();
    res.header("Access-Control-Allow-Origin", "*");
    res.json(users);
  } catch (e) {
    const { message, detail, code } = describeError(e);
    console.error("Sequalize error:", message);
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
