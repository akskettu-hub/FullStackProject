import type { SearchFilters } from "@mono/types";
import { LineChart } from "@mui/x-charts/LineChart";
import { Alert, Box } from "@mui/material";
import type { ReactElement } from "react";
import { useSearchResultHistogram } from "../../../hooks/useSearchResultChart";

type SearchResultHistogramProps = {
  appliedFilters: SearchFilters;
};

const SearchResultHistogram = (
  props: SearchResultHistogramProps,
): ReactElement => {
  const { appliedFilters } = props;
  const { data, error } = useSearchResultHistogram(appliedFilters);
  return (
    <Box>
      {error && <Alert severity="error">{error}</Alert>}
      {data !== null && (
        <LineChart
          dataset={data.rows}
          xAxis={[
            {
              dataKey: "year",
              valueFormatter: (value: number) => value.toString(),
            },
          ]}
          yAxis={[{ width: 100 }]}
          series={[{ dataKey: "count", label: "Letters" }]}
          height={300}
        />
      )}
    </Box>
  );
};

export default SearchResultHistogram;
