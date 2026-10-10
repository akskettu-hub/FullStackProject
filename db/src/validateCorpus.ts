import { validateCollection } from "./validateCollection.ts";
import { checkTeiEntries } from "./validateTEI.ts";
import { validateDirectory } from "./validateDirectory.ts";

export const validateCorpus = async (corpusPath: string) => {
  // first validate corpus, which just means that the dir exists
  const validateCorpusDir = await validateDirectory(corpusPath, "corpus");
  if (!validateCorpusDir.valid) {
    validateCorpusDir.errors?.forEach((e) =>
      console.error(`${e.code}: ${e.message}`),
    );
    return;
  }

  for (const f of validateCorpusDir.files) {
    const result = validateCollection(f);

    if (!result.valid) {
      result.errors?.forEach((e) => console.error(`${e.code}: ${e.message}`));
      continue;
    }
    console.log(
      `Validation Success: ${result.data.xmlId}: ${result.data?.teiEntries.length} tei, ${result.data?.titleStmts.length} titleStmts`,
    );

    const teiEntriesCheckResult = checkTeiEntries(result.data?.teiEntries);
    console.log("TEI Entries: ", teiEntriesCheckResult);
  }
};

export const importCorpus = async (
  corpusCollectionPath: string,
  corpusDirName: string,
  corpusCollectionId: number,
) => {
  // TODO: implement corpus import
};
