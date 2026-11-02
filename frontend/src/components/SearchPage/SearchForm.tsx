import type { SearchFilters, SearchOptions } from "@mono/types";
import { Box, Typography } from "@mui/material";
import { useState, type ReactElement } from "react";
import CorpusPicker from "./CorpusPicker";

type searchFormProps = {
  options: SearchOptions;
  onSubmit: (filters: SearchFilters) => void;
};

const SearchForm = (props: searchFormProps): ReactElement => {
  const [selectedCorpora, setSelectedCorpora] = useState<Set<number>>(
    new Set(),
  );

  return (
    <Box>
      <Typography variant="h4">Search Form</Typography>
      <p>serch form goes here</p>
      <CorpusPicker
        options={props.options}
        selected={selectedCorpora}
        onChange={setSelectedCorpora}
      />
      <pre>{JSON.stringify([...selectedCorpora])}</pre>
    </Box>
  );
};

export default SearchForm;
