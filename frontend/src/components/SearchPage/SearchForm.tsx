import type { SearchOptions } from "@mono/types";
import { Box, Typography } from "@mui/material";
import { useEffect, useState, type ReactElement } from "react";
import { fetchSearchOptions } from "../../services/search";

const SearchForm = (): ReactElement => {
  const [searchOptions, setSearchOptions] = useState<SearchOptions | null>(
    null,
  );
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchSearchOptions()
      .then((data) => {
        setSearchOptions(data);
      })
      .catch((e: unknown) => {
        setError(
          e instanceof Error ? e.message : "failed to fetch search options :P",
        );
      });
  }, []);

  if (error)
    return (
      <Box>
        <p>Error: {error}</p>
      </Box>
    );

  if (!searchOptions)
    return (
      <Box>
        <p>Loading Search Results...</p>
      </Box>
    );

  return (
    <Box>
      <Typography variant="h4">Search Form</Typography>
      <p>serch form goes here</p>
      <p>{searchOptions[0].name}</p>
    </Box>
  );
};

export default SearchForm;
