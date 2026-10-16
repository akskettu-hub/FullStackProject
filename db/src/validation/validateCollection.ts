// Mostly LLM generated: Claude Sonnet 5.5 medium
import { XMLParser, XMLValidator } from "fast-xml-parser";
import fs from "node:fs";
import { z } from "zod";

import {
  checkTeiEntries,
  CheckTeiEntriesResult,
  TeiValidation,
  validateTEI,
} from "./validateTEI.ts";
import { toArray } from "../util/toArray.ts";

const TeiCollectionSchema = z.object({
  teiCollection: z
    .object({
      "@_xml:id": z.string().min(1),
      teiHeader: z
        .object({
          fileDesc: z
            .object({
              titleStmt: z // One or more of these
                .preprocess(
                  toArray,
                  z
                    .array(z.string().min(1))
                    .min(1, "Collection should have one or more titleStmts"),
                ),
            })
            .loose(),
        })
        .loose(),
      TEI: z.preprocess(toArray, z.array(z.unknown())),
    })
    .loose(),
});

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
    | "INVALID_TEI_COLLECTION"
    | "INVALID_TEI"
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
  teiChecks: CheckTeiEntriesResult;
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

  const parsedTeiCollection = TeiCollectionSchema.safeParse(parser.parse(xml));
  //doc.teiCollection

  if (!parsedTeiCollection.success) {
    return validationFail(
      "INVALID_TEI_COLLECTION",
      collectionPath,
      parsedTeiCollection.error.message,
    );
  }
  const { teiCollection } = parsedTeiCollection.data;

  //const fileDescTitleStmt = collection.teiHeader?.fileDesc?.titleStmt;
  const titleStmts = teiCollection.teiHeader.fileDesc.titleStmt;

  const errors: ValidationIssue[] = [];

  const xmlId =
    typeof teiCollection["@_xml:id"] === "string"
      ? teiCollection["@_xml:id"]
      : null;
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

  const teiEntries: TeiValidation[] = teiCollection.TEI.map(validateTEI);

  if (teiEntries.length === 0) {
    errors.push({
      code: "MISSING_TEI_ENTRIES",
      message: "No <TEI> elements found in collection",
    });
  }

  /*
  const teiEntries: TeiValidation[] = [];
  teiEntriesRaw.forEach((rawTei: unknown) => {
    teiEntries.push(validateTEI(rawTei));
  });
   */
  const teiChecks: CheckTeiEntriesResult = checkTeiEntries(teiEntries);

  if (teiChecks.failed.length > 0) {
    teiChecks.failed.forEach((f) => {
      errors.push({
        code: "INVALID_TEI",
        message: `${f.xmlId ? f.xmlId : "<Missing xml:id>"} failed validation with ${f.issues.length}`,
      });
    });
  }

  if (errors.length > 0) return { valid: false, collectionPath, errors };
  return {
    valid: true,
    collectionPath,
    data: { xmlId, titleStmts, teiEntries, teiChecks },
  };
};
