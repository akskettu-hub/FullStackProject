import { useEffect, useState, type ReactElement } from "react";
import { fetchAuthors } from "../../services/authors";
import type { AuthorSummaries, AuthorSummary } from "@mono/types";
import { DataGrid, type GridColDef } from "@mui/x-data-grid";
import { Alert } from "@mui/material";

const yearFormat = (v: number | null): string => (v == null ? "?" : String(v));

const columns: GridColDef<AuthorSummary>[] = [
  { field: "authorKey", headerName: "Author", flex: 1, minWidth: 200 },
  { field: "letterCount", headerName: "Letters", type: "number", width: 100 },
  {
    field: "minYear",
    headerName: "From",
    type: "number",
    width: 90,
    valueFormatter: yearFormat,
  },
  {
    field: "maxYear",
    headerName: "To",
    type: "number",
    width: 90,
    valueFormatter: yearFormat,
  },
];

type AuthorsCardProps = {
  componentType: "Collection" | "Corpus" | "CorpusCollection";
  componentId: number;
};

const AuthorsCard = (props: AuthorsCardProps): ReactElement => {
  const [authorSummaries, setAuthorSummaries] =
    useState<AuthorSummaries | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchAuthors(props.componentType, props.componentId)
      .then((data) => {
        setAuthorSummaries(data);
      })
      .catch((e: unknown) => {
        setError(
          e instanceof Error ? e.message : "failed to get author summaries",
        );
      });
  }, [props.componentId, props.componentType]);

  if (error) return <Alert severity="error">Error: {error}</Alert>;

  return (
    <DataGrid
      rows={authorSummaries ?? []}
      loading={!authorSummaries && !error}
      columns={columns}
      getRowId={(r) => r.authorKey ?? "unknown"}
      density="compact"
      initialState={{
        sorting: { sortModel: [{ field: "letterCount", sort: "desc" }] },
        pagination: { paginationModel: { pageSize: 25 } },
      }}
      pageSizeOptions={[25, 50, 100]}
    />
  );
};

export default AuthorsCard;
