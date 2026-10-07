import { z } from "zod";
import { CorpusSchema, CorpusInCorpusCollectionSchema } from "./corpora.ts";
import {
  CorpusCollectionSchema,
  CorpusCollectionToCorpusSchema,
} from "./corpusCollections.ts";
import { CollectionInCorpusSchema } from "./collections.ts";

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
