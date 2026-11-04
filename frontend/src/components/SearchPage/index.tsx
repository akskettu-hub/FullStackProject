import { useState, type ReactElement } from "react";
import { Alert, Box, Typography } from "@mui/material";
import { useSearchOptions } from "../../hooks/useSearchOptions";
import type { PaginationModel, SearchFilters } from "@mono/types";
import SearchForm from "./SearchForm";
import SearchResults from "./SearchResults";

const SearchCorporaPage = (): ReactElement => {
  const searchOptions = useSearchOptions();
  const [appliedFilters, setAppliedFilters] = useState<SearchFilters | null>(
    null,
  );

  const [paginationModel, setPaginationModel] = useState<PaginationModel>({
    page: 0,
    pageSize: 25,
  });

  const handleSubmit = (filters: SearchFilters): void => {
    setAppliedFilters(filters);
    setPaginationModel((m) => ({ ...m, page: 0 }));
  };

  // TODO: Errors should be dislplayed in a more sensible manner.
  if (searchOptions.status === "error")
    return (
      <Box>
        <Alert severity="error">{searchOptions.error}</Alert>
      </Box>
    );
  if (searchOptions.status === "loading")
    return (
      <Box>
        <p>Loading search options...</p>
      </Box>
    );

  return (
    <div>
      <Typography variant="h3" sx={{ paddingBottom: 1 }}>
        Search Corpora
      </Typography>

      <SearchForm options={searchOptions.options} onSubmit={handleSubmit} />
      <SearchResults
        appliedFilters={appliedFilters}
        paginationModel={paginationModel}
        onPaginationModelChange={setPaginationModel}
      />
    </div>
  );
};

export default SearchCorporaPage;
