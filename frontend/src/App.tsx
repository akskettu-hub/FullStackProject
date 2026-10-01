import axios from "axios";
import React, { useEffect, useState, type SyntheticEvent } from "react";

type GreetingProps = {
  name: string;
};

const Greeting = (props: GreetingProps) => {
  return (
    <div>
      <p>Welcome, {props.name}!</p>
    </div>
  );
};

type UserViewProps = {
  name: string;
  onLogOut: () => void;
  docs: Doc[];
};

const UserView = (props: UserViewProps) => {
  console.log("props docs", props.docs);
  return (
    <div>
      <Greeting name={props.name} />
      {props.docs.map((doc) => (
        <p key={doc.id}>
          {doc.year}: {doc.textContent}
        </p>
      ))}
      <CollectionList />
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

type Doc = {
  id: number;
  textContent: string;
  year: number;
};

interface TitleStatement {
  seq: number;
  text: string;
}

interface Collection {
  id: number;
  xml_id: string;
  titleStatements: TitleStatement[];
}

const CollectionList = () => {
  const [collections, setCollections] = useState<Collection[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    axios
      .get<Collection[]>("http://localhost:3003/api/collections")
      .then((res) => {
        console.log("promise fulfilled");
        return res.data;
      })
      .then((data: Collection[]) => setCollections(data))
      .catch((e) => setError(e));
  }, []);

  if (!collections) return <p>Error loading collections: {error}</p>;
  if (error) return <p>Error loading collections: {error}</p>;

  return (
    <ul>
      {collections.map((c) => (
        <li key={c.id}>
          <strong>{c.xml_id}</strong>
          <ul>
            {c.titleStatements.map((stmt) => (
              <li key={stmt.seq}>{stmt.text}</li>
            ))}
          </ul>
        </li>
      ))}
    </ul>
  );
};

const App = () => {
  const [name, setName] = useState<string>("");
  const [logInStatus, setLogInStatus] = useState<boolean>(false);
  const [docs, setDocs] = useState<Doc[]>([]);

  function handleLogout() {
    console.log("log out button clicked.");
    setLogInStatus(false);
    setName("");
  }

  useEffect(() => {
    console.log("effect");

    axios.get<Doc[]>("http://localhost:3003/api/mock").then((res) => {
      console.log("promise fulfilled");
      const data = res.data;
      setDocs(data);
    });
  }, []);
  console.log("got", docs.length, "docs");

  return (
    <section>
      <div>
        <h1>Ceecer</h1>
        <h2>A Full Stack Project</h2>
        <p>Seek and thou shalt find</p>
      </div>
      {logInStatus ? (
        <UserView name={name} onLogOut={handleLogout} docs={docs} />
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
