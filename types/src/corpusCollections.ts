import { z } from "zod";
import { CorpusInCorpusCollectionSchema } from "./corpora.ts";

export const CorpusCollectionFields = z.object({
  name: z.string().min(1).max(32),
});

export const NewCorpusCollectionSchema = CorpusCollectionFields;
export type NewCorpusCollection = z.infer<typeof NewCorpusCollectionSchema>;

export const CorpusCollectionSchema = CorpusCollectionFields.extend({
  id: z.number().int().positive(),
});

export const CorpusCollectionUpdateSchema = CorpusCollectionFields.partial();
export type CorpusCollectionUpdate = z.infer<typeof NewCorpusCollectionSchema>;

export const CorpusCollectionsSchema = z.array(CorpusCollectionSchema);

export const CorpusCollectionWithCorporaSchema = CorpusCollectionSchema.extend({
  corpora: z.array(CorpusInCorpusCollectionSchema),
});
export type CorpusCollectionWithCorpora = z.infer<
  typeof CorpusCollectionWithCorporaSchema
>;
export const CorpusCollectionsWithCorporaSchema = z.array(
  CorpusCollectionWithCorporaSchema,
);
