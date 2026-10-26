import {
  CollectionSummariesSchema,
  type CollectionSummaries,
} from "@mono/types";
import axios from "axios";

export const fetchCollectionSummaries = async (
  corpusId: number,
): Promise<CollectionSummaries> => {
  const { data } = await axios.get<unknown>(
    `http://localhost:3003/api/collections/${corpusId}/summaries`,
  );
  return CollectionSummariesSchema.parse(data);
};
