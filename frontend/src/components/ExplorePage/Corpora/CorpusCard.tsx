import { useEffect, useState, type ReactElement } from "react";
import { fetchCorpusSummary } from "../../../services/corpora";
import type { CorpusSummary } from "@mono/types";
import CollectionsCard from "./CollectionsCard";
import AuthorsCard from "./AuthorsCard";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Card,
  Stack,
  Typography,
} from "@mui/material";
import SummaryStackItem from "../../UI/SummaryStackItem";
import { GridExpandMoreIcon } from "@mui/x-data-grid";

type CorpusCardProps = {
  id: number;
};

const CorpusCard = (props: CorpusCardProps): ReactElement => {
  // a corpus card should show name years number of collections and number of letters
  // TODO: A courpus card should ideally also display stats about the corpus, such as number of authors and social variable distribution. Look into displaying graphs, data viz, etc.
  const [corpusSummary, setCorpusSummary] = useState<CorpusSummary | null>(
    null,
  );
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchCorpusSummary(props.id)
      .then((data) => {
        setCorpusSummary(data);
      })
      .catch((e: unknown) => {
        setError(
          e instanceof Error ? e.message : "failed to load Corpus summary",
        );
      });
  }, [props.id]);

  if (error)
    return (
      <Card
        variant="outlined"
        sx={{ p: 2, borderLeft: 4, borderLeftColor: "green" }}
      >
        <p>Error: {error}</p>
      </Card>
    );
  if (!corpusSummary)
    return (
      <Card
        variant="outlined"
        sx={{ p: 2, borderLeft: 4, borderLeftColor: "green" }}
      >
        <p>Loading Corpus summary...</p>
      </Card>
    );

  return (
    <Card
      variant="outlined"
      sx={{
        borderLeft: 4,
        borderLeftColor: "secondary.main",
      }}
    >
      <Typography variant="h5">{corpusSummary.name}</Typography>
      <Stack direction="row" spacing={2} sx={{ marginBottom: 1.5 }}>
        <SummaryStackItem variant="outlined">
          Collections: {corpusSummary.collectionCount}
        </SummaryStackItem>
        <SummaryStackItem variant="outlined">
          Letters: {corpusSummary.letterCount}
        </SummaryStackItem>
        <SummaryStackItem variant="outlined">
          Authors: {corpusSummary.authorCount}
        </SummaryStackItem>
        <SummaryStackItem variant="outlined">
          Years: {corpusSummary.minYear ?? "?"}–{corpusSummary.maxYear ?? "?"}
        </SummaryStackItem>
      </Stack>

      <AuthorsCard componentType="Corpus" componentId={props.id} />

      <Accordion
        slotProps={{ transition: { timeout: 150, unmountOnExit: true } }}
      >
        <AccordionSummary expandIcon={<GridExpandMoreIcon />}>
          <Typography variant="body1" component="h4">
            Collections
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <CollectionsCard corpusId={props.id} />
        </AccordionDetails>
      </Accordion>
    </Card>
  );
};

export default CorpusCard;
