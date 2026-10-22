import { useEffect, useState, type ReactElement } from "react";
import { fetchCorpusSummary } from "../services/corpora";
import type { CorpusSummary } from "@mono/types";

type CorpusCardProps = {
  id: number;
};

const CorpusCard = (props: CorpusCardProps): ReactElement => {
  // a corpus card should show name years number of collections and number of letters
  const [corpusSummary, setCorpusSummary] = useState<CorpusSummary | null>(
    null,
  );
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchCorpusSummary(props.id)
      .then((data) => {
        setCorpusSummary(data);
      })
      .catch((e: unknown) => {
        setError(
          e instanceof Error ? e.message : "failed to load Corpus summary",
        );
      });
  }, [props.id]);

  if (error) return <p>Error: {error}</p>;
  if (!corpusSummary) return <p>Loading Corpus summary...</p>;

  return (
    <div>
      <strong>{corpusSummary.name}</strong>
      <p>Collections: {corpusSummary.collectionCount}</p>
      <p>Letters: {corpusSummary.letterCount}</p>
      <p>
        Years: {corpusSummary.minYear}–{corpusSummary.maxYear}
      </p>
    </div>
  );
};

export default CorpusCard;
