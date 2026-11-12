// Partially LLM generated: Claude Sonnet 5.5 Medium
import {
  AUTHENTICITY_CODES,
  RELATIONSHIP_CODES,
  type AuthenticityCodeOptions,
  type AuthenticityCombinationsAllowed,
  type RelationshipCodeOptions,
  type SearchFilters,
  type SearchOptions,
} from "@mono/types";
import { Alert, Box, Button } from "@mui/material";
import { useMemo, useState, type ReactElement } from "react";
import CorpusPicker from "./CorpusPicker";
import YearPicker from "./YearPicker";
import AuthenticityPicker from "./AuthenticityPicker";
import RelationshipCodePicker from "./RelationshipCodePicker";

const getYearBounds = (
  options: SearchOptions,
  selectedCorpora: Set<number>,
): { min: number; max: number } | null => {
  const years = options.corpusCollections
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
  const { options, onSubmit } = props;

  const [selectedCorpora, setSelectedCorpora] = useState<Set<number>>(
    () =>
      new Set(
        options.corpusCollections.flatMap((cc) => cc.corpora.map((c) => c.id)),
      ),
  );
  const [selectedAuthenticityCodes, setSelectedAuthenticityCodes] =
    useState<AuthenticityCodeOptions>(() => new Set(AUTHENTICITY_CODES));

  const [selectedRelationshipCodes, setSelectedRelationshipCodes] =
    useState<RelationshipCodeOptions>(() => new Set(RELATIONSHIP_CODES));

  const [authenticityCombinationsAllowed, setAuthenticityCombinationsAllowed] =
    useState<AuthenticityCombinationsAllowed>(true);

  const bounds = useMemo(
    () => getYearBounds(options, selectedCorpora),
    [options, selectedCorpora],
  );

  const [selectedYearSpan, setSelectedYearSpan] = useState<[number, number]>(
    bounds?.min !== undefined && bounds?.max !== undefined
      ? [bounds?.min, bounds?.max]
      : [1400, 1800],
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

  const handleSubmit = (event: React.SubmitEvent<HTMLFormElement>): void => {
    event.preventDefault();
    if (bounds === null) return;
    const filter: SearchFilters = {
      corpusIds: [...selectedCorpora],
      yearFrom: selectedYearSpan[0],
      yearTo: selectedYearSpan[1],
    };
    onSubmit(filter);
  };

  return (
    <Box component={"form"} onSubmit={handleSubmit}>
      <CorpusPicker
        options={options.corpusCollections}
        selected={selectedCorpora}
        onChange={handleCorporaChange}
      />

      <AuthenticityPicker
        selected={selectedAuthenticityCodes}
        onChange={setSelectedAuthenticityCodes}
        combinationsAllowed={authenticityCombinationsAllowed}
        setCombinations={setAuthenticityCombinationsAllowed}
      />

      <RelationshipCodePicker
        selected={selectedRelationshipCodes}
        onChange={setSelectedRelationshipCodes}
      />

      <YearPicker
        bounds={bounds}
        value={selectedYearSpan}
        onChange={setSelectedYearSpan}
      />

      <pre>{selectedRelationshipCodes}</pre>

      {bounds === null && (
        <Alert severity="info">Please select a corpus.</Alert>
      )}

      {selectedAuthenticityCodes.size === 0 && (
        <Alert severity="info">
          Please select at least one Authenticity code.
        </Alert>
      )}

      {selectedRelationshipCodes.size === 0 && (
        <Alert severity="info">
          Please select at least one Relationship code.
        </Alert>
      )}

      <Button type="submit" variant="contained" disabled={bounds === null}>
        Search
      </Button>
    </Box>
  );
};

export default SearchForm;
