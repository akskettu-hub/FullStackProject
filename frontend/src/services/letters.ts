import { LetterSearchResultSchema, type LetterSearchResult } from "@mono/types";
import axios from "axios";

export const fetchLetterSearch = async (
  params: URLSearchParams,
): Promise<LetterSearchResult> => {
  console.log("Params: ", params);
  const { data } = await axios.get<unknown>(
    `http://localhost:3003/api/letters/search?${params}`,
  );

  return LetterSearchResultSchema.parse(data);
};
