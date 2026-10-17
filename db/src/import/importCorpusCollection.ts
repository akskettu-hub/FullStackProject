import { Pool } from "pg";
import { validateCorpusCollection } from "../validation/validateCorpusCollection.ts";
import { importCollection } from "./importCollection.ts";
import {
  associateCorpusWithCorpusCollection,
  insertCorpus,
} from "./importCorpus.ts";

export const pool = new Pool({
  connectionString: "postgres://corpus:corpus@localhost:5432/corpus_dev",
});

export const insertCorpusCollection = async (
  corpusCollectionName: string,
): Promise<{ id: number; inserted: boolean }> => {
  const res = await pool.query<{ id: number; inserted: boolean }>(
    `INSERT INTO corpus_collections (name)
    VALUES ($1) 
    ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name
    RETURNING id, (xmax=0) AS inserted`,
    [corpusCollectionName],
  );
  return res.rows[0];
};

// TODO: Needs error handling
export const importCorpusCollection = async (): Promise<void> => {
  const corpusCollectionValidationResult = await validateCorpusCollection(
    "./data/CEEC-400/",
    "CEEC-400",
  );

  if (!corpusCollectionValidationResult.valid) {
    console.error(`Corpus collection validation failed. Aborting import...`);
    return;
  }

  const { id, inserted } = await insertCorpusCollection(
    corpusCollectionValidationResult.data.name,
  );
  if (!inserted) {
    console.warn("Corpus collection already imported. Skipping...");
  }

  const corpusCollectionId: number = id;
  const corpusCollectionInserted: boolean = inserted;

  for (const corpus of corpusCollectionValidationResult.data.corpora) {
    const { id, inserted } = await insertCorpus(corpus.name, pool);
    if (!inserted) {
      console.warn(`Corpus ${corpus.name} already imported... Skipping.`);
    }

    if (!corpusCollectionInserted && !inserted) {
      console.warn(
        "Corpus and corpus collection already inserted. Skipping association...",
      );
    } else {
      await associateCorpusWithCorpusCollection(id, corpusCollectionId, pool);
    }
    console.log("Importing Collections...");
    for (const col of corpus.collections) {
      if (col.valid) {
        await importCollection(col.data, id, pool);
      }
    }
  }
  await pool.end();
};
