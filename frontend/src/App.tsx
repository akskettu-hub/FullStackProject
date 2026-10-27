import { useState, type ReactElement } from "react";

import UserLoginPrompt from "./components/UserLoginPrompt";
import UserView from "./components/UserView";
import { Link, Route, Routes } from "react-router-dom";
import ExploreCorporaPage from "./components/explorePage/index";
import { Container } from "@mui/material";

const App = (): ReactElement => {
  const [name, setName] = useState<string>("");
  const [logInStatus, setLogInStatus] = useState<boolean>(false);

  const handleLogout = (): void => {
    setLogInStatus(false);
    setName("");
  };

  if (logInStatus) console.log("logged in.");

  return (
    <Container>
      <section>
        <div>
          <h1>Ceecer</h1>
          <h2>A Full Stack Project</h2>
          <p>Seek and thou shalt find</p>
        </div>
        <nav>
          <Link to="/">Home</Link> | <Link to="/login">Login</Link> |{" "}
          <Link to="/corpora">Corpora</Link>
        </nav>

        <Routes>
          <Route
            path="/"
            element={<UserView name={name} onLogOut={handleLogout} />}
          />
          <Route
            path="/login"
            element={
              <UserLoginPrompt
                setUsername={setName}
                setLogInStatus={setLogInStatus}
              />
            }
          />
          <Route path="/corpora" element={<ExploreCorporaPage />} />
          <Route path="/*" element={<h1>404 - Not found, mate</h1>} />
        </Routes>
      </section>
    </Container>
  );
};

export default App;
