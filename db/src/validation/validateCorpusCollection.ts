import path from "node:path";
import { validateCorpus } from "./validateCorpus.ts";
import { validateDirectory } from "./validateDirectory.ts";

const CORPUS_NAMES = ["CEEC", "CEECE", "CEECSU"] as const;
export type CorpusName = (typeof CORPUS_NAMES)[number];

export const validateCorpusCollection = async (
  corpusCollectionPath: string,
  corpusCollectionName: string,
) => {
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

  for (const c of CORPUS_NAMES) {
    const fileName = `${c}-xml`;

    const corpusRes = await validateCorpus(
      path.join(corpusCollectionPath, fileName),
    );

    if (!corpusRes?.valid) {
      corpusRes?.errors.forEach((e) => console.error(e.code, e.message));
    }
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

//validateCorpusCollection("./data/CEEC-400/", "CEEC-400");
validateCorpusCollection("./test/", "CEEC-400");
