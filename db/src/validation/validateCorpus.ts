import { validateCollection } from "./validateCollection.ts";
import { checkTeiEntries } from "./validateTEI.ts";
import { validateDirectory } from "./validateDirectory.ts";

export type CorpusValidationIssue = {
  code:
    | "DIR_ISSUE"
    | "NOT_A_FILE"
    | "FILE_UNREADABLE"
    | "XML_INVALID"
    | "MISSING_XML_ID"
    | "MISSING_COLLECTION"
    | "MISSING_TITLE_STMT"
    | "MISSING_TEI_ENTRIES";
  message: string;
};

export type ValidatedCorpus = {
  xmlId: string | null;
  titleStmts: unknown[];
  teiEntries: unknown[];
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
type CodeAndMsg = { code: string; message: string };

export const validateCorpus = async (corpusPath: string) => {
  // first validate corpus, which just means that the dir exists
  const validateCorpusDir = await validateDirectory(corpusPath, "corpus");
  if (!validateCorpusDir.valid) {
    const errors: CodeAndMsg[] = [];
    validateCorpusDir.errors?.forEach((e) => {
      //console.error(`${e.code}: ${e.message}`);
      errors.push({ code: e.code, message: e.message });
    });
    const errorsToStr = errors
      .map(
        (codeAndMsg: CodeAndMsg) =>
          `${codeAndMsg.code}: ${codeAndMsg.message}\n`,
      )
      .join("");
    return fail("DIR_ISSUE", corpusPath, errorsToStr);
  }

  for (const f of validateCorpusDir.files) {
    const result = validateCollection(f);

    if (!result.valid) {
      result.errors?.forEach((e) => console.error(`${e.code}: ${e.message}`));
      continue;
    }
    console.log(
      `Validation Success: ${result.data.xmlId}: ${result.data?.teiEntries.length} tei, ${result.data?.titleStmts.length} titleStmts`,
    );

    const teiEntriesCheckResult = checkTeiEntries(result.data?.teiEntries);
    console.log("TEI Entries: ", teiEntriesCheckResult);
  }
};

export const importCorpus = async (
  corpusCollectionPath: string,
  corpusDirName: string,
  corpusCollectionId: number,
) => {
  // TODO: implement corpus import
};
