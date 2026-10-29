import { useState, type ReactElement } from "react";

import UserLoginPrompt from "./components/UserLoginPrompt";
import UserView from "./components/UserView";
import { Link, Route, Routes } from "react-router-dom";
import ExploreCorporaPage from "./components/explorePage/index";
import { Container, Typography } from "@mui/material";

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
          <Typography variant="h1" component="h1">
            CEECer
          </Typography>
          <Typography variant="h1" component="h1">
            A Full Stack Project h1
          </Typography>
          <Typography variant="h2" component="h2">
            A Full Stack Project h2
          </Typography>

          <Typography variant="h3" component="h3">
            A Full Stack Project h3
          </Typography>
          <Typography variant="h4" component="h4">
            A Full Stack Project h4
          </Typography>
          <Typography variant="h5" component="h5">
            A Full Stack Project h5
          </Typography>
          <Typography variant="h6" component="h6">
            A Full Stack Project h6
          </Typography>
          <Typography variant="body1" component="p">
            Seek and thou shalt find body 1
          </Typography>
          <Typography variant="body2" component="p">
            Seek and thou shalt find body 2
          </Typography>
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
