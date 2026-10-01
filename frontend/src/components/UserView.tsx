import { useEffect, useState } from "react";
import CollectionList from "./CollectionList";
import axios from "axios";

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

type Doc = {
  id: number;
  textContent: string;
  year: number;
};

type UserViewProps = {
  name: string;
  onLogOut: () => void;
};

const UserView = (props: UserViewProps) => {
  const [docs, setDocs] = useState<Doc[]>([]);

  useEffect(() => {
    axios.get<Doc[]>("http://localhost:3003/api/mock").then((res) => {
      console.log("promise fulfilled");
      const data = res.data;
      setDocs(data);
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
