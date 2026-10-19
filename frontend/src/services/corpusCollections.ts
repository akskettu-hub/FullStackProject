import {
  CorpusCollectionsWithCorporaSchema,
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
