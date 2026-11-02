import type { ReactElement } from "react";
import { Typography } from "@mui/material";
import SearchForm from "./SearchForm";
import SearchCorporaResultCard from "./SearchCorporaResultCard";

const SearchCorporaPage = (): ReactElement => {
  return (
    <div>
      <Typography variant="h3" sx={{ paddingBottom: 1 }}>
        Search Corpora
      </Typography>

      <SearchForm />
      <SearchCorporaResultCard />
    </div>
  );
};

export default SearchCorporaPage;
