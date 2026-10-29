import type { CollectionSummary } from "@mono/types";
import { type ReactElement } from "react";
import CollectionTitleStmtsCard from "./CollectionTitleStmtsCard";
import { Card, Divider, Stack, Typography } from "@mui/material";
import SummaryStackItem from "./SummaryStackItem";
import AuthorsCard from "./AuthorsCard";

type CollectionCardProps = {
  collectionSummary: CollectionSummary;
};

const CollecionCard = (props: CollectionCardProps): ReactElement => {
  return (
    <Card
      sx={{
        borderLeft: 4,
        borderLeftColor: "info.light",
      }}
    >
      <Typography variant="h6">{props.collectionSummary.xml_id}</Typography>

      <Stack direction="row" spacing={2} sx={{ marginBottom: 1.5 }}>
        <SummaryStackItem variant="outlined">
          Letters: {props.collectionSummary.letterCount}
        </SummaryStackItem>
        <SummaryStackItem variant="outlined">
          Authors: {props.collectionSummary.authorCount}
        </SummaryStackItem>
        <SummaryStackItem variant="outlined">
          Years: {props.collectionSummary.minYear}–
          {props.collectionSummary.maxYear}
        </SummaryStackItem>
      </Stack>

      <AuthorsCard
        componentType="Collection"
        componentId={props.collectionSummary.id}
      />

      <CollectionTitleStmtsCard collectionId={props.collectionSummary.id} />

      <Divider sx={{ marginTop: 1.5, marginBottom: 1.5 }} />
    </Card>
  );
};

export default CollecionCard;
