import {
  CollectionSummariesSchema,
  CollectionWithTitleStmtsSchema,
  type CollectionSummaries,
  type CollectionWithTitleStmts,
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

export const fetchCollectionTitleStmts = async (
  collectionId: number,
): Promise<CollectionWithTitleStmts> => {
  const { data } = await axios.get<unknown>(
    `http://localhost:3003/api/collections/${collectionId}/titleStmts`,
  );

  return CollectionWithTitleStmtsSchema.parse(data);
};
