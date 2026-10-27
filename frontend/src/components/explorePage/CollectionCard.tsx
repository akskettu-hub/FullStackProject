import type { CollectionSummary } from "@mono/types";
import { type ReactElement } from "react";

type CollectionCardProps = {
  collectionSummary: CollectionSummary;
};

const CollecionCard = (props: CollectionCardProps): ReactElement => {
  return (
    <li>
      <p>
        <strong>{props.collectionSummary.xml_id}</strong> Letters:{" "}
        {props.collectionSummary.letterCount} | Authors:{" "}
        {props.collectionSummary.authorCount} | Years:{" "}
        {props.collectionSummary.minYear}–{props.collectionSummary.maxYear}
      </p>
    </li>
  );
};

export default CollecionCard;
