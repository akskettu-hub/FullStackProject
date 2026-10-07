// Mostly LLM generated: Claude Sonnet 5.5 Medium
import type { ErrorRequestHandler } from "express";
import { describeError, ResponseValidationError } from "../utils/errors.ts";
import { UniqueConstraintError, ValidationError } from "sequelize";

export const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  if (res.headersSent) {
    return next(err);
  }

  const { message, detail, code } = describeError(err);
  console.error(
    `${req.method} ${req.originalUrl} failed:`,
    message,
    "| detail:",
    detail,
    "| code:",
    code,
  );

  if (err instanceof UniqueConstraintError) {
    return res.status(409).json({ error: "Already exists" });
  }

  if (err instanceof ValidationError) {
    return res.status(400).json({ error: message });
  }

  if (err instanceof ResponseValidationError) {
    console.error(`Response failed shcema validation:\n${err.message}`);
    return res.status(500).json({ error: "Internal server error" });
  }

  res.status(500).json({ error: message }); // TODO: raw messages should not be returned in prod
};
