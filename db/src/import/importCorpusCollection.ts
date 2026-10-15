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
): Promise<{ id: number; inserted: Boolean }> => {
  const res = await pool.query(
    `INSERT INTO corpus_collections (name)
    VALUES ($1) 
    ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name
    RETURNING id, (xmax=0) AS inserted`,
    [corpusCollectionName],
  );
  return res.rows[0];
};

export const importCorpusCollection = async () => {
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
  console.log(`Corpus collection inserted. id: ${id}, inserted: ${inserted}`);
  const corpusCollectionId: number = id;
  const corpusCollectionInserted: Boolean = inserted;

  for (const corpus of corpusCollectionValidationResult.data.corpora) {
    const { id, inserted } = await insertCorpus(corpus.name, pool);
    if (!inserted) {
      console.warn(`import for ${corpus.name} failed... Skipping.`);
    }
    console.log(`id: ${id}, inserted: ${inserted}`);

    if (!corpusCollectionInserted && !inserted) {
      console.warn(
        "Corpus and corpus collection already inserted. Skipping association...",
      );
    } else {
      await associateCorpusWithCorpusCollection(id, corpusCollectionId, pool);
    }
    corpus.collections.forEach((col) => {
      if (col.valid) {
        importCollection(col.data, id, pool);
      }
    });
  }
};
