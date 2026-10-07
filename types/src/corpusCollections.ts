import { z } from "zod";

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

export const CorpusCollectionToCorpusSchema = z.object({
  id: z.number().int().positive(),
  name: z.string().min(1).max(32),
});
