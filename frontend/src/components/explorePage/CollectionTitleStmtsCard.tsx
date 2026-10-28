import type { CollectionWithTitleStmts } from "@mono/types";
import { useEffect, useState, type ReactElement } from "react";
import { fetchCollectionTitleStmts } from "../../services/collections";

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

  if (error) return <p>Error: {error}</p>;
  if (!titleStmts) return <p>Loading Collection title statements summary...</p>;

  return (
    <div>
      {titleStmts.titleStatements.map((stmt) => (
        <p key={stmt.seq}>{stmt.text}</p>
      ))}
    </div>
  );
};

export default CollectionTitleStmtsCard;
