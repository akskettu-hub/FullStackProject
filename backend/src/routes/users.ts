import express from "express";
import { User } from "../models/index.ts";
import { describeError } from "../utils/errors.ts";
import { z } from "zod";

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

router.get("/:id", async (req, res) => {
  try {
    const user: User | null = await User.findByPk(req.params.id);
    res.header("Access-Control-Allow-Origin", "*");
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ error: "User not found" });
    }
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

const createUserSchema = z.object({
  username: z.string().min(3).max(32),
  name: z.string().min(1).max(32),
  email: z.email(),
});

router.post("/", async (req, res) => {
  const parsedBody = createUserSchema.safeParse(req.body);
  if (!parsedBody) {
    res.status(400).json({ error: z.treeifyError(parsedBody) });
  }
  console.log(parsedBody);
  try {
    const user: User = await User.create(parsedBody.data);
    res.status(201).json(user);
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
