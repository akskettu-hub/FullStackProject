import {
  CorpusCollectionValidationResult,
  validateCorpusCollection,
} from "./validateCorpusCollection.ts";

export const runValidateCorpusCollection =
  async (): Promise<CorpusCollectionValidationResult> => {
    const res = await validateCorpusCollection("./data/CEEC-400/", "CEEC-400");
    if (res.valid) {
      console.log(`Corpus Collection validation success: ${res.data.name}`);
      res.data.corpora.forEach((c) => {
        console.log(
          `${c.name}: ${c.collections.length} collections, ${c.teiChecks.reduce((acc, cur) => acc + cur.importable, 0)}/${c.teiChecks.reduce((acc, cur) => acc + cur.total, 0)} tei importable`,
        );
        const failed = c.teiChecks.filter((t) => t.failed.length > 0);
        if (failed.length > 0) {
          failed.forEach((f) => {
            f.failed.forEach((fa) =>
              console.error(`${fa.xmlId}: ${fa.issues}`),
            );
          });
        }

        const warnings = c.teiChecks.filter((t) => t.withWarnings.length > 0);
        if (warnings.length > 0) {
          warnings.forEach((f) => {
            f.withWarnings.forEach((w) => {
              console.warn(`${w.xmlId}: importable with issues`);
              console.warn(w.issues);
            });
          });
        }
      });
    } else {
      console.error("Corpus Collection validation failed:");
      res.errors.forEach((e) => console.error(`${e.code}: ${e.message}`));
    }
    return res;
  };

runValidateCorpusCollection();
