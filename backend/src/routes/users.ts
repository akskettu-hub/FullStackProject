import express from "express";
import { z } from "zod";
import { UserModel } from "../models/index.ts";
import {
  NewUserSchema,
  UserIdSchema,
  UserSchema,
  UsersSchema,
} from "../../../types/src/index.ts";
import { parseResponse } from "../utils/errors.ts";

const router = express.Router();

router.get("/", async (_req, res): Promise<void> => {
  const users = await UserModel.findAll();

  res.status(200).json(
    parseResponse(
      UsersSchema,
      users.map((u): unknown => u.toJSON()),
    ),
  );
});

router.get("/:id", async (req, res): Promise<void> => {
  const id = UserIdSchema.safeParse(req.params.id);
  if (!id.success) {
    res.status(400).json({ error: "Invalid user id" });
    return;
  }

  const user = await UserModel.findByPk(id.data);
  if (!user) {
    res.status(404).json({ error: "User not found" });
    return;
  }

  res.status(200).json(parseResponse(UserSchema, user.toJSON()));
});

router.post("/", async (req, res): Promise<void> => {
  const parsedBody = NewUserSchema.safeParse(req.body);
  if (!parsedBody.success) {
    res.status(400).json({ error: z.treeifyError(parsedBody.error) });
    return;
  }
  const user: UserModel = await UserModel.create(parsedBody.data);
  res.status(201).json(parseResponse(UserSchema, user.toJSON()));
});

export default router;
