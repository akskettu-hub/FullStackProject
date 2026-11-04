// Partly LLM generated: Claude Sonnet 5.5 Medium
import type {
  LetterSearchResult,
  PaginationModel,
  SearchFilters,
} from "@mono/types";
import { type ReactElement } from "react";
import { Alert, Box } from "@mui/material";
import { DataGrid, type GridColDef } from "@mui/x-data-grid";
import { useSearchLetters } from "../../../hooks/useSearchLetters";

const columns: GridColDef<LetterSearchResult["rows"][number]>[] = [
  { field: "xml_id", headerName: "Letter ID", flex: 1, minWidth: 200 },
  { field: "author_key", headerName: "Author", flex: 1, minWidth: 180 },
  {
    field: "year",
    headerName: "Year",
    type: "number",
    width: 90,
    valueFormatter: (v: number | null) => (v == null ? "?" : String(v)),
  },
  { field: "lang", headerName: "Language", width: 110 },
  { field: "text_type", headerName: "Type", width: 130 },
];

type SearchCorporaResultCardProps = {
  appliedFilters: SearchFilters;
  paginationModel: PaginationModel;
  onPaginationModelChange: (model: PaginationModel) => void;
};

const SearchCorporaResultCard = (
  props: SearchCorporaResultCardProps,
): ReactElement => {
  const { appliedFilters, paginationModel, onPaginationModelChange } = props;
  const { data, error, loading } = useSearchLetters(
    appliedFilters,
    paginationModel,
  );

  return (
    <Box>
      {error && <Alert severity="error">{error}</Alert>}
      <Box sx={{ height: 600 }}>
        <DataGrid
          rows={data?.rows ?? []}
          columns={columns}
          rowCount={data?.total ?? 0}
          loading={loading}
          paginationMode="server"
          paginationModel={paginationModel}
          onPaginationModelChange={onPaginationModelChange}
          pageSizeOptions={[25, 50, 100]}
          density="compact"
          disableColumnFilter
        />
      </Box>
    </Box>
  );
};

export default SearchCorporaResultCard;
