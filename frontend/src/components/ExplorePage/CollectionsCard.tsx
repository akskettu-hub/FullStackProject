import type { CollectionSummaries } from "@mono/types";
import { useEffect, useState, type ReactElement } from "react";
import { fetchCollectionSummaries } from "../../services/collections";
import CollecionCard from "./CollectionCard";
import { Box, Stack } from "@mui/material";

type CollectionsCardProps = {
  corpusId: number;
};

const CollectionsCard = (props: CollectionsCardProps): ReactElement => {
  const [collectionSummaries, setCollectionSummaries] =
    useState<CollectionSummaries | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchCollectionSummaries(props.corpusId)
      .then((data) => {
        setCollectionSummaries(data);
      })
      .catch((e: unknown) => {
        setError(
          e instanceof Error
            ? e.message
            : "failed to load Collection Summaries.",
        );
      });
  }, [props.corpusId]);

  if (error)
    return (
      <Box>
        <p>Error: {error}</p>
      </Box>
    );

  if (!collectionSummaries)
    return (
      <Box>
        <p>Loading Collection Summaries summary...</p>
      </Box>
    );

  return (
    <Stack spacing={1}>
      {collectionSummaries.map((col) => (
        <CollecionCard key={col.id} collectionSummary={col} />
      ))}
    </Stack>
  );
};

export default CollectionsCard;
