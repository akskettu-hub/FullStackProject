// Partially LLM generated: Claude Sonnet 5.5 Medium
import { Pool } from "pg";
import { ValidatedCollection } from "../validation/validateCollection.ts";
import { importLetters } from "./importLetters.ts";

// TODO: Needs error handling
export const importCollection = async (
  validatedCollection: ValidatedCollection,
  corpusId: number,
  pool: Pool,
) => {
  const colRes = await pool.query(
    `INSERT INTO collections (xml_id, in_corpus) 
      VALUES ($1, $2) 
      ON CONFLICT (xml_id) DO UPDATE SET xml_id = EXCLUDED.xml_id RETURNING id`,
    [validatedCollection.xmlId, corpusId],
  );
  const colId = colRes.rows[0].id;

  validatedCollection.titleStmts.forEach(async (t, i) => {
    await pool.query(
      `INSERT INTO collection_title_statements (collection_id, seq, text) VALUES ($1, $2, $3)`,
      [colId, i, t],
    );
  });

  const teiRecords = validatedCollection.teiEntries.flatMap((v) =>
    v.ok ? [v.record] : [],
  );

  await importLetters(pool, teiRecords, colId);
};
