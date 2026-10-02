import express from "express";
import { z } from "zod";
import { User } from "../models/index.ts";

const router = express.Router();

router.get("/", async (_req, res) => {
  const users: User[] = await User.findAll();
  res.header("Access-Control-Allow-Origin", "*");
  res.json(users);
});

router.get("/:id", async (req, res) => {
  const user: User | null = await User.findByPk(req.params.id);
  res.header("Access-Control-Allow-Origin", "*");
  if (user) {
    res.json(user);
  } else {
    res.status(404).json({ error: "User not found" });
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
  const user: User = await User.create(parsedBody.data);
  res.status(201).json(user);
});

export default router;
