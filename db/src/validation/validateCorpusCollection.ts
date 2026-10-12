import path from "node:path";
import { validateCorpus } from "./validateCorpus.ts";
import { validateDirectory } from "./validateDirectory.ts";
import {
  CheckTeiEntriesResult,
  TeiIssue,
  TeiValidation,
} from "./validateTEI.ts";

const CORPUS_NAMES = ["CEEC", "CEECE", "CEECSU"] as const; //Currently the only extant corpus collection contains these, thus these are hard coded.
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
      c,
    );

    if (!corpusRes?.valid) {
      corpusRes?.errors.forEach((e) =>
        console.error(`${e.code}: ${e.message}`),
      );
      continue;
    }

    console.log(`Corpus validation success: ${corpusRes.data.name}`);
    console.log(
      `Collections in ${corpusRes.data.name}: ${corpusRes.data.collections.length}`,
    );

    const teiChecks: CheckTeiEntriesResult[] = corpusRes.data.teiChecks;
    let totalTei = 0;
    let totalImportable = 0;
    let allFailed: {
      ok: false;
      xmlId: string | null;
      issues: TeiIssue[];
      record: null;
    }[] = [];
    let allWithWarnings: TeiValidation[] = [];

    teiChecks.forEach((t) => {
      totalTei += t.total;
      totalImportable += t.importable;
      t.failed.forEach((f) => allFailed.push(f));
      t.withWarnings.forEach((w) => allWithWarnings.push(w));
    });

    console.log(
      `Total TEI in ${corpusRes.data.name}: ${totalTei}, importable: ${totalImportable}`,
    );
    if (allFailed.length > 0) {
      console.log("\nFailed:");
      allFailed.forEach((f) => {
        console.error(`${f.xmlId}: ${f.issues.length} issues:`);
        f.issues.forEach((i) => console.error(i));
      });
    }

    if (allWithWarnings.length > 0) {
      console.log("\nWarnings:");
      allWithWarnings.forEach((f) => {
        console.error(`${f.xmlId}: ${f.issues.length} issues:`);
        f.issues.forEach((i) => console.error(i));
      });
    }

    console.log("\n========\n");
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

//validateCorpusCollection("./test/", "CEEC-400");
validateCorpusCollection("./data/CEEC-400/", "CEEC-400");
