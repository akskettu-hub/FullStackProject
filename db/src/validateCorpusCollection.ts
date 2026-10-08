import path from "node:path";
import { validateCorpus } from "./validateCorpus.ts";

export const validateCorpusCollection = async () => {
  const corpora = ["CEEC-xml", "CEECE-xml", "CEECSU-xml"];

  const corpusCollectionPath = "./data/CEEC-400/";

  for (const c of corpora) {
    await validateCorpus(path.join(corpusCollectionPath, c));
  }
};

validateCorpusCollection();
