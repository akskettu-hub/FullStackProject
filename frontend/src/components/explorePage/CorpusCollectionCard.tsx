import type {
  CorpusCollectionSummary,
  CorpusCollectionWithCorpora,
} from "@mono/types";
import { useEffect, useState, type ReactElement } from "react";
import { fetchCorpusCollectionSummary } from "../../services/corpusCollections";
import CorpusCard from "./CorpusCard";
import AuthorsCard from "./AuthorsCard";
import { Card, Stack } from "@mui/material";
import SummaryStackItem from "./SummaryStackItem";

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

  const [loadAuthorsCard, setLoadAuthorsCard] = useState<boolean>(false);

  const showAuthorsButtonLable = loadAuthorsCard
    ? "Hide Authors"
    : "Show Authors";

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

  if (error) return <li>Error: {error}</li>;
  if (!corpusCollectionSummary)
    return <li>Loading Corpus Collection summary...</li>;

  return (
    <Card
      variant="outlined"
      sx={{ padding: 5, borderLeft: 4, borderLeftColor: "blueviolet" }}
    >
      <h3>{props.corpusCollection.name}</h3>
      <Stack direction="row" spacing={2}>
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
      <button
        type="button"
        onClick={() => setLoadAuthorsCard(!loadAuthorsCard)}
      >
        {showAuthorsButtonLable}
      </button>
      {loadAuthorsCard && (
        <AuthorsCard
          componentType="CorpusCollection"
          componentId={props.corpusCollection.id}
        />
      )}
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
