// Partially LLM generated: Claude Sonnet 5.5 Medium
import type { SearchFilters, SearchOptions } from "@mono/types";
import { Box, Typography } from "@mui/material";
import { useMemo, useState, type ReactElement } from "react";
import CorpusPicker from "./CorpusPicker";
import YearPicker from "./YearPicker";

const getYearBounds = (
  options: SearchOptions,
  selectedCorpora: Set<number>,
): { min: number; max: number } | null => {
  const years = options
    .flatMap((cc) => cc.corpora)
    .filter((corpus) => selectedCorpora.has(corpus.id))
    .flatMap((c) => [c.minYear, c.maxYear])
    .filter((y) => y !== null);

  if (years.length === 0) return null;

  const min = Math.min(...years);
  const max = Math.max(...years);

  return { min, max };
};

type SearchFormProps = {
  options: SearchOptions;
  onSubmit: (filters: SearchFilters) => void;
};

const SearchForm = (props: SearchFormProps): ReactElement => {
  const { options } = props;

  const [selectedCorpora, setSelectedCorpora] = useState<Set<number>>(
    new Set(),
  );
  const [selectedYearSpan, setSelectedYearSpan] = useState<[number, number]>([
    1400, 1800,
  ]);

  const bounds = useMemo(
    () => getYearBounds(options, selectedCorpora),
    [options, selectedCorpora],
  );

  const handleCorporaChange = (next: Set<number>): void => {
    setSelectedCorpora(next);

    const nextBounds = getYearBounds(options, next);
    if (nextBounds === null) return;

    setSelectedYearSpan(([from, to]) => {
      const outside = to < nextBounds.min || from > nextBounds.max;
      if (outside) return [nextBounds.min, nextBounds.max]; // if range outside next bounds, previous selections means nothing and is set to max

      return [
        Math.min(Math.max(from, nextBounds.min), nextBounds.max),
        Math.min(Math.max(to, nextBounds.min), nextBounds.max),
      ];
    });
  };

  return (
    <Box>
      <Typography variant="h4">Search Form</Typography>
      <p>serch form goes here</p>
      <CorpusPicker
        options={options}
        selected={selectedCorpora}
        onChange={handleCorporaChange}
      />
      <pre>{JSON.stringify([...selectedCorpora])}</pre>

      <YearPicker
        bounds={bounds}
        value={selectedYearSpan}
        onChange={setSelectedYearSpan}
      />
      <pre>
        {selectedYearSpan[0]} - {selectedYearSpan[1]}
      </pre>
    </Box>
  );
};

export default SearchForm;
