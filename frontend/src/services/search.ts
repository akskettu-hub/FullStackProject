import {
  HistogramResponseSchema,
  LetterSearchResultSchema,
  SearchOptionsSchema,
  type HistogramResponse,
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

export const fetchSearchResultsHistogram = async (
  params: URLSearchParams,
): Promise<HistogramResponse> => {
  const { data } = await axios.get<unknown>(
    `http://localhost:3003/api/search/histogram?${params}`,
  );

  return HistogramResponseSchema.parse(data);
};

export type Bin = { start: number; end: number; count: number };

type HistogramDataset = {
  bin: string;
  count: number;
}[];

export const binLabel = (bin: Bin): string =>
  bin.start === bin.end ? String(bin.start) : `${bin.start}-${bin.end}`;

export const getBins = (
  rows: { year: number; count: number }[],
  size: number,
): HistogramDataset => {
  if (rows.length === 0) return [];

  const counts = new Map<number, number>();
  for (const { year, count } of rows) {
    const start = Math.floor(year / size) * size;
    counts.set(start, (counts.get(start) ?? 0) + count);
  }

  const starts = [...counts.keys()];
  const first = Math.min(...starts);
  const last = Math.max(...starts);

  const bins: Bin[] = [];

  for (let start = first; start <= last; start += size) {
    bins.push({ start, end: start + size - 1, count: counts.get(start) ?? 0 });
  }
  return bins.map((bin) => ({ bin: binLabel(bin), count: bin.count }));
};
