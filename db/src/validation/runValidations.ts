import { printCollectionIssues } from "./validateCollection.ts";
import {
  CorpusCollectionValidationResult,
  printCorpusCollectionIssues,
  validateCorpusCollection,
} from "./validateCorpusCollection.ts";
import { printTeiIssues, printTeiWarnings } from "./validateTEI.ts";

export const runValidateCorpusCollection =
  async (): Promise<CorpusCollectionValidationResult> => {
    const res = await validateCorpusCollection("./data/CEEC-400/", "CEEC-400");

    if (res.valid) {
      res.data.corpora.forEach((corpus) => {
        //Corpus level
        let validCollections = 0;
        let validTei = 0;
        let totalTei = 0;
        corpus.collections.forEach((collection) => {
          //Collection level
          if (collection.valid) {
            validCollections += 1;
            validTei += collection.data.teiChecks.importable;
            totalTei += collection.data.teiChecks.total;
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
          `${corpus.name}: ${validCollections}/${corpus.collections.length} valid. ${validTei}/${totalTei} importable.`,
        );
      });
    } else {
      printCorpusCollectionIssues(res);
    }

    return res;
  };

runValidateCorpusCollection();
