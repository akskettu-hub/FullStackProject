import type { ReactElement } from "react";
import { Typography } from "@mui/material";
import SearchCroporaCard from "./SearchCorporaCard";

const SearchCorporaPage = (): ReactElement => {
  return (
    <div>
      <Typography variant="h3" sx={{ paddingBottom: 1 }}>
        Search Corpora
      </Typography>

      <p>This is the search page. Implement later :)</p>
      <SearchCroporaCard />
    </div>
  );
};

export default SearchCorporaPage;
