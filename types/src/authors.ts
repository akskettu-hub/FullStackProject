import { z } from "zod";

export const AuthorSummarySchema = z.object({
  authorKey: z.string().min(1).max(64),
  letterCount: z.coerce.number(),
  minYear: z.number().nullable(),
  maxYear: z.number().nullable(),
});

export const AuthorSummariesSchema = z.array(AuthorSummarySchema);

export type AuthorSummary = z.infer<typeof AuthorSummarySchema>;
export type AuthorSummaries = z.infer<typeof AuthorSummariesSchema>;
