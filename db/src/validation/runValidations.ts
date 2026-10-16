import { CollectionValidationResult } from "./validateCollection.ts";
import { CorpusValidationResult } from "./validateCorpus.ts";
import {
  CorpusCollectionValidationResult,
  validateCorpusCollection,
} from "./validateCorpusCollection.ts";
import { CheckTeiEntriesResult } from "./validateTEI.ts";
export const printCorpusCollectionIssues = (
  result: CorpusCollectionValidationResult,
) => {
  if (!result.valid) {
    result.errors.forEach((e) => {
      console.error(e.code, e.message);
    });
    return;
  }
};

export const printCorpusIssues = (result: CorpusValidationResult) => {
  if (!result.valid) {
    result.errors.forEach((e) => {
      console.error(e.code, e.message);
    });
  }
  return;
};

export const printCollectionIssues = (result: CollectionValidationResult) => {
  if (!result.valid) {
    result.errors.forEach((e) => {
      console.error(e.code, e.message);
    });
  }
  return;
};

export const printTeiIssues = (result: CheckTeiEntriesResult) => {
  if (result.failed.length > 0) {
    result.failed.forEach((e) => {
      console.error(`${e.xmlId} issues:`);
      e.issues.forEach((i) => console.error(i.severity, i.message));
    });
  }
  return;
};

export const printTeiWarnings = (result: CheckTeiEntriesResult) => {
  if (result.withWarnings.length > 0) {
    result.withWarnings.forEach((w) => {
      console.warn(`${w.xmlId} with warnings:`);
      w.issues.map((i) => console.warn(i));
    });
  }
};

export const runValidateCorpusCollection =
  async (): Promise<CorpusCollectionValidationResult> => {
    const res = await validateCorpusCollection("./data/CEEC-400/", "CEEC-400");

    if (res.valid) {
      res.data.corpora.forEach((corpus) => {
        //Corpus level
        //Each corpus should be valid
        let validCollections = 0;
        let validTei = 0;
        let totalTei = 0;
        corpus.collections.forEach((collection) => {
          //Collection level
          if (collection.valid) {
            validCollections += 1;
            validTei += collection.data.teiChecks.importable;
            totalTei += collection.data.teiChecks.total;
            printTeiIssues(collection.data.teiChecks);
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
