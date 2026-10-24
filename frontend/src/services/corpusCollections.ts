import {
  CorpusCollectionSummarySchema,
  CorpusCollectionsWithCorporaSchema,
  type CorpusCollectionSummary,
  type CorpusCollectionsWithCorpora,
} from "@mono/types";
import axios from "axios";

export const fetchCorpusCollection =
  async (): Promise<CorpusCollectionsWithCorpora> => {
    const { data } = await axios.get<unknown>(
      "http://localhost:3003/api/corpusCollections",
    );
    return CorpusCollectionsWithCorporaSchema.parse(data);
  };

export const fetchCorpusCollectionSummary = async (
  id: number,
): Promise<CorpusCollectionSummary> => {
  const { data } = await axios.get<unknown>(
    `http://localhost:3003/api/corpusCollections/${id}/summary`,
  );

  return CorpusCollectionSummarySchema.parse(data);
};
