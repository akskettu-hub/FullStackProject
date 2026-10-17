import { useEffect, useState, type ReactElement } from "react";
import CollectionList from "./CollectionList";
import mockService from "../services/mock.tsx";

type GreetingProps = {
  name: string;
};

const Greeting = (props: GreetingProps): ReactElement => {
  return (
    <div>
      <p>Welcome, {props.name}!</p>
    </div>
  );
};

export type Doc = {
  id: number;
  textContent: string;
  year: number;
};

type UserViewProps = {
  name: string;
  onLogOut: () => void;
};

const UserView = (props: UserViewProps): ReactElement => {
  const [docs, setDocs] = useState<Doc[]>([]);

  useEffect(() => {
    const cancelled = false;
    mockService
      .getAll()
      .then((data) => {
        if (!cancelled) setDocs(data);
      })
      .catch((e: unknown) => {
        console.error("Failed to load docs", e);
      });
  }, []);

  console.log("got", docs.length, "docs");
  console.log("docs", docs);

  return (
    <div>
      <Greeting name={props.name} />
      {docs.map((doc) => (
        <p key={doc.id}>
          {doc.year}: {doc.textContent}
        </p>
      ))}
      <CollectionList />
      <button onClick={props.onLogOut}>Log out</button>
    </div>
  );
};

export default UserView;
