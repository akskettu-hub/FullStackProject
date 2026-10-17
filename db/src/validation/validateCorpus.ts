import type { CollectionValidationResult } from "./validateCollection.ts";
import { validateCollection } from "./validateCollection.ts";
import { validateDirectory } from "./validateDirectory.ts";
import type { errorCodeAndMsg } from "../util/validationErrorsToStr.ts";
import { errorsToStr } from "../util/validationErrorsToStr.ts";
import type { CorpusName } from "../types/CorpusNames.ts";

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
};

export type CorpusValidationResult =
  | { valid: true; corpusPath: string; data: ValidatedCorpus }
  | { valid: false; corpusPath: string; errors: CorpusValidationIssue[] };

export const printCorpusIssues = (result: CorpusValidationResult): void => {
  if (!result.valid) {
    result.errors.forEach((e) => {
      console.error(e.code, e.message);
    });
  }
  return;
};

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

  for (const f of validateCorpusDir.files) {
    const result = validateCollection(f);

    if (!result.valid) {
      result.errors?.forEach((e) => {
        errors.push({ code: e.code, message: e.message });
      });
      continue;
    }
    collections.push(result);
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

  return {
    valid: true,
    corpusPath,
    data: { name: corpusName, collections },
  };
};
