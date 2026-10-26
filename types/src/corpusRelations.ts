import { z } from "zod";
import { CorpusSchema, CorpusInCorpusCollectionSchema } from "./corpora.ts";
import {
  CorpusCollectionSchema,
  CorpusCollectionToCorpusSchema,
} from "./corpusCollections.ts";
import { CollectionInCorpusSchema, CollectionSchema } from "./collections.ts";

export const CorpusWithCorpusCollectionsSchema = CorpusSchema.extend({
  corpus_collections: z.array(CorpusCollectionToCorpusSchema),
});

export type CorpusWithCorpusCollections = z.infer<
  typeof CorpusWithCorpusCollectionsSchema
>;

export const CorpusWithCollectionsSchema = CorpusSchema.extend({
  collections: z.array(CollectionInCorpusSchema),
});

export const CorporaWithCorpusCollectionsSchema = z.array(
  CorpusWithCorpusCollectionsSchema,
);

export type CorpusWithCollections = z.infer<typeof CorpusWithCollectionsSchema>;
export const CorporaWithCollectionsSchema = z.array(
  CorpusWithCollectionsSchema,
);

export const CorpusCollectionWithCorporaSchema = CorpusCollectionSchema.extend({
  corpora: z.array(CorpusInCorpusCollectionSchema),
});
export type CorpusCollectionWithCorpora = z.infer<
  typeof CorpusCollectionWithCorporaSchema
>;
export const CorpusCollectionsWithCorporaSchema = z.array(
  CorpusCollectionWithCorporaSchema,
);

export type CorpusCollectionsWithCorpora = z.infer<
  typeof CorpusCollectionsWithCorporaSchema
>;

export const CorpusSummarySchema = CorpusInCorpusCollectionSchema.extend({
  collectionCount: z.number(),
  letterCount: z.number(),
  minYear: z.number(),
  maxYear: z.number(),
});

export type CorpusSummary = z.infer<typeof CorpusSummarySchema>;

export const CorpusCollectionSummarySchema = CorpusCollectionSchema.extend({
  corpusCount: z.coerce.number(),
  collectionCount: z.coerce.number(),
  letterCount: z.coerce.number(),
  minYear: z.number(),
  maxYear: z.number(),
});

export type CorpusCollectionSummary = z.infer<
  typeof CorpusCollectionSummarySchema
>;

export const CollectionSummarySchema = CollectionSchema.extend({
  letterCount: z.coerce.number(),
  minYear: z.number().nullable(),
  maxYear: z.number().nullable(),
});

export const CollectionSummariesSchema = z.array(CollectionSummarySchema);

export type CollectionSummary = z.infer<typeof CollectionSummarySchema>;
export type CollectionSummaries = z.infer<typeof CollectionSummariesSchema>;
