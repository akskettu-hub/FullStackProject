import type {
  CorpusCollectionSummary,
  CorpusCollectionWithCorpora,
} from "@mono/types";
import { useEffect, useState, type ReactElement } from "react";
import { fetchCorpusCollectionSummary } from "../../services/corpusCollections";
import CorpusCard from "./CorpusCard";
import AuthorsCard from "./AuthorsCard";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Card,
  Stack,
} from "@mui/material";
import SummaryStackItem from "./SummaryStackItem";
import { GridExpandMoreIcon } from "@mui/x-data-grid";

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

  if (error)
    return (
      <Card variant="outlined" sx={{ p: 2 }}>
        Error: {error}
      </Card>
    );
  if (!corpusCollectionSummary)
    return (
      <Card variant="outlined" sx={{ p: 2 }}>
        Loading Corpus Collection summary...
      </Card>
    );

  return (
    <Card
      variant="outlined"
      sx={{ padding: 5, borderLeft: 4, borderLeftColor: "blueviolet" }}
    >
      <h3>{props.corpusCollection.name}</h3>
      <Stack direction="row" spacing={2} sx={{ marginBottom: 1.5 }}>
        <SummaryStackItem variant="outlined">
          Corpora: {corpusCollectionSummary.corpusCount}
        </SummaryStackItem>
        <SummaryStackItem variant="outlined">
          Letters: {corpusCollectionSummary.letterCount}
        </SummaryStackItem>
        <SummaryStackItem variant="outlined">
          Authors: {corpusCollectionSummary.authorCount}
        </SummaryStackItem>
        <SummaryStackItem variant="outlined">
          Years: {corpusCollectionSummary.minYear}–
          {corpusCollectionSummary.maxYear}
        </SummaryStackItem>
      </Stack>

      <Accordion slotProps={{ transition: { unmountOnExit: true } }}>
        <AccordionSummary expandIcon={<GridExpandMoreIcon />}>
          <h4>Authors</h4>
        </AccordionSummary>
        <AccordionDetails>
          <AuthorsCard
            componentType="CorpusCollection"
            componentId={props.corpusCollection.id}
          />
        </AccordionDetails>
      </Accordion>

      <Stack
        component="ul"
        spacing={2}
        sx={{ listStyle: "none", m: 0, p: 0, mt: 2 }}
      >
        {props.corpusCollection.corpora.map((c) => (
          <CorpusCard key={c.id} id={c.id} />
        ))}
      </Stack>
    </Card>
  );
};

export default CorpusCollectionCard;
