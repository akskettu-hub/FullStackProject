import type { CollectionSummary } from "@mono/types";
import { type ReactElement } from "react";
import CollectionTitleStmtsCard from "./CollectionTitleStmtsCard";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Card,
  Divider,
  Stack,
  Typography,
} from "@mui/material";
import SummaryStackItem from "./SummaryStackItem";
import AuthorsCard from "./AuthorsCard";
import { GridExpandMoreIcon } from "@mui/x-data-grid";

type CollectionCardProps = {
  collectionSummary: CollectionSummary;
};

const CollecionCard = (props: CollectionCardProps): ReactElement => {
  return (
    <Card
      sx={{
        marginBottom: 2,
        paddingLeft: 1,
        paddingRight: 1,
        borderLeft: 3,
        borderLeftColor: "blue",
      }}
    >
      <Typography variant="body1" component="h4" sx={{ p: 0.5 }}>
        {props.collectionSummary.xml_id}
      </Typography>
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

      <Accordion slotProps={{ transition: { unmountOnExit: true } }}>
        <AccordionSummary expandIcon={<GridExpandMoreIcon />}>
          <h4>Authors</h4>
        </AccordionSummary>
        <AccordionDetails>
          <AuthorsCard
            componentType="Collection"
            componentId={props.collectionSummary.id}
          />
        </AccordionDetails>
      </Accordion>

      <Accordion slotProps={{ transition: { unmountOnExit: true } }}>
        <AccordionSummary expandIcon={<GridExpandMoreIcon />}>
          <h4>Sources & Editorial Notes</h4>
        </AccordionSummary>
        <AccordionDetails>
          <CollectionTitleStmtsCard collectionId={props.collectionSummary.id} />
        </AccordionDetails>
      </Accordion>

      <Divider sx={{ marginTop: 1.5, marginBottom: 1.5 }} />
    </Card>
  );
};

export default CollecionCard;
