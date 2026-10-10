import { validateCollection } from "./validateCollection.ts";
import fs from "node:fs";
import path from "node:path";
import { checkTeiEntries } from "./validateTEI.ts";

export const validateCorpus = async (corpusPath: string) => {
  const paths = fs.readdirSync(corpusPath);
  // first validate corpus
  // if success, validate collection
  // TODO: validate corpus here

  for (const p of paths) {
    const result = validateCollection(path.join(corpusPath, p));

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
