import { z } from "zod";

export const CorpusFields = z.object({
  name: z.string().min(1).max(32),
});

export const NewCorpusSchema = CorpusFields;
export type NewCorpus = z.infer<typeof NewCorpusSchema>;

export const CorpusSchema = CorpusFields.extend({
  id: z.number().int().positive(),
  imported: z.date(),
});

export const CorpusUpdateSchema = CorpusFields.partial();
export type CorpusUpdate = z.infer<typeof CorpusUpdateSchema>;

export const CorporaSchema = z.array(CorpusSchema);
