import { useState, type ReactElement } from "react";
import { Box, Typography } from "@mui/material";
import SearchForm from "./SearchForm";
import SearchCorporaResultCard from "./SearchCorporaResultCard";
import { useSearchOptions } from "../../hooks/useSearchOptions";
import type { SearchFilters } from "@mono/types";

const SearchCorporaPage = (): ReactElement => {
  const searchOptions = useSearchOptions();
  const [appliedFilters, setAppliedFilters] = useState<SearchFilters | null>(
    null,
  );

  if (searchOptions.status === "error")
    return (
      <Box>
        <p>Error: {searchOptions.error}</p>
      </Box>
    );
  if (searchOptions.status === "loading")
    return (
      <Box>
        <p>Loading search options...</p>
      </Box>
    );

  //filters={appliedFilters}
  return (
    <div>
      <Typography variant="h3" sx={{ paddingBottom: 1 }}>
        Search Corpora
      </Typography>

      <SearchForm
        options={searchOptions.options}
        onSubmit={setAppliedFilters}
      />
      {appliedFilters && <SearchCorporaResultCard />}
    </div>
  );
};

export default SearchCorporaPage;
