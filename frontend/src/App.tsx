import { useState, type ReactElement } from "react";
import { Route, Routes } from "react-router-dom";
import { Container } from "@mui/material";

import HeaderLayout from "./components/HeaderLayout";
import HomePage from "./components/HomePage";
import UserLoginPrompt from "./components/UserLoginPrompt";
import ExploreCorporaPage from "./components/ExplorePage/index";

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
      <section>
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
            <Route path="/explore" element={<ExploreCorporaPage />} />
            <Route path="/*" element={<h1>404 - Not found, mate</h1>} />
          </Route>
        </Routes>
      </section>
    </Container>
  );
};

export default App;
