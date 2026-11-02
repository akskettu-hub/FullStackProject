import { useEffect, useState } from "react";
import type { SearchOptions } from "@mono/types";
import { fetchSearchOptions } from "../services/search";

type SearchOptionsState =
  | { status: "loading" }
  | { status: "error"; error: string }
  | { status: "success"; options: SearchOptions };

export const useSearchOptions = (): SearchOptionsState => {
  const [state, setState] = useState<SearchOptionsState>({ status: "loading" });

  useEffect(() => {
    let ignore = false;

    fetchSearchOptions()
      .then((options) => {
        if (!ignore) setState({ status: "success", options });
      })
      .catch((e: unknown) => {
        if (!ignore) {
          setState({
            status: "error",
            error:
              e instanceof Error
                ? e.message
                : "failed to fetch search options :P",
          });
        }
      });
    return (): void => {
      ignore = true;
    };
  }, []);

  return state;
};
