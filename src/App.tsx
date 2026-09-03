import React, { useState, type SyntheticEvent } from "react";

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
  setUsername: React.Dispatch<React.SetStateAction<string>>;
  setLogInStatus: React.Dispatch<React.SetStateAction<boolean>>;
};

const UserLoginPrompt = (props: LogInProps) => {
  const [usernameInputValue, setUsernameInputValue] = useState("");
  const [passwordInputValue, setPasswordInputValue] = useState("");
  const [passwordInputType, setPasswordInputType] = useState("password");

  const handleUsernameFieldChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ): void => {
    setUsernameInputValue(event.target.value);
  };

  const handlePasswordFieldChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ): void => {
    setPasswordInputValue(event.target.value);
  };

  const onSubmit = (event: SyntheticEvent): void => {
    event.preventDefault();
    props.setUsername(usernameInputValue);
    props.setLogInStatus(true);

    console.log(
      `Username: ${usernameInputValue}, Password ${passwordInputValue}`,
    );
  };

  const toggleShowPassword = () => {
    if (passwordInputType === "password") {
      setPasswordInputType("text");
    } else {
      setPasswordInputType("password");
    }
  };

  return (
    <div>
      <h2>Log In</h2>
      <div>
        <form onSubmit={onSubmit}>
          <div>
            <label>
              Username
              <input
                value={usernameInputValue}
                onChange={handleUsernameFieldChange}
              />
            </label>
          </div>
          <div>
            <label>
              Password
              <input
                type={passwordInputType}
                value={passwordInputValue}
                onChange={handlePasswordFieldChange}
              />
              <button type="button" onClick={toggleShowPassword}>
                Show
              </button>
            </label>
          </div>
          <button type="submit">Log in</button>
        </form>
      </div>
    </div>
  );
};

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
        <Greeting name={name} onLogOut={handleLogout} />
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
