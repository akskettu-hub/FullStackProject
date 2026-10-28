import type { CollectionWithTitleStmts } from "@mono/types";
import { useEffect, useState, type ReactElement } from "react";
import { fetchCollectionTitleStmts } from "../../services/collections";
import { Alert, Box, CircularProgress, Typography } from "@mui/material";

type CollectionTitleStmtsCardProps = {
  collectionId: number;
};
const CollectionTitleStmtsCard = (
  props: CollectionTitleStmtsCardProps,
): ReactElement => {
  const [titleStmts, setTitleStmts] = useState<CollectionWithTitleStmts | null>(
    null,
  );
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchCollectionTitleStmts(props.collectionId)
      .then((data) => {
        setTitleStmts(data);
      })
      .catch((e: unknown) => {
        setError(
          e instanceof Error ? e.message : "failed to get author summaries",
        );
      });
  }, [props.collectionId]);

  if (error) return <Alert severity="error">Error: {error}</Alert>;
  if (!titleStmts) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", p: 3 }}>
        <CircularProgress size={24} />
      </Box>
    );
  }

  return (
    <Box>
      {titleStmts.titleStatements.map((stmt) => (
        <Typography key={stmt.seq} variant="body2" sx={{ padding: 0.5 }}>
          {stmt.text}
        </Typography>
      ))}
    </Box>
  );
};

export default CollectionTitleStmtsCard;
