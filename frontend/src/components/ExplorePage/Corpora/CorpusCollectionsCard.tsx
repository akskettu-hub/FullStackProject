import type { CorpusCollectionsWithCorpora } from "@mono/types";
import { useEffect, useState, type ReactElement } from "react";
import { fetchCorpusCollection } from "../../../services/corpusCollections";
import CorpusCollectionCard from "./CorpusCollectionCard";
import { Stack } from "@mui/material";

const CorpusCollectionsCard = (): ReactElement => {
  const [corpusCollections, setCorpusCollections] =
    useState<CorpusCollectionsWithCorpora | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchCorpusCollection()
      .then((data): void => {
        setCorpusCollections(data);
      })
      .catch((e: unknown) => {
        setError(
          e instanceof Error ? e.message : "failed to load Corpus collections",
        );
      });
  }, []);

  if (error) return <p>Error: {error}</p>;
  if (!corpusCollections) return <p>Loading Corpus collections...</p>;

  return (
    <Stack spacing={2}>
      {corpusCollections.map((cc): ReactElement => (
        <CorpusCollectionCard key={cc.id} corpusCollection={cc} />
      ))}
    </Stack>
  );
};

export default CorpusCollectionsCard;
