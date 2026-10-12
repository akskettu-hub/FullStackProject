import {
  CollectionValidationResult,
  validateCollection,
} from "./validateCollection.ts";
import { checkTeiEntries, CheckTeiEntriesResult } from "./validateTEI.ts";
import { validateDirectory } from "./validateDirectory.ts";

export type CorpusValidationIssue = {
  code:
    | "DIR_ISSUE"
    | "NOT_A_FILE"
    | "FILE_UNREADABLE"
    | "COLLECTION_ISSUE"
    | "NO_TEI_CHECKS_FOUND";
  message: string;
};

export type ValidatedCorpus = {
  name: string;
  collections: CollectionValidationResult[];
  teiChecks: CheckTeiEntriesResult[];
};

export type CorpusValidationResult =
  | { valid: true; corpusPath: string; data: ValidatedCorpus }
  | { valid: false; corpusPath: string; errors: CorpusValidationIssue[] };

const fail = (
  code: CorpusValidationIssue["code"],
  corpusPath: string,
  message: string,
): CorpusValidationResult => {
  return { valid: false, corpusPath, errors: [{ code, message }] };
};

type errorCodeAndMsg = { code: string; message: string };

const errorsToStr = (errors: errorCodeAndMsg[]): string => {
  return errors
    .map(
      (codeAndMsg: errorCodeAndMsg) =>
        `${codeAndMsg.code}: ${codeAndMsg.message}\n`,
    )
    .join("");
};

export const validateCorpus = async (
  corpusPath: string,
  corpusName: string,
): Promise<CorpusValidationResult> => {
  // first validate corpus, which just means that the dir exists
  const validateCorpusDir = await validateDirectory(corpusPath, "corpus");
  const errors: errorCodeAndMsg[] = [];

  if (!validateCorpusDir.valid) {
    validateCorpusDir.errors?.forEach((e) => {
      errors.push({ code: e.code, message: e.message });
    });
    return fail("DIR_ISSUE", corpusPath, errorsToStr(errors));
  }

  const collections: CollectionValidationResult[] = [];
  const teiChecks = [];

  for (const f of validateCorpusDir.files) {
    const result = validateCollection(f);

    if (!result.valid) {
      result.errors?.forEach((e) => {
        errors.push({ code: e.code, message: e.message });
      });
      continue;
    }
    collections.push(result);

    const teiEntriesCheckResult = checkTeiEntries(result.data?.teiEntries);
    teiChecks.push(teiEntriesCheckResult);
  }

  const corpusValidationIssues: CorpusValidationIssue[] = [];
  if (errors.length > 0) {
    errors.map((e) => {
      corpusValidationIssues.push({
        code: "COLLECTION_ISSUE",
        message: `${e.code}: ${e.message}`,
      });
    });
    return { valid: false, corpusPath, errors: corpusValidationIssues };
  }

  if (teiChecks.length < 1) {
    return fail(
      "NO_TEI_CHECKS_FOUND",
      corpusPath,
      `Length of tei checks: ${teiChecks.length}`,
    );
  }

  const validatedCorpus: ValidatedCorpus = {
    name: corpusName,
    collections: collections,
    teiChecks: teiChecks,
  };

  return { valid: true, corpusPath, data: validatedCorpus };
};

// TODO: implement corpus import
/*
export const importCorpus = async (
  corpusCollectionPath: string,
  corpusDirName: string,
  corpusCollectionId: number,
) => {
};
 */
