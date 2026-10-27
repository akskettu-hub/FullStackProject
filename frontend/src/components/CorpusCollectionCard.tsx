import type {
  CorpusCollectionSummary,
  CorpusCollectionsWithCorpora,
  CorpusCollectionWithCorpora,
} from "@mono/types";
import { useEffect, useState, type ReactElement } from "react";
import {
  fetchCorpusCollection,
  fetchCorpusCollectionSummary,
} from "../services/corpusCollections";
import CorpusCard from "./CorpusCard";

type CorpusCollectionCardProps = {
  corpusCollection: CorpusCollectionWithCorpora;
};

const CorpusCollectionCard = (
  props: CorpusCollectionCardProps,
): ReactElement => {
  // TODO: A corpus collection card should display info about the cc, with number of collections, letters, etc.
  // TODO: Eventually a corpus card should also display stats about social variables, see todo in corpus card element.
  // TODO: Decide what is a good way to do these queries. Should a Corpus collection card get all the info for the corpora as well? What is a sensible division of labour?
  const [corpusCollectionSummary, setCorpusCollectionSummary] =
    useState<CorpusCollectionSummary | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchCorpusCollectionSummary(props.corpusCollection.id)
      .then((data) => {
        setCorpusCollectionSummary(data);
      })
      .catch((e: unknown) => {
        setError(
          e instanceof Error ? e.message : "failed to load corpus Summary",
        );
      });
  }, [props.corpusCollection.id]);

  if (error) return <p>Error: {error}</p>;
  if (!corpusCollectionSummary)
    return <p>Loading Corpus Collection summary...</p>;

  return (
    <li>
      <strong>{props.corpusCollection.name}</strong>
      <p>
        Corpora: {corpusCollectionSummary.corpusCount} | Collections:{" "}
        {corpusCollectionSummary.collectionCount} | Letters:{" "}
        {corpusCollectionSummary.letterCount} | Authors:{" "}
        {corpusCollectionSummary.authorCount} | Years:{" "}
        {corpusCollectionSummary.minYear}–{corpusCollectionSummary.maxYear}
      </p>
      <ul key={props.corpusCollection.id}>
        {props.corpusCollection.corpora.map((c) => (
          <CorpusCard key={c.id} id={c.id} />
        ))}
      </ul>
    </li>
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
    <section>
      <ul>
        {corpusCollections.map((cc): ReactElement => (
          <CorpusCollectionCard key={cc.id} corpusCollection={cc} />
        ))}
      </ul>
    </section>
  );
};

export default CorpusCollectionsCard;
