// Partly LLM generated: Claude Sonnet 5.5 Medium
import type { LetterSearchResult } from "@mono/types";
import { useEffect, useState, type ReactElement } from "react";
import { fetchLetterSearch } from "../../services/letters";
import { Box } from "@mui/material";
import { DataGrid, type GridColDef } from "@mui/x-data-grid";

const HARDCODED_FILTERS = {
  corpora: "58,60",
  yearFrom: "1525",
  yearTo: "1650",
};

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

const SearchCroporaCard = (): ReactElement => {
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 25,
  });
  const [data, setData] = useState<LetterSearchResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const params = new URLSearchParams({
      ...HARDCODED_FILTERS,
      page: String(paginationModel.page),
      pageSize: String(paginationModel.pageSize),
    });

    fetchLetterSearch(params)
      .then((data) => {
        setData(data);
      })
      .catch((e: unknown) => {
        setError(
          e instanceof Error ? e.message : "failed to load search result :(",
        );
      });
  }, [paginationModel.page, paginationModel.pageSize]);

  if (error)
    return (
      <Box>
        <p>Error: {error}</p>
      </Box>
    );
  if (!data)
    return (
      <Box>
        <p>Loading Search Results...</p>
      </Box>
    );

  return (
    <Box sx={{ height: 600 }}>
      <DataGrid
        rows={data?.rows ?? []}
        columns={columns}
        rowCount={data?.total ?? 0}
        loading={!data && !error}
        paginationMode="server"
        paginationModel={paginationModel}
        onPaginationModelChange={setPaginationModel}
        pageSizeOptions={[25, 50, 100]}
        density="compact"
        disableColumnFilter
      />
    </Box>
  );
};

export default SearchCroporaCard;
