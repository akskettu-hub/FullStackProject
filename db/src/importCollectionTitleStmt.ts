import { XMLParser } from "fast-xml-parser";
import fs from "node:fs";
import { Client } from "pg";

const client = new Client({
  connectionString: "postgres://corpus:corpus@localhost:5432/corpus_dev",
});

const xml = fs.readFileSync(process.argv[2], "utf-8");
const parser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: "@_",
  textNodeName: "#text",
});
const doc = parser.parse(xml);

const collection = doc.teiCollection;
const fileDescTitleStmt = collection.teiHeader?.fileDesc?.titleStmt;

export const titleStmtsToArray = (stmt: string | string[] | undefined) => {
  if (stmt === undefined) return [];
  return Array.isArray(stmt) ? stmt : [stmt];
};
//const fileDescTitleStmts = titleStmtsToArray(fileDescTitleStmt)

/*
for (let i = 0; i < titleStmts.length; i++) {
  await client.query(
    `INSERT INTO collection_title_statements (collection_id, title_stmt) VALUES ($1, $2) ON CONFLICT (xml_id) DO UPDATE SET xml_id = EXCLUDED.xml_id RETURNING id`,
    [collection["@_xml:id"], collection["@_titleStmt"]],
  );
}
 */

console.log(collection["@_xml:id"]);
for (const stmt of titleStmtsToArray(fileDescTitleStmt)) {
  console.log(stmt);
  console.log("==");
}
console.log(typeof fileDescTitleStmt);
