import { AuthorSummariesSchema, type AuthorSummaries } from "@mono/types";
import axios from "axios";

const PATHS = {
  Collection: "collections",
  Corpus: "corpora",
  CorpusCollection: "corpusCollections",
} as const;

export const fetchAuthors = async (
  type: keyof typeof PATHS,
  id: number,
): Promise<AuthorSummaries> => {
  const { data } = await axios.get<unknown>(
    `http://localhost:3003/api/${PATHS[type]}/${id}/authors`,
  );

  return AuthorSummariesSchema.parse(data);
};
