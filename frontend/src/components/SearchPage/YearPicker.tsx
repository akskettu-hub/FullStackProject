import type { SearchOptions } from "@mono/types";
import { Box, Slider } from "@mui/material";
import type { ReactElement } from "react";

type YearPickerProps = {
  selectedYears: number[];
  selectedCorpora: Set<number>;
  options: SearchOptions;
  onChange: (newValue: number[]) => void;
};

const minMaxYears = (
  options: SearchOptions,
  selectedCorpora: Set<number>,
): { min: number; max: number } => {
  const years = options
    .flatMap((cc) => cc.corpora)
    .filter((corpus) => selectedCorpora.has(corpus.id))
    .flatMap((c) => [c.minYear, c.maxYear])
    .filter((y) => y !== null);

  const min = Math.min(...years);
  const max = Math.max(...years);

  return { min, max };
};

const YearPicker = (props: YearPickerProps): ReactElement => {
  const { selectedYears, selectedCorpora, options, onChange } = props;
  const handleChange = (event: Event, newValue: number[]): void => {
    onChange(newValue);
  };

  if (!selectedCorpora || selectedCorpora.size === 0) {
    return (
      <Box>
        <Slider disabled />
      </Box>
    );
  }

  const { min, max } = minMaxYears(options, selectedCorpora);

  return (
    <Box>
      <p>
        Min: {min}-{max}
      </p>
      <Slider
        value={selectedYears}
        onChange={handleChange}
        valueLabelDisplay="on"
        min={min}
        max={max}
      />
    </Box>
  );
};

export default YearPicker;
