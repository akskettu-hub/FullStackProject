import { useEffect, useState, type ReactElement } from "react";
import { fetchCorpusSummary } from "../../services/corpora";
import type { CorpusSummary } from "@mono/types";
import CollectionsCard from "./CollectionsCard";
import AuthorsCard from "./AuthorsCard";

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

  const showCollectionsButtonLable = loadCollectionCard
    ? "Hide Collections"
    : "Show Collections";

  const [loadAuthorsCard, setLoadAuthorsCard] = useState<boolean>(false);

  const showAuthorsButtonLable = loadAuthorsCard
    ? "Hide Authors"
    : "Show Authors";

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

  if (error) return <li>Error: {error}</li>;
  if (!corpusSummary) return <li>Loading Corpus summary...</li>;

  return (
    <li>
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
        {showCollectionsButtonLable}
      </button>
      <button
        type="button"
        onClick={() => setLoadAuthorsCard(!loadAuthorsCard)}
      >
        {showAuthorsButtonLable}
      </button>

      {loadCollectionCard && <CollectionsCard corpusId={props.id} />}
      {loadAuthorsCard && (
        <AuthorsCard componentType="Corpus" componentId={props.id} />
      )}
    </li>
  );
};

export default CorpusCard;
