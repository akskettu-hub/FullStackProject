import type { CollectionSummary } from "@mono/types";
import { useState, type ReactElement } from "react";
import Authors from "./AuthorsCard";

type CollectionCardProps = {
  collectionSummary: CollectionSummary;
};

const CollecionCard = (props: CollectionCardProps): ReactElement => {
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
