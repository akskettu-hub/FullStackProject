import type { SearchFilters } from "@mono/types";
import { Alert, Box } from "@mui/material";
import type { ReactElement } from "react";
import { useSearchResultHistogram } from "../../../hooks/useSearchResultChart";

type SearchResultHistogramProps = {
  appliedFilters: SearchFilters;
};

const SearchResultHistogram = (
  props: SearchResultHistogramProps,
): ReactElement => {
  const { appliedFilters } = props;
  const { data, error } = useSearchResultHistogram(appliedFilters);
  return (
    <Box>
      <p>Results Charts goes here!</p>
      {error && <Alert severity="error">{error}</Alert>}
      {data !== null && <pre>data lenght {data?.rows.length}</pre>}
    </Box>
  );
};

export default SearchResultHistogram;
