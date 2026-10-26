import { useEffect, useState, type ReactElement } from "react";
import { fetchCorpusSummary } from "../services/corpora";
import type { CorpusSummary } from "@mono/types";
import CollectionsCard from "./CollectionsCard";

type CorpusCardProps = {
  id: number;
};

const CorpusCard = (props: CorpusCardProps): ReactElement => {
  // a corpus card should show name years number of collections and number of letters
  // TODO: A courpus card should ideally also display stats about the corpus, such as number of authors and social variable distribution. Look into displaying graphs, data viz, etc.
  const [corpusSummary, setCorpusSummary] = useState<CorpusSummary | null>(
    null,
  );
  const [error, setError] = useState<string | null>(null);
  const [loadCollectionCard, setLoadCollectionCard] = useState<boolean>(false);

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
      <p>
        Collections: {corpusSummary.collectionCount} | Letters:{" "}
        {corpusSummary.letterCount} | Authors: {corpusSummary.authorCount} |
        Years: {corpusSummary.minYear}–{corpusSummary.maxYear}
      </p>
      <button
        type="button"
        onClick={() => setLoadCollectionCard(!loadCollectionCard)}
      >
        Show Collections
      </button>

      {loadCollectionCard && <CollectionsCard corpusId={props.id} />}
    </div>
  );
};

export default CorpusCard;
