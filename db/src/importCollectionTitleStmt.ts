//import { XMLParser } from "fast-xml-parser";
//import fs from "node:fs";

/*
const xml = fs.readFileSync(process.argv[2], "utf-8");
const parser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: "@_",
  textNodeName: "#text",
});
const doc = parser.parse(xml);

const collection = doc.teiCollection;
const fileDescTitleStmt = collection.teiHeader?.fileDesc?.titleStmt;

console.log(collection["@_xml:id"]);
for (const stmt of titleStmtsToArray(fileDescTitleStmt)) {
  console.log(stmt);
  console.log("==");
}
console.log(typeof fileDescTitleStmt);
 */

export const titleStmtsToArray = (stmt: string | string[] | undefined) => {
  if (stmt === undefined) return [];
  return Array.isArray(stmt) ? stmt : [stmt];
};
