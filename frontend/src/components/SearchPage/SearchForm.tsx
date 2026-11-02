import type { SearchFilters, SearchOptions } from "@mono/types";
import { Box, Typography } from "@mui/material";
import { useState, type ReactElement } from "react";
import CorpusPicker from "./CorpusPicker";
import YearPicker from "./YearPicker";

type searchFormProps = {
  options: SearchOptions;
  onSubmit: (filters: SearchFilters) => void;
};

const SearchForm = (props: searchFormProps): ReactElement => {
  const [selectedCorpora, setSelectedCorpora] = useState<Set<number>>(
    new Set(),
  );
  const [selectedYearSpan, setSelectedYearSpan] = useState<number[]>([
    850, 2000,
  ]);

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

      <YearPicker
        selectedYears={selectedYearSpan}
        selectedCorpora={selectedCorpora}
        options={props.options}
        onChange={setSelectedYearSpan}
      />
      <pre>
        {selectedYearSpan[0]} - {selectedYearSpan[1]}
      </pre>
    </Box>
  );
};

export default SearchForm;
