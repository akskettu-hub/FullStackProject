import type { PaginationModel, SearchFilters } from "@mono/types";
import { Box } from "@mui/material";
import type { ReactElement } from "react";
import SearchResultLetterList from "./SearchCorporaResultCard";
type SearchResultsProps = {
  appliedFilters: SearchFilters | null;
  paginationModel: PaginationModel;
  onPaginationModelChange: (model: PaginationModel) => void;
};

const SearchResults = (props: SearchResultsProps): ReactElement => {
  const { appliedFilters, paginationModel, onPaginationModelChange } = props;
  return (
    <Box>
      {appliedFilters && (
        <SearchResultLetterList
          appliedFilters={appliedFilters}
          paginationModel={paginationModel}
          onPaginationModelChange={onPaginationModelChange}
        />
      )}
    </Box>
  );
};

export default SearchResults;
