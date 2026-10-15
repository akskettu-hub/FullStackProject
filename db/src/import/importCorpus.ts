import { Pool } from "pg";
import { CorpusName } from "../types/CorpusNames.ts";

export const insertCorpus = async (
  corpusName: CorpusName,
  pool: Pool,
): Promise<{ id: number; inserted: Boolean }> => {
  console.log(`Importing Corpus ${corpusName}...`);
  const res = await pool.query(
    `INSERT INTO corpora (name, imported)
    VALUES ($1, now()) 
    ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name
    RETURNING id, (xmax=0) AS inserted`,
    [corpusName],
  );
  return res.rows[0];
};

export const associateCorpusWithCorpusCollection = async (
  corpusId: number,
  corpusCollectionid: number,
  pool: Pool,
): Promise<void> => {
  await pool.query(
    `INSERT INTO corpora_in_corpus_collection (corpus_id, corpus_collection_id)
    VALUES ($1, $2)`,
    [corpusId, corpusCollectionid],
  );
};
