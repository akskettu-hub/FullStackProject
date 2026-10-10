// Mostly LLM generated: Claude Sonnet 5.5 medium
import { z } from "zod";
import { parseTitleKey } from "./titleKeyParser.ts";
import { Pool } from "pg";
const keyed = z.object({ "@_key": z.string().min(1) }).loose();

const teiSchema = z
  .object({
    "@_xml:id": z.string().min(1),
    teiHeader: z
      .object({
        fileDesc: z
          .object({
            titleStmt: z
              .object({
                title: keyed,
                author: keyed.optional(),
              })
              .loose(),
          })
          .loose(),
      })
      .loose(),
    text: z
      .object({
        "@_type": z.string().optional(),
        "@_xml:lang": z.string().optional(),
      })
      .loose(),
  })
  .loose();

export type TeiIssue = {
  severity: "error" | "warning";
  path: string;
  message: string;
};

export type DocumentRecord = {
  xmlId: string;
  titleKey: string;
  authorKey: string | null;
  textType: string | null;
  lang: string | null;
  rawXml: string;
  authenticity: ReturnType<typeof parseTitleKey>["authenticity"];
  year: ReturnType<typeof parseTitleKey>["year"];
  yearRaw: ReturnType<typeof parseTitleKey>["yearRaw"];
  yearIsDecadeSuggestion: ReturnType<
    typeof parseTitleKey
  >["yearIsDecadeSuggestion"];
  yearIsUncertain: ReturnType<typeof parseTitleKey>["yearIsUncertain"];
  relationshipCode: ReturnType<typeof parseTitleKey>["relationshipCode"];
  correspondentCode: ReturnType<typeof parseTitleKey>["correspondentCode"];
  titleKeyParseOk: boolean;
};

export type TeiValidation =
  | { ok: true; xmlId: string; issues: TeiIssue[]; record: DocumentRecord } // issues = warnings only
  | { ok: false; xmlId: string | null; issues: TeiIssue[]; record: null };

export const validateTEI = (tei: unknown): TeiValidation => {
  const xmlIdTest =
    typeof (tei as any)?.["@_xml:id"] === "string"
      ? (tei as any)?.["@_xml:id"]
      : null;

  // check tei element structure
  const result = teiSchema.safeParse(tei);
  if (!result.success) {
    return {
      ok: false,
      xmlId: xmlIdTest,
      record: null,
      issues: result.error.issues.map((i) => ({
        severity: "error" as const,
        path: i.path.join("."),
        message: i.message,
      })),
    };
  }

  const data = result.data;
  const titleStmt = data.teiHeader.fileDesc.titleStmt;
  const issues: TeiIssue[] = [];

  // Check if title key (Q-line) is parseable
  const titleKey = titleStmt.title["@_key"];
  const parsed = parseTitleKey(titleKey);
  if (!parsed.parseOk) {
    issues.push({
      severity: "warning",
      path: "teiHeader.fileDesc.titleStmt.title.@_key",
      message: `Could not parse Q-line: ${titleKey}`,
    });
  }

  // Optional checks
  if (!data.text["@_type"]) {
    issues.push({
      severity: "warning",
      path: "text.@_type",
      message: "Missing text type",
    });
  }
  if (!data.text["@_xml:lang"]) {
    issues.push({
      severity: "warning",
      path: "text.@_xml:lang",
      message: "Missing language",
    });
  }

  // TODO: rawxml placeholder — text includes !ENTITY tags for special charachters
  return {
    ok: true,
    xmlId: data["@_xml:id"],
    issues,
    record: {
      xmlId: data["@_xml:id"],
      titleKey,
      authorKey: titleStmt.author?.["@_key"] ?? null,
      textType: data.text["@_type"] ?? null,
      lang: data.text["@_xml:lang"] ?? null,
      rawXml: `<TEI>${JSON.stringify(tei)}</TEI>`,
      authenticity: parsed.authenticity,
      year: parsed.year,
      yearRaw: parsed.yearRaw,
      yearIsDecadeSuggestion: parsed.yearIsDecadeSuggestion,
      yearIsUncertain: parsed.yearIsUncertain,
      relationshipCode: parsed.relationshipCode,
      correspondentCode: parsed.correspondentCode,
      titleKeyParseOk: parsed.parseOk,
    },
  };
};

export const checkTeiEntries = (teiEntries: unknown[]) => {
  const results = teiEntries.map(validateTEI);
  return {
    total: results.length,
    importable: results.filter((r) => r.ok).length,
    failed: results.filter((r) => !r.ok),
    withWarnings: results.filter((r) => r.ok && r.issues.length > 0),
  };
};

// TODO: test this
// TODO: add schema for TEI entries.
export const importTeiEntries = async (
  pool: Pool,
  collectionId: number,
  teiEntries: unknown[],
) => {
  const results = teiEntries.map(validateTEI);

  for (const r of results) {
    if (!r.ok) {
      console.error(`Skipping ${r.xmlId ?? "<missing_id>"}:`, r.issues);
      continue;
    }

    for (const w of r.issues)
      console.warn(`${r.xmlId} ${w.path}: ${w.message}`);

    const d = r.record;
    await pool.query(
      `INSERT INTO documents (collection_id, xml_id, title_key, author_key, text_type, lang, raw_xml,
         authenticity, year, year_raw, year_is_decade_suggestion, year_is_uncertain,
         relationship_code, correspondent_code, title_key_parse_ok)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15)`,
      [
        collectionId,
        d.xmlId,
        d.titleKey,
        d.authorKey,
        d.textType,
        d.lang,
        d.rawXml,
        d.authenticity,
        d.year,
        d.yearRaw,
        d.yearIsDecadeSuggestion,
        d.yearIsUncertain,
        d.relationshipCode,
        d.correspondentCode,
        d.titleKeyParseOk,
      ],
    );
  }

  return results;
};
