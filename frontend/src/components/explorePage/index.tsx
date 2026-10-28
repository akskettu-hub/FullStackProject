import type { ReactElement } from "react";
import CorpusCollectionsCard from "./CorpusCollectionsCard";
import { Typography } from "@mui/material";

const ExploreCorporaPage = (): ReactElement => {
  return (
    <main>
      <Typography variant="h4" component="h1">
        Explore Corpora
      </Typography>
      <CorpusCollectionsCard />
    </main>
  );
};

export default ExploreCorporaPage;
