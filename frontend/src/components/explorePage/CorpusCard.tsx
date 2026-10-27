import { useEffect, useState, type ReactElement } from "react";
import { fetchCorpusSummary } from "../../services/corpora";
import type { CorpusSummary } from "@mono/types";
import CollectionsCard from "./CollectionsCard";
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
  const [loadCollectionCard, setLoadCollectionCard] = useState<boolean>(false);

  const showCollectionsButtonLable = loadCollectionCard
    ? "Hide Collections"
    : "Show Collections";

  const [loadAuthorsCard, setLoadAuthorsCard] = useState<boolean>(false);

  const showAuthorsButtonLable = loadAuthorsCard
    ? "Hide Authors"
    : "Show Authors";

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

  if (error) return <li>Error: {error}</li>;
  if (!corpusSummary) return <li>Loading Corpus summary...</li>;

  return (
    <Card
      component="li"
      variant="outlined"
      sx={{ p: 2, borderLeft: 2, borderLeftColor: "green" }}
    >
      <h4>{corpusSummary.name}</h4>
      <Stack direction="row" spacing={2}>
        <SummaryStackItem>
          Collections: {corpusSummary.collectionCount}
        </SummaryStackItem>
        <SummaryStackItem>
          Letters: {corpusSummary.letterCount}
        </SummaryStackItem>
        <SummaryStackItem>
          Years: {corpusSummary.minYear ?? "?"}–{corpusSummary.maxYear ?? "?"}
        </SummaryStackItem>
      </Stack>
      <Accordion slotProps={{ transition: { unmountOnExit: true } }}>
        <AccordionSummary expandIcon={<GridExpandMoreIcon />}>
          <h4>Authors</h4>
        </AccordionSummary>
        <AccordionDetails>
          <AuthorsCard componentType="Corpus" componentId={props.id} />
        </AccordionDetails>
      </Accordion>
      {loadCollectionCard && <CollectionsCard corpusId={props.id} />}
      {loadAuthorsCard && (
        <AuthorsCard componentType="Corpus" componentId={props.id} />
      )}
      <button
        type="button"
        onClick={() => setLoadCollectionCard(!loadCollectionCard)}
      >
        {showCollectionsButtonLable}
      </button>
      <button
        type="button"
        onClick={() => setLoadAuthorsCard(!loadAuthorsCard)}
      >
        {showAuthorsButtonLable}
      </button>
    </Card>
  );
};

export default CorpusCard;
