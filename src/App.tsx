import { useState } from "react";

type GreetingProps = {
  name: string;
  onLogOut: () => void;
};

const Greeting = (props: GreetingProps) => {
  console.log(props);
  return (
    <div>
      <p>Welcome, {props.name}!</p>
      <button onClick={props.onLogOut}>Log out</button>
    </div>
  );
};

type LogInProps = {
  logInStatus: boolean;
  handler: () => void;
};

const UserLoginPrompt = (props: LogInProps) => {
  return (
    <div>
      <h2>Log In</h2>
      <p>please press log in</p>
      <button onClick={props.handler}>Log in</button>
    </div>
  );
};

const App = () => {
  const name = "Timmy";
  const [logInStatus, setLogInStatus] = useState<boolean>(false);

  function handleLogIn() {
    console.log("log in button clicked.");
    setLogInStatus(true);
  }

  function handleLogout() {
    console.log("log out button clicked.");
    setLogInStatus(false);
  }
  //
  return (
    <section>
      <div>
        <h1>Ceecer</h1>
        <h2>A Full Stack Project</h2>
        <p>Seek and thou shalt find</p>
      </div>
      {logInStatus ? (
        <Greeting name={name} onLogOut={handleLogout} />
      ) : (
        <UserLoginPrompt logInStatus={logInStatus} handler={handleLogIn} />
      )}
    </section>
  );
};

export default App;
