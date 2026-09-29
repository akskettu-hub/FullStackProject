// Completely LLM generated: Claude Sonnet 5 medium.
import { BaseError as SequelizeBaseError } from "sequelize";

interface PgOriginalError {
  message: string;
  code?: string;
  detail?: string;
}

function hasOriginal(err: unknown): err is { original: PgOriginalError } {
  return typeof err === "object" && err !== null && "original" in err;
}

export function describeError(err: unknown): {
  message: string;
  detail?: string;
  code?: string;
} {
  if (err instanceof SequelizeBaseError) {
    const original = hasOriginal(err) ? err.original : undefined;
    return {
      message: err.message,
      detail: original?.detail,
      code: original?.code,
    };
  }
  if (err instanceof Error) {
    return { message: err.message };
  }
  return { message: String(err) };
}
