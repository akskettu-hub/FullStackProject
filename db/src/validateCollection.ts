import { XMLParser, XMLValidator } from "fast-xml-parser";
import fs from "node:fs";
import { titleStmtsToArray } from "./importCollectionTitleStmt.ts";
import { checkTeiEntries } from "./validateTEI.ts";

const parser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: "@_",
});

export type ValidationIssue = {
  code:
    | "FILE_NOT_FOUND"
    | "NOT_A_FILE"
    | "FILE_UNREADABLE"
    | "XML_INVALID"
    | "MISSING_COLLECTION"
    | "MISSING_TITLE_STMT"
    | "MISSING_TEI_ENTRIES";
  message: string;
};
export type ValidatedCollection = {
  titleStmts: unknown[];
  teiEntries: unknown[];
};
export type ValidationResult =
  | { valid: true; data: ValidatedCollection }
  | { valid: false; errors: ValidationIssue[] };

const validationFail = (
  code: ValidationIssue["code"],
  message: string,
): ValidationResult => {
  return { valid: false, errors: [{ code, message }] };
};

export const validateCollection = async (
  collectionCollectionXmlPath: string,
) => {
  let xml: string;
  try {
    xml = fs.readFileSync(collectionCollectionXmlPath, "utf-8");
  } catch (err) {
    const code = (err as NodeJS.ErrnoException).code;
    switch (code) {
      case "ENOENT":
        return validationFail(
          "FILE_NOT_FOUND",
          `File not found: ${collectionCollectionXmlPath}`,
        );
      case "EISDIR":
        return validationFail(
          "NOT_A_FILE",
          `Path to directory, not file: ${collectionCollectionXmlPath}`,
        );
      default:
        return validationFail(
          "FILE_UNREADABLE",
          `Could not read file: ${collectionCollectionXmlPath}: ${code ?? err}`,
        );
    }
  }

  const xmlCheck = XMLValidator.validate(xml); // TODO: xmlvalidator is depracated, but docs for fast-xml-validator are nowhere to be found. Figure out its usage later
  if (xmlCheck !== true) {
    return validationFail(
      "XML_INVALID",
      `${xmlCheck.err.msg} (line ${xmlCheck.err.line})`,
    );
  }

  const doc = parser.parse(xml);
  const collection = doc.teiCollection;

  if (!collection || typeof collection !== "object") {
    return validationFail(
      "MISSING_COLLECTION",
      "Root element <teiCollection> not found",
    );
  }

  const fileDescTitleStmt = collection.teiHeader?.fileDesc?.titleStmt;
  const titleStmts = titleStmtsToArray(fileDescTitleStmt);

  const errors: ValidationIssue[] = [];

  if (titleStmts.length === 0) {
    errors.push({
      code: "MISSING_TITLE_STMT",
      message: "teiHeader/fileDesc/titleStmt is missing",
    });
  }

  const teiEntries = Array.isArray(collection.TEI)
    ? collection.TEI
    : [collection.Tei];

  if (teiEntries.length === 0) {
    errors.push({
      code: "MISSING_TEI_ENTRIES",
      message: "No <TEI> elements found in collection",
    });
  }

  const teiEntriesCheckResult = checkTeiEntries(teiEntries);
  console.log(teiEntriesCheckResult);

  if (errors.length > 0) return { valid: false, errors };
  return { valid: true, data: { titleStmts, teiEntries } };
};
