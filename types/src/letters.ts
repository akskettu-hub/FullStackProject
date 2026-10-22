import { z } from "zod";

export const LetterFields = z.object({
  collection_id: z.number().int().positive(),
  xml_id: z.string().min(1).max(32),
  title_key: z.string().min(1).max(32),
  author_key: z.string().min(1).max(32),
  text_type: z.string().min(1).max(32),
  lang: z.string().min(1).max(32),
  raw_xml: z.string().min(1),
  authenticity: z.string().min(1).max(32),
  year: z.number().int().positive(),
  year_raw: z.string().min(1).max(32),
  year_is_decade_suggestion: z.boolean(),
  year_is_uncertain: z.boolean(),
  relationship_code: z.string().min(1).max(32),
  correspondent_code: z.string().min(1).max(32),
  title_key_parse_ok: z.boolean(),
});

export const NewLetterSchema = LetterFields;
export type NewLetter = z.infer<typeof NewLetterSchema>;

export const LetterSchema = LetterFields.extend({
  id: z.number().int().positive(),
});

export type Letter = z.infer<typeof LetterSchema>;

export const LetterUpdateSchema = LetterFields.partial();
export type LetterUpdate = z.infer<typeof LetterUpdateSchema>;

export const LettersSchema = z.array(LetterSchema);

export const LetterSummarySchema = LetterSchema.omit({
  raw_xml: true,
});

/*
export const CollectionInCorpusSchema = z.object({
  id: z.number().int().positive(),
  xml_id: z.string().min(1).max(32),
});
 */
