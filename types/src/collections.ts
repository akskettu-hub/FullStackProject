import { z } from "zod";
import { CollectionTitleStmtFields } from "./collectionTitleStmt.ts";

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

export const CollectionWithTitleStmtsSchema = CollectionSchema.extend({
  titleStatements: z.array(CollectionTitleStmtFields),
});

export type CollectionWithTitleStmts = z.infer<
  typeof CollectionWithTitleStmtsSchema
>;
export const CollectionsWithTitleStmtsSchema = z.array(
  CollectionWithTitleStmtsSchema,
);

export const CollectionInCorpusSchema = z.object({
  id: z.number().int().positive(),
  xml_id: z.string().min(1).max(32),
});
