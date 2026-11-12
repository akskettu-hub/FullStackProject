import { z } from "zod";
import { LetterSummarySchema } from "./letters.ts";
import { CorpusCollectionsWithCorporaSchema } from "./corpusRelations.ts";
import { CorpusInCorpusCollectionSchema } from "./corpora.ts";
import { IdSchema } from "./shared.ts";
// NOTE: Do not export from this file to anywhere else than index

export const SearchOptionsCorpusCollectionsSchema = z.array(
  CorpusCollectionsWithCorporaSchema.element.extend({
    corpora: z.array(
      CorpusInCorpusCollectionSchema.extend({
        minYear: z.number().nullable(),
        maxYear: z.number().nullable(),
      }),
    ),
  }),
);

export type SearchOptionsCorpusCollections = z.infer<
  typeof SearchOptionsCorpusCollectionsSchema
>;

export const SearchOptionsSchema = z.object({
  corpusCollections: SearchOptionsCorpusCollectionsSchema,
  authenticity: z.array(z.string()),
  relationshipCodes: z.array(z.string()),
});

export type SearchOptions = z.infer<typeof SearchOptionsSchema>;

export const YearRangeRowSchema = z.object({
  id: IdSchema,
  minYear: z.number().nullable(),
  maxYear: z.number().nullable(),
});

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
  year: z.number(),
  count: z.coerce.number(),
});

export const HistogramResponseSchema = z.object({
  rows: z.array(HistogramRowSchema),
  undated: z.number(),
});

export type HistogramResponse = z.infer<typeof HistogramResponseSchema>;

export const CORPUS_NAMES = ["CEEC", "CEECSU", "CEECE"] as const;
export type CorpusName = (typeof CORPUS_NAMES)[number];

export const AUTHENTICITY_CODES = ["A", "B", "C", "D", "E"] as const;
export const AuthenticityCodeSchema = z.enum(AUTHENTICITY_CODES);
export type AuthenticityCode = z.infer<typeof AuthenticityCodeSchema>;

export const AuthenticityCodeOptionsSchema = z.set(AuthenticityCodeSchema);
export type AuthenticityCodeOptions = z.infer<
  typeof AuthenticityCodeOptionsSchema
>;

export const AuthenticityCombinationsAllowedSchema = z.boolean().default(true);
export type AuthenticityCombinationsAllowed = z.infer<
  typeof AuthenticityCombinationsAllowedSchema
>;
