import { useState, type ReactElement } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { Container } from "@mui/material";

import HeaderLayout from "./components/HeaderLayout";
import HomePage from "./components/HomePage";
import UserLoginPrompt from "./components/UserLoginPrompt";
import ExplorePageLayout from "./components/ExplorePage/ExplorePageLayout";
import ExploreAuthorsPage from "./components/ExplorePage/Authors";
import ExploreCorporaPage from "./components/ExplorePage/Corpora";
import SearchCorporaPage from "./components/SearchPage";

const App = (): ReactElement => {
  const [name, setName] = useState<string>("");
  const [logInStatus, setLogInStatus] = useState<boolean>(false);

  /*
  const handleLogout = (): void => {
    setLogInStatus(false);
    setName("");
  };
   */

  if (logInStatus) console.log("logged in.");
  return (
    <Container>
      <Routes>
        <Route element={<HeaderLayout />}>
          <Route path="/" element={<HomePage name={name} />} />
          <Route
            path="/login"
            element={
              <UserLoginPrompt
                setUsername={setName}
                setLogInStatus={setLogInStatus}
              />
            }
          />
          <Route path="/explore" element={<ExplorePageLayout />}>
            <Route index element={<Navigate to="corpora" replace />} />
            <Route path="corpora" element={<ExploreCorporaPage />} />
            <Route path="authors" element={<ExploreAuthorsPage />} />
          </Route>
          <Route path="/search" element={<SearchCorporaPage />} />
          <Route path="/*" element={<h1>404 - Not found, mate</h1>} />
        </Route>
      </Routes>
    </Container>
  );
};

export default App;
