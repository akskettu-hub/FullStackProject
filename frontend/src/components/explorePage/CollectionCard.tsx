import type { CollectionSummary } from "@mono/types";
import { useState, type ReactElement } from "react";
import Authors from "./AuthorsCard";
import CollectionTitleStmtsCard from "./CollectionTitleStmtsCard";

type CollectionCardProps = {
  collectionSummary: CollectionSummary;
};

const CollecionCard = (props: CollectionCardProps): ReactElement => {
  const [loadStmtsCard, setLoadStmtsCard] = useState<boolean>(false);
  const showStmtsButtonLable = loadStmtsCard ? "Hide Sources" : "Show Sources";

  const [loadAuthorsCard, setLoadAuthorsCard] = useState<boolean>(false);
  const showAuthorsButtonLable = loadAuthorsCard
    ? "Hide Authors"
    : "Show Authors";

  return (
    <li>
      <p>
        <strong>{props.collectionSummary.xml_id}</strong> Letters:{" "}
        {props.collectionSummary.letterCount} | Authors:{" "}
        {props.collectionSummary.authorCount} | Years:{" "}
        {props.collectionSummary.minYear}–{props.collectionSummary.maxYear}
      </p>
      {loadStmtsCard && (
        <CollectionTitleStmtsCard collectionId={props.collectionSummary.id} />
      )}

      <button type="button" onClick={() => setLoadStmtsCard(!loadStmtsCard)}>
        {showStmtsButtonLable}
      </button>

      <button
        type="button"
        onClick={() => setLoadAuthorsCard(!loadAuthorsCard)}
      >
        {showAuthorsButtonLable}
      </button>

      {loadAuthorsCard && (
        <Authors
          componentId={props.collectionSummary.id}
          componentType="Collection"
        />
      )}
    </li>
  );
};

export default CollecionCard;
