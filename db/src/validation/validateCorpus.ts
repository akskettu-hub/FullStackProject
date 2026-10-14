import {
  CollectionValidationResult,
  validateCollection,
} from "./validateCollection.ts";
import { checkTeiEntries, CheckTeiEntriesResult } from "./validateTEI.ts";
import { validateDirectory } from "./validateDirectory.ts";
import { errorCodeAndMsg, errorsToStr } from "../util/validationErrorsToStr.ts";
import { CorpusName } from "../types/CorpusNames.ts";

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
  name: CorpusName;
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

export const validateCorpus = async (
  corpusPath: string,
  corpusName: CorpusName,
): Promise<CorpusValidationResult> => {
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

  return {
    valid: true,
    corpusPath,
    data: { name: corpusName, collections, teiChecks },
  };
};
