import type { SearchOptions, SearchYearSpan } from "@mono/types";
import { Box } from "@mui/material";
import type { ReactElement } from "react";

type YearPickerProps = {
  selectedCorpora: Set<number>;
  options: SearchOptions;
  onChange: (next: SearchYearSpan) => void;
};

const YearPicker = (props: YearPickerProps): ReactElement => {
  const { selectedCorpora, options, onChange } = props;

  if (!selectedCorpora || selectedCorpora.size === 0)
    return (
      <Box>
        <p>Please select a corpus....</p>
      </Box>
    );

  const years = options
    .flatMap((cc) => cc.corpora)
    .filter((corpus) => selectedCorpora.has(corpus.id))
    .flatMap((c) => [c.minYear, c.maxYear])
    .filter((y) => y !== null);

  const min = Math.min(...years);

  const max = Math.max(...years);

  console.log(min, max);

  return (
    <Box>
      <p>Year picker here.</p>
      <p>
        {min}-{max}
      </p>
    </Box>
  );
};

export default YearPicker;
