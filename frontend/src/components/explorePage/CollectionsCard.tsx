import type { CollectionSummaries } from "@mono/types";
import { useEffect, useState, type ReactElement } from "react";
import { fetchCollectionSummaries } from "../../services/collections";
import CollecionCard from "./CollectionCard";

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

  if (error) return <p>Error: {error}</p>;
  if (!collectionSummaries)
    return <p>Loading Collection Summaries summary...</p>;

  return (
    <div>
      {collectionSummaries.map((col) => (
        <CollecionCard key={col.id} collectionSummary={col} />
      ))}
    </div>
  );
};

export default CollectionsCard;
