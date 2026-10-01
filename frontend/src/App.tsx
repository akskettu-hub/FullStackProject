import { useState } from "react";

import UserLoginPrompt from "./components/UserLoginPrompt";
import UserView from "./components/UserView";

const App = () => {
  const [name, setName] = useState<string>("");
  const [logInStatus, setLogInStatus] = useState<boolean>(false);

  function handleLogout() {
    console.log("log out button clicked.");
    setLogInStatus(false);
    setName("");
  }

  return (
    <section>
      <div>
        <h1>Ceecer</h1>
        <h2>A Full Stack Project</h2>
        <p>Seek and thou shalt find</p>
      </div>
      {logInStatus ? (
        <UserView name={name} onLogOut={handleLogout} />
      ) : (
        <UserLoginPrompt
          setUsername={setName}
          setLogInStatus={setLogInStatus}
        />
      )}
    </section>
  );
};

export default App;
