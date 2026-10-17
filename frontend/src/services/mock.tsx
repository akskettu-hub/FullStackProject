import axios from "axios";
import type { Doc } from "../components/UserView";

const getAll = async (): Promise<Doc[]> => {
  const res = await axios.get<Doc[]>("http://localhost:3003/api/mock");
  return res.data;
};

export default { getAll };
