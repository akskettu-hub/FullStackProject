import { CorpusSummarySchema, type CorpusSummary } from "@mono/types";
import axios from "axios";

export const fetchCorpusSummary = async (
  corpusId: number,
): Promise<CorpusSummary> => {
  const { data } = await axios.get<unknown>(
    `http://localhost:3003/api/corpora/${corpusId}/summary`,
  );

  return CorpusSummarySchema.parse(data);
};
