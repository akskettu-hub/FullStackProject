import { validateCollection } from "./validateCollection.ts";
import fs from "node:fs";
import path from "node:path";

export const validateCorpus = async (corpusPath: string) => {
  const paths = fs.readdirSync(corpusPath);

  for (const p of paths) {
    const result = await validateCollection(path.join(corpusPath, p));

    if (!result.valid) {
      result.errors?.forEach((e) => console.error(`${e.code}: ${e.message}`));
    } else {
      console.log(
        `Validation Success: ${result.data?.teiEntries.length} tei, ${result.data?.titleStmts.length} titleStmts`,
      );
    }
  }
};
