import { z } from "zod";
import { LetterSummarySchema } from "./letters.ts";
// NOTE: Do not export from this file to anywhere else than index

export const SearchYearSpanSchema = z.object({
  minYear: z.number().min(800).max(2500).nullable(),
  maxYear: z.number().min(800).max(2500).nullable(),
});

export type SearchYearSpan = z.infer<typeof SearchYearSpanSchema>;

export type SearchQueryParams = {
  corpusIds: string;
  yearFrom: string;
  yearTo: string;
};

export type SearchFilters = {
  corpusIds: number[];
  yearFrom: number;
  yearTo: number;
};

export type PaginationModel = { page: number; pageSize: number };

export const LetterSearchSchema = z.object({
  corpusIds: z
    .string()
    .transform((s) => s.split(",").map(Number))
    .pipe(z.array(z.number().int().positive())), // TODO: it would be better if this checked the id from some central source
  yearFrom: z.coerce.number().int().optional(),
  yearTo: z.coerce.number().int().optional(),
  page: z.coerce.number().int().min(0).default(0),
  pageSize: z.coerce.number().int().min(1).max(100).default(25),
});

export type LetterSearch = z.infer<typeof LetterSearchSchema>;

export const LetterSearchResultSchema = z.object({
  total: z.number(),
  rows: z.array(LetterSummarySchema),
});

export type LetterSearchResult = z.infer<typeof LetterSearchResultSchema>;

export const HistogramRowSchema = z.object({
  year: z.number().nullable(),
  count: z.coerce.number(),
});

export const HistogramResponseSchema = z.object({
  rows: z.array(HistogramRowSchema),
  undated: z.number(),
});
