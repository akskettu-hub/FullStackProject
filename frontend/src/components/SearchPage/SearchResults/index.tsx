import type { PaginationModel, SearchFilters } from "@mono/types";
import { Box, Typography } from "@mui/material";
import type { ReactElement } from "react";
import SearchResultLetterList from "./SearchResultLetterList";
import SearchResultHistogram from "./SearchResultHistogram";

type SearchResultsProps = {
  appliedFilters: SearchFilters;
  paginationModel: PaginationModel;
  onPaginationModelChange: (model: PaginationModel) => void;
};

const SearchResults = (props: SearchResultsProps): ReactElement => {
  const { appliedFilters, paginationModel, onPaginationModelChange } = props;
  return (
    <Box>
      <Typography variant="h4">Results</Typography>
      <SearchResultHistogram appliedFilters={appliedFilters} />
      <SearchResultLetterList
        appliedFilters={appliedFilters}
        paginationModel={paginationModel}
        onPaginationModelChange={onPaginationModelChange}
      />
    </Box>
  );
};

export default SearchResults;
