// Partially LLM generated: Claude Sonnet 5.5 Medium
import type { SearchFilters } from "@mono/types";
import { LineChart } from "@mui/x-charts/LineChart";
import {
  Alert,
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";
import { useMemo, useState, type ReactElement } from "react";
import { useSearchResultHistogram } from "../../../hooks/useSearchResultChart";
import { getBins } from "../../../services/search";

const BIN_SIZES = [1, 5, 10, 20, 25, 50, 100] as const;

type SearchResultHistogramProps = {
  appliedFilters: SearchFilters;
};

const SearchResultHistogram = (
  props: SearchResultHistogramProps,
): ReactElement => {
  const { appliedFilters } = props;
  const { data, error } = useSearchResultHistogram(appliedFilters);
  const [binSize, setBinSize] = useState<number>(20);

  const bins = useMemo(
    () => (data !== null ? getBins(data.rows, binSize) : []),
    [data, binSize],
  );

  return (
    <Box>
      {error && <Alert severity="error">{error}</Alert>}
      {data !== null && (
        <LineChart
          dataset={bins}
          xAxis={[
            {
              dataKey: "bin",
              scaleType: "point",
            },
          ]}
          yAxis={[{ width: "auto" }]}
          series={[{ dataKey: "count", label: "Letters", curve: "linear" }]}
          height={500}
          grid={{ vertical: true, horizontal: true }}
        />
      )}
      <FormControl size="medium">
        <InputLabel id="bin-size-label">Bin size (years)</InputLabel>
        <Select
          labelId="bin-size-label"
          label="Bin size (years)"
          value={binSize}
          onChange={(e) => setBinSize(Number(e.target.value))}
        >
          {BIN_SIZES.map((s) => (
            <MenuItem key={s} value={s}>
              {s}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
};

export default SearchResultHistogram;
