import path from "node:path";
import { validateCorpus } from "./validateCorpus.ts";
import { validateDirectory } from "./validateDirectory.ts";

export const validateCorpusCollection = async () => {
  const corpusCollectionPath = "./data/CEEC-400/";

  const validateCorpusCollectionDir = await validateDirectory(
    corpusCollectionPath,
    "corpus collection",
  );
  if (!validateCorpusCollectionDir.valid) {
    validateCorpusCollectionDir.errors?.forEach((e) =>
      console.error(`${e.code}: ${e.message}`),
    );
    return;
  }
  const corpora = ["CEEC-xml", "CEECE-xml", "CEECSU-xml"];

  for (const c of corpora) {
    await validateCorpus(path.join(corpusCollectionPath, c));
  }
};

export const importCorpusCollection = async () => {
  // TODO: implement importing corpus collection
  /*
  const corpora = ["CEEC-xml", "CEECE-xml", "CEECSU-xml"];

  const corpusCollectionPath = "./data/CEEC-400/";

  for (const c of corpora) {
    await importCorpus(path.join(corpusCollectionPath, c));
  }
   */
};

validateCorpusCollection();
