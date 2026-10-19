import { type ReactElement } from "react";
import CollectionList from "./CollectionList";
//import mockService from "../services/mock.tsx";

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
  //logInStatus: boolean;
  onLogOut: () => void;
};

const UserView = (props: UserViewProps): ReactElement => {
  /*
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

  const [docs, setDocs] = useState<Doc[]>([]);

  console.log("got", docs.length, "docs");
  console.log("docs", docs);
  
      {docs.map((doc) => (
        <p key={doc.id}>
          {doc.year}: {doc.textContent}
        </p>
      ))}
    */

  return (
    <div>
      <Greeting name={props.name} />
      <CollectionList />
      <button onClick={props.onLogOut}>Log out</button>
    </div>
  );
};

export default UserView;
