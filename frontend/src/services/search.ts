import {
  LetterSearchResultSchema,
  SearchOptionsSchema,
  type LetterSearchResult,
  type SearchFilters,
  type SearchOptions,
  type SearchQueryParams,
} from "@mono/types";
import axios from "axios";

export const fetchSearchOptions = async (): Promise<SearchOptions> => {
  const { data } = await axios.get<unknown>(
    "http://localhost:3003/api/search/searchOptions",
  );

  return SearchOptionsSchema.parse(data);
};

export const fetchSearchLetters = async (
  params: URLSearchParams,
): Promise<LetterSearchResult> => {
  console.log("Params: ", params);
  const { data } = await axios.get<unknown>(
    `http://localhost:3003/api/search?${params}`,
  );

  return LetterSearchResultSchema.parse(data);
};

export const searchFilterToParams = (
  filter: SearchFilters,
): SearchQueryParams => ({
  corpusIds: filter.corpusIds.join(","),
  yearFrom: String(filter.yearFrom),
  yearTo: String(filter.yearTo),
});
