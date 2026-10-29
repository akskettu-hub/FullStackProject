import type { ReactElement } from "react";
import { Typography } from "@mui/material";
import CorpusCollectionsCard from "./CorpusCollectionsCard";

const ExploreCorporaPage = (): ReactElement => {
  return (
    <div>
      <Typography variant="h3" sx={{ paddingBottom: 1 }}>
        Explore Corpora
      </Typography>
      <CorpusCollectionsCard />
    </div>
  );
};

export default ExploreCorporaPage;
