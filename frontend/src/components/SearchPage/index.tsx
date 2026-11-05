import { useState, type ReactElement } from "react";
import {
  Alert,
  Box,
  CircularProgress,
  Divider,
  Stack,
  Typography,
} from "@mui/material";
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

  /*
  if (searchOptions.status === "error")
    return (
      <Box>
        <Alert severity="error">{searchOptions.error}</Alert>
      </Box>
    );

  if (searchOptions.status === "loading")
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
        <CircularProgress aria-label="Loading search options" />
      </Box>
    );
    */

  return (
    <Stack spacing={2}>
      <Typography variant="h3">Search Corpora</Typography>

      {searchOptions.status === "error" && (
        <Box>
          <Alert severity="error">{searchOptions.error}</Alert>
        </Box>
      )}

      {searchOptions.status === "loading" && (
        <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
          <CircularProgress aria-label="Loading search options" />
        </Box>
      )}

      {searchOptions.status === "success" && (
        <SearchForm options={searchOptions.options} onSubmit={handleSubmit} />
      )}

      {appliedFilters && (
        <>
          <Divider />
          <SearchResults
            appliedFilters={appliedFilters}
            paginationModel={paginationModel}
            onPaginationModelChange={setPaginationModel}
          />
        </>
      )}
    </Stack>
  );
};

export default SearchCorporaPage;
