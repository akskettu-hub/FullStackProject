// Mostly LLM generated: Claude Sonnet 5.5 medium
import { XMLParser, XMLValidator } from "fast-xml-parser";
import fs from "node:fs";
import { titleStmtsToArray } from "./importCollectionTitleStmt.ts";
import { checkTeiEntries } from "./validateTEI.ts";
import { NewCollectionSchema } from "../../types/src/index.ts";
import { Pool } from "pg";

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
  titleStmts: unknown[];
  teiEntries: unknown[];
};
export type ValidationResult =
  | { valid: true; collectionPath: string; data: ValidatedCollection }
  | { valid: false; collectionPath: string; errors: ValidationIssue[] };

const validationFail = (
  code: ValidationIssue["code"],
  collectionPath: string,
  message: string,
): ValidationResult => {
  return { valid: false, collectionPath, errors: [{ code, message }] };
};

export const validateCollection = (
  collectionPath: string,
): ValidationResult => {
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

  const doc = parser.parse(xml);
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

  const teiEntries = Array.isArray(collection.TEI)
    ? collection.TEI
    : [collection.Tei];

  if (teiEntries.length === 0) {
    errors.push({
      code: "MISSING_TEI_ENTRIES",
      message: "No <TEI> elements found in collection",
    });
  }

  if (errors.length > 0) return { valid: false, collectionPath, errors };
  return {
    valid: true,
    collectionPath,
    data: { xmlId, titleStmts, teiEntries },
  };
};

export const importCollections = async (
  pool: Pool,
  corpusId: number,
  collections: string[],
) => {
  const results = collections.map(validateCollection);

  for (const r of results) {
    if (!r.valid) {
      console.error(`Skipping collection at ${r.collectionPath}: ${r.errors}:`);
      continue;
    }

    // NOTE: We don't really want to go into this if we can't validate Tei Entries.
    // TODO: collection and title statements need to be validated before they can be imported. These should block importing.
    const d = r.data;
    const collectionResult = await pool.query(
      `INSERT INTO collections (xml_id, in_corpus) 
      VALUES ($1, $2) 
      ON CONFLICT (xml_id) DO UPDATE SET xml_id = EXCLUDED.xml_id RETURNING id`,
      [d.xmlId, corpusId],
    ); // TODO: use Schema for new collection

    const collectionId = collectionResult.rows[0].id;
    const titleStmts = d.titleStmts;

    for (let i = 0; i < titleStmts.length; i++) {
      await pool.query(
        `INSERT INTO collection_title_statements (collection_id, seq, text) VALUES ($1, $2, $3)`,
        [collectionId, i, titleStmts[i]],
      ); //  TODO: use Schema for new collection title statements
    }
  }
};
