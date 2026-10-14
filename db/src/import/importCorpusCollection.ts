import {
  associateCorpusWithCorpusCollection,
  insertCorpus,
  insertCorpusCollection,
} from "../importTEI.ts";
import { validateCorpusCollection } from "../validation/validateCorpusCollection.ts";
import { importCollection } from "./importCollection.ts";

export const importCorpusCollection = async () => {
  const corpusCollectionValidationResult = await validateCorpusCollection(
    "./test/",
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
    const { id, inserted } = await insertCorpus(corpus.name);
    if (!inserted) {
      console.warn(`import for ${corpus.name} failed... Skipping.`);
    }
    console.log(`id: ${id}, inserted: ${inserted}`);

    if (corpusCollectionInserted && inserted) {
      console.warn(
        "Corpus and corpus collection already inserted. Skipping association...",
      );
    } else {
      await associateCorpusWithCorpusCollection(id, corpusCollectionId);
    }
    corpus.collections.forEach((col) => {
      importCollection(pool, col.data, id);
    });
  }
};
