// Mostly LLM generated: Claude Sonnet 5.5 medium
import { XMLParser, XMLValidator } from "fast-xml-parser";
import fs from "node:fs";
import { TeiValidation, validateTEI } from "./validateTEI.ts";
import { errorsToStr } from "../util/validationErrorsToStr.ts";

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
    | "MISSING_XML_ID"
    | "MISSING_COLLECTION"
    | "MISSING_TITLE_STMT"
    | "MISSING_TEI_ENTRIES";
  message: string;
};

export type ValidatedCollection = {
  xmlId: string | null;
  titleStmts: string[];
  teiEntries: TeiValidation[];
};

export type CollectionValidationResult =
  | { valid: true; collectionPath: string; data: ValidatedCollection }
  | { valid: false; collectionPath: string; errors: ValidationIssue[] };

const validationFail = (
  code: ValidationIssue["code"],
  collectionPath: string,
  message: string,
): CollectionValidationResult => {
  return { valid: false, collectionPath, errors: [{ code, message }] };
};

export const titleStmtsToArray = (stmt: string | string[] | undefined) => {
  if (stmt === undefined) return [];
  return Array.isArray(stmt) ? stmt : [stmt];
};

export const validateCollection = (
  collectionPath: string,
): CollectionValidationResult => {
  let xml: string;
  try {
    xml = fs.readFileSync(collectionPath, "utf-8");
  } catch (err) {
    const code = (err as NodeJS.ErrnoException).code;
    switch (code) {
      case "ENOENT":
        return validationFail(
          "FILE_NOT_FOUND",
          collectionPath,
          `File not found: ${collectionPath}`,
        );
      case "EISDIR":
        return validationFail(
          "NOT_A_FILE",
          collectionPath,
          `Path to directory, not file: ${collectionPath}`,
        );
      default:
        return validationFail(
          "FILE_UNREADABLE",
          collectionPath,
          `Could not read file: ${collectionPath}: ${code ?? err}`,
        );
    }
  }

  const xmlCheck = XMLValidator.validate(xml); // TODO: xmlvalidator is depracated, but docs for fast-xml-validator are nowhere to be found. Figure out its usage later
  if (xmlCheck !== true) {
    return validationFail(
      "XML_INVALID",
      collectionPath,
      `${xmlCheck.err.msg} (line ${xmlCheck.err.line})`,
    );
  }

  const doc: unknown = parser.parse(xml);
  const collection = doc.teiCollection;

  if (!collection || typeof collection !== "object") {
    return validationFail(
      "MISSING_COLLECTION",
      collectionPath,
      "Root element <teiCollection> not found",
    );
  }

  const fileDescTitleStmt = collection.teiHeader?.fileDesc?.titleStmt;
  const titleStmts = titleStmtsToArray(fileDescTitleStmt);

  const errors: ValidationIssue[] = [];

  const xmlId =
    typeof collection["@_xml:id"] === "string" ? collection["@_xml:id"] : null;
  if (!xmlId) {
    errors.push({
      code: "MISSING_XML_ID",
      message: "xml:id is null",
    });
  }

  if (titleStmts.length === 0) {
    errors.push({
      code: "MISSING_TITLE_STMT",
      message: "teiHeader/fileDesc/titleStmt is missing",
    });
  }

  const teiEntriesRaw = Array.isArray(collection.TEI)
    ? collection.TEI
    : [collection.TEI];

  if (teiEntriesRaw.length === 0) {
    return validationFail(
      "MISSING_TEI_ENTRIES",
      collectionPath,
      "No <TEI> elements found in collection",
    );
  }

  const teiEntries: TeiValidation[] = [];
  teiEntriesRaw.forEach((rawTei: unknown) => {
    teiEntries.push(validateTEI(rawTei));
  });

  if (errors.length > 0) return { valid: false, collectionPath, errors };
  return {
    valid: true,
    collectionPath,
    data: { xmlId, titleStmts, teiEntries },
  };
};
