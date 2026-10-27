import { useEffect, useState, type ReactElement } from "react";
import { fetchAuthors } from "../../services/authors";
import type { AuthorSummaries } from "@mono/types";

type AuthorsCardProps = {
  componentType: "Collection" | "Corpus" | "CorpusCollection";
  componentId: number;
};

const AuthorsCard = (props: AuthorsCardProps): ReactElement => {
  const [authorSummaries, setAuthorSummaries] =
    useState<AuthorSummaries | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchAuthors(props.componentType, props.componentId)
      .then((data) => {
        setAuthorSummaries(data);
      })
      .catch((e: unknown) => {
        setError(
          e instanceof Error ? e.message : "failed to get author summaries",
        );
      });
  }, [props.componentId, props.componentType]);

  if (error) return <p>Error: {error}</p>;
  if (!authorSummaries) return <p>Loading Author Summaries summary...</p>;

  return (
    <ul>
      {authorSummaries.map((summary) => (
        <li key={summary.authorKey}>
          {summary.authorKey}: {summary.letterCount} | {summary.minYear}–
          {summary.maxYear}
        </li>
      ))}
    </ul>
  );
};

export default AuthorsCard;
