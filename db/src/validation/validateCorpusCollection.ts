import path from "node:path";
import { validateCorpus, ValidatedCorpus } from "./validateCorpus.ts";
import { validateDirectory } from "./validateDirectory.ts";
import { errorCodeAndMsg, errorsToStr } from "../util/validationErrorsToStr.ts";

export type CorpusCollectionValidationIssue = {
  code: "DIR_ISSUE" | "CORPUS_ISSUE";
  message: string;
};

export type ValidatedCorpusCollection = {
  name: string;
  corpora: ValidatedCorpus[];
};

export type CorpusCollectionValidationResult =
  | {
      valid: true;
      corpusCollectionPath: string;
      data: ValidatedCorpusCollection;
    }
  | {
      valid: false;
      corpusCollectionPath: string;
      errors: CorpusCollectionValidationIssue[];
    };

export const printCorpusCollectionIssues = (
  result: CorpusCollectionValidationResult,
): void => {
  if (!result.valid) {
    result.errors.forEach((e) => {
      console.error(e.code, e.message);
    });
    return;
  }
};

const fail = (
  code: CorpusCollectionValidationIssue["code"],
  corpusCollectionPath: string,
  message: string,
): CorpusCollectionValidationResult => {
  return { valid: false, corpusCollectionPath, errors: [{ code, message }] };
};

const CORPUS_NAMES = ["CEEC", "CEECE", "CEECSU"] as const; //TODO: Figure out how to centralise this
export type CorpusName = (typeof CORPUS_NAMES)[number];

export const validateCorpusCollection = async (
  corpusCollectionPath: string,
  corpusCollectionName: string,
): Promise<CorpusCollectionValidationResult> => {
  const validateCorpusCollectionDir = await validateDirectory(
    corpusCollectionPath,
    "corpus collection",
  );
  const errors: errorCodeAndMsg[] = [];

  if (!validateCorpusCollectionDir.valid) {
    validateCorpusCollectionDir.errors?.forEach((e) => {
      errors.push({ code: e.code, message: e.message });
    });
    return fail("DIR_ISSUE", corpusCollectionPath, errorsToStr(errors));
  }

  const validatedCorpora: ValidatedCorpus[] = [];

  for (const c of CORPUS_NAMES) {
    const fileName = `${c}-xml`;

    const corpusRes = await validateCorpus(
      path.join(corpusCollectionPath, fileName),
      c,
    );

    if (!corpusRes?.valid) {
      corpusRes?.errors.forEach((e) => {
        errors.push({
          code: e.code,
          message: `${c}: ${corpusRes.corpusPath}: ${e.message}`,
        });
      });
      continue;
    }
    validatedCorpora.push(corpusRes.data);
  }

  const corpusCollectionValidationIssues: CorpusCollectionValidationIssue[] =
    [];
  if (errors.length > 0) {
    errors.forEach((e) => {
      corpusCollectionValidationIssues.push({
        code: "CORPUS_ISSUE",
        message: e.message,
      });
    });
    return {
      valid: false,
      corpusCollectionPath,
      errors: corpusCollectionValidationIssues,
    };
  }

  return {
    valid: true,
    corpusCollectionPath,
    data: { name: corpusCollectionName, corpora: validatedCorpora },
  };
};
