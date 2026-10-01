import { useState, type SyntheticEvent } from "react";

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

export default UserLoginPrompt;
