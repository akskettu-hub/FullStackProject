import { z } from "zod";

export const CollectionFields = z.object({
  xml_id: z.string().min(1).max(32),
  in_corpus: z.number().int().positive(),
});

export const NewCollectionSchema = CollectionFields;
export type NewCollection = z.infer<typeof NewCollectionSchema>;

export const CollectionSchema = CollectionFields.extend({
  id: z.number().int().positive(),
});

export const CollectionUpdateSchema = CollectionFields.partial();
export type CollectionUpdate = z.infer<typeof CollectionUpdateSchema>;

export const CollectionIdSchema = z.coerce.number().int().positive();
export const CollectionsSchema = z.array(CollectionSchema);
