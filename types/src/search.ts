import { z } from "zod";

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
