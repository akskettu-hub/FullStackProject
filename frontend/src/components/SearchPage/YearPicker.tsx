// Partially LLM generated: Claude Sonnet 5.5 Medium
import { Box, Slider } from "@mui/material";
import type { ReactElement } from "react";

type YearPickerProps = {
  bounds: { min: number; max: number } | null;
  value: [number, number];
  onChange: (next: [number, number]) => void;
};

const YearPicker = (props: YearPickerProps): ReactElement => {
  const { bounds, value, onChange } = props;
  const handleChange = (_event: Event, next: number | number[]): void => {
    if (Array.isArray(next)) onChange([next[0], next[1]]);
  };

  return (
    <Box>
      <Slider
        disabled={bounds === null}
        value={value}
        onChange={handleChange}
        valueLabelDisplay="on"
        min={bounds?.min ?? value[0]}
        max={bounds?.max ?? value[1]}
        disableSwap
      />
    </Box>
  );
};

export default YearPicker;
