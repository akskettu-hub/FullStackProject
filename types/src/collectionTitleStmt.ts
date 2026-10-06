import { z } from "zod";

export const CollectionTitleStmtFields = z.object({
  seq: z.number().int(),
  text: z.string(),
});

export const NewCollectionTitleStmtSchema = CollectionTitleStmtFields;
export type NewCollectionTitleStmt = z.infer<
  typeof NewCollectionTitleStmtSchema
>;

export const CollectionTitleStmtSchema = CollectionTitleStmtFields.extend({
  id: z.number().int().positive(),
  collection_id: z.number().int().positive(),
});

export const CollectionTitleStmtUpdateSchema =
  CollectionTitleStmtFields.partial();
export type CollectionTitleStmtUpdate = z.infer<
  typeof CollectionTitleStmtUpdateSchema
>;

export const CollectionTitleStmtIdSchema = z.coerce.number().int().positive();
export const CollectionTitleStmtsSchema = z.array(CollectionTitleStmtSchema);
