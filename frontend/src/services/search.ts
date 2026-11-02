import { SearchOptionsSchema, type SearchOptions } from "@mono/types";
import axios from "axios";

export const fetchSearchOptions = async (): Promise<SearchOptions> => {
  const { data } = await axios.get<unknown>(
    "http://localhost:3003/api/search/searchOptions",
  );

  return SearchOptionsSchema.parse(data);
};
