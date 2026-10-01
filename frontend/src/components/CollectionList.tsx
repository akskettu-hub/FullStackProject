import axios from "axios";
import { useEffect, useState } from "react";

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
export default CollectionList;
