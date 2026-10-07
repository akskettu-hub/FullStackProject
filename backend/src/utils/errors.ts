// Completely LLM generated: Claude Sonnet 5 medium.
import { BaseError as SequelizeBaseError } from "sequelize";
import type z from "zod";

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

export const summariseZodIssues = (
  error: z.ZodError,
  maxGroups: number = 5,
): string => {
  const groups = new Map<string, { message: string; count: number }>();

  for (const issue of error.issues) {
    const path = issue.path
      .map((p) => (typeof p === "number" ? "[]" : String(p)))
      .join(".");
    const key = `${path} | ${issue.message}`;
    const group = groups.get(key);

    if (group) group.count++;
    else groups.set(key, { message: `${path}: ${issue.message}`, count: 1 });
  }

  const lines = [...groups.values()]
    .slice(0, maxGroups)
    .map((g) => `${g.message} (x${g.count})`);
  const hidden = groups.size - lines.length;
  if (hidden > 0) lines.push(`...and ${hidden} more kinds of issue`);
  return lines.join("\n");
};

export class ResponseValidationError extends Error {}

export const parseResponse = <S extends z.ZodType>(
  schema: S,
  data: unknown,
): z.infer<S> => {
  const result = schema.safeParse(data);
  if (!result.success) {
    throw new ResponseValidationError(summariseZodIssues(result.error));
  }
  return result.data;
};
