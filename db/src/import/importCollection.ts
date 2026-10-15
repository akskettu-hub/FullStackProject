import { Pool } from "pg";
import { ValidatedCollection } from "../validation/validateCollection.ts";
import { importLetters } from "./importLetters.ts";

export const importCollection = async (
  validatedCollection: ValidatedCollection,
  corpusId: number,
  pool: Pool,
) => {
  console.log(
    `Importing Collection: ${validatedCollection.xmlId}, len teiEntries: ${validatedCollection.teiEntries.length}`,
  );
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

  const failed = validatedCollection.teiEntries.filter((v) => !v.ok);
  console.log(
    "failed:",
    failed.length,
    "of",
    validatedCollection.teiEntries.length,
  );
  for (const f of failed.slice(0, 5)) {
    console.log(f.xmlId, JSON.stringify(f.issues, null, 2));
  }

  const teiRecords = validatedCollection.teiEntries.flatMap((v) =>
    v.ok ? [v.record] : [],
  );
  console.log("len teiRecords", teiRecords.length);
  await importLetters(pool, teiRecords, colId);
};
