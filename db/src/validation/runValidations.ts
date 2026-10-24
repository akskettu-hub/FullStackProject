import { printCollectionIssues } from "./validateCollection.ts";
import type { CorpusCollectionValidationResult } from "./validateCorpusCollection.ts";
import {
  printCorpusCollectionIssues,
  validateCorpusCollection,
} from "./validateCorpusCollection.ts";
import { printTeiIssues, printTeiWarnings } from "./validateTEI.ts";

export const runValidateCorpusCollection =
  async (): Promise<CorpusCollectionValidationResult> => {
    const res = await validateCorpusCollection("./data/CEEC-400/", "CEEC-400");

    if (res.valid) {
      let totalCollections = 0;
      let totalValidCollections = 0;
      let totalTei = 0;
      let totalValidTei = 0;
      res.data.corpora.forEach((corpus) => {
        //Corpus level
        const validCollections = corpus.collections.filter((col) => col.valid);
        const nValidCollections = validCollections.length;
        const validTei = validCollections.reduce(
          (acc, vCol) => acc + vCol.data.teiChecks.importable,
          0,
        );
        const nTei = validCollections.reduce(
          (acc, vCol) => acc + vCol.data.teiChecks.total,
          0,
        );

        totalCollections += corpus.collections.length;
        totalValidCollections += validCollections.length;
        totalTei += nTei;
        totalValidTei += validTei;
        corpus.collections.forEach((collection) => {
          //Collection level
          if (collection.valid) {
            if (collection.data.teiChecks.failed.length > 0)
              console.error(
                `ERROR: Tei failed: ${collection.data.teiChecks.failed.length}`,
              );
            printTeiIssues(collection.data.teiChecks); // Should always print nothing because collection should fail if there are tei errors, here for diagonstics

            if (collection.data.teiChecks.withWarnings.length > 0)
              console.warn(
                `WARN: Tei with warnings: ${collection.data.teiChecks.withWarnings.length}`,
              );
            printTeiWarnings(collection.data.teiChecks);
          } else {
            console.error(
              `Collection Validation Fail: ${collection.collectionPath}`,
            );
            printCollectionIssues(collection);
          }
        });
        console.log(
          `${corpus.name}: ${nValidCollections}/${corpus.collections.length} collections valid. ${validTei}/${nTei} tei importable.`,
        );
      });
      console.log(
        `${res.data.name}: ${totalValidCollections}/${totalCollections} collections valid. ${totalValidTei}/${totalTei} tei importable.`,
      );
    } else {
      printCorpusCollectionIssues(res);
    }

    return res;
  };

void runValidateCorpusCollection();
