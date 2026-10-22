import type {
  CorpusCollectionsWithCorpora,
  CorpusCollectionWithCorpora,
} from "@mono/types";
import { useEffect, useState, type ReactElement } from "react";
import { fetchCorpusCollection } from "../services/corpusCollections";
import CorpusCard from "./CorpusCard";

type CorpusCollectionCardProps = {
  corpusCollection: CorpusCollectionWithCorpora;
};

const CorpusCollectionCard = (
  props: CorpusCollectionCardProps,
): ReactElement => {
  return (
    <div>
      <strong>{props.corpusCollection.name}</strong>
      <li key={props.corpusCollection.id}>
        {props.corpusCollection.corpora.map((c) => (
          <CorpusCard key={c.id} id={c.id} />
        ))}
      </li>
    </div>
  );
};

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
    <div>
      <p>Corpus collection card here</p>
      <p>Corpus collections present {corpusCollections.length}</p>
      {corpusCollections.map((cc): ReactElement => (
        <CorpusCollectionCard key={cc.id} corpusCollection={cc} />
      ))}
    </div>
  );
};

export default CorpusCollectionsCard;
