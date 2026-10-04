// look in CEEC-400 repo and list all the folders
//
import fs from "node:fs";
import path from "node:path";
import { exit } from "node:process";
import { insertCorpus, intsertXmlCollection, pool } from "./importTEI.ts";

const ceec400RepoPath = "./data/CEEC-400/";
const ls = fs.readdirSync(ceec400RepoPath);

const CORPUS_NAMES = ["CEEC", "CEECSU", "CEECE"] as const;
export type CorpusName = (typeof CORPUS_NAMES)[number];

export type CorpusXmlDir = {
  name: CorpusName;
  path: string;
};

const findXmlDirs = (dir: string, ls: string[]): CorpusXmlDir[] | null => {
  const present = new Set(ls);
  const res: { name: CorpusName; path: string }[] = [];

  for (const name of CORPUS_NAMES) {
    const folder = `${name}-xml`;
    if (!present.has(folder)) return null;
    res.push({ name, path: path.join(dir, folder) });
  }
  return res;
};

const xmlDirs = findXmlDirs(ceec400RepoPath, ls);
if (xmlDirs) {
  console.log("All xml dirs of CEEC-400 present. Proceeding...");
} else {
  console.error("At least one xml-dir missing. Exiting...");
  console.error(`path: ${ceec400RepoPath}, path contents: ${ls}`);
  process.exit(1);
}

export type xmlCollectionInfo = {
  corpus: CorpusName;
  corpus_id: number;
  path: string;
};

for (const dir of xmlDirs) {
  const { id, inserted } = await insertCorpus(dir.name);
  if (!inserted) {
    console.warn(`import for ${dir.name} failed... Skipping.`);
  }
  console.log(`id: ${id}, inserted: ${inserted}`);
  if (dir.name == "CEEC") {
    console.log(dir.path);
    const xmlFiles = fs.readdirSync(dir.path);
    for (const file of xmlFiles) {
      console.log(file, id);
      await intsertXmlCollection({
        corpus: dir.name,
        corpus_id: id,
        path: path.join(dir.path, file),
      });
    }
  }
}

await pool.end();
