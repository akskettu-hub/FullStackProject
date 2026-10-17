import type { Pool } from "pg";
import type { DocumentRecord } from "../validation/validateTEI.ts";

// TODO: Needs error handling
export const importLetters = async (
  pool: Pool,
  teiEntries: DocumentRecord[],
  collectionId: number,
): Promise<void> => {
  try {
    for (const t of teiEntries) {
      await pool.query(
        `INSERT INTO documents (collection_id, xml_id, title_key, author_key, text_type, lang, raw_xml, authenticity, year, year_raw, year_is_decade_suggestion, year_is_uncertain,
     relationship_code, correspondent_code, title_key_parse_ok)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15)`,
        [
          collectionId,
          t.xmlId,
          t.titleKey ?? null,
          t.authorKey ?? null,
          t.textType ?? null,
          t.lang ?? null,
          t.rawXml, // TODO: placeholder — text includes !ENTITY tags for special charachters
          t.authenticity,
          t.year,
          t.yearRaw,
          t.yearIsDecadeSuggestion,
          t.yearIsUncertain,
          t.relationshipCode,
          t.correspondentCode,
          t.titleKeyParseOk,
        ],
      );
    }
  } catch (e) {
    console.error(e);
  }
};
