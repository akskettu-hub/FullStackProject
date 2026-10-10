// Mostly LLM generated: Claude Sonnet 5.5 Medium
import { read } from "node:fs";
import { readdir } from "node:fs/promises";
import path from "node:path";

export type DirIssue = {
  code:
    | "DIR_NOT_FOUND"
    | "NOT_A_DIRECTORY"
    | "DIR_UNREADABLE"
    | "EMPTY_DIR"
    | "NO_DIRS_IN_COL_DIR";
  message: string;
};

export type DirValidation =
  | {
      valid: true;
      path: string;
      files: string[];
      subdirs: string[];
    }
  | { valid: false; errors: DirIssue[] };

const fail = (code: DirIssue["code"], message: string): DirValidation => {
  return { valid: false, errors: [{ code, message }] };
};

export const validateDirectory = async (
  dirPath: string,
  kind: "corpus" | "corpus collection",
): Promise<DirValidation> => {
  const res = path.resolve(dirPath);

  try {
    const entries = await readdir(res, { withFileTypes: true });
    const subdirs = entries
      .filter((e) => e.isDirectory())
      .map((e) => path.join(res, e.name));

    const files = entries
      .filter((e) => e.isFile())
      .map((e) => path.join(res, e.name));

    if (kind === "corpus collection" && subdirs.length === 0) {
      return fail(
        "NO_DIRS_IN_COL_DIR",
        `${kind} at ${res} contains no sub-directories`,
      );
    }

    if (entries.length === 0) {
      return fail("EMPTY_DIR", `${kind} is an empty directory`);
    }

    return { valid: true, path: res, files, subdirs };
  } catch (err) {
    const code = (err as NodeJS.ErrnoException).code;

    switch (code) {
      case "ENOENT":
        return fail("DIR_NOT_FOUND", `${kind} directory not found: ${res}`);
      case "ENOTDIR":
        return fail(
          "NOT_A_DIRECTORY",
          `${kind} path is not a directory: ${res}`,
        );
      default:
        return fail(
          "DIR_UNREADABLE",
          `Could not read ${kind} directory ${read}: ${code ?? err}`,
        );
    }
  }
};
