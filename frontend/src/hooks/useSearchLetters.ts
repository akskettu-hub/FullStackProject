import type {
  LetterSearchResult,
  PaginationModel,
  SearchFilters,
} from "@mono/types";
import { useEffect, useState } from "react";
import { fetchSearchLetters, searchFilterToParams } from "../services/search";

export const useSearchLetters = (
  filters: SearchFilters,
  pagination: PaginationModel,
): {
  data: LetterSearchResult | null;
  error: string | null;
  loading: boolean;
} => {
  const [data, setData] = useState<LetterSearchResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const { page, pageSize } = pagination;

  useEffect(() => {
    let ignore = false;

    const params = new URLSearchParams({
      ...searchFilterToParams(filters),
      page: String(page),
      pageSize: String(pageSize),
    });

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLoading(true);
    setError(null);

    fetchSearchLetters(params)
      .then((result) => {
        if (!ignore) setData(result);
      })
      .catch((e: unknown) => {
        if (!ignore) {
          setError(
            e instanceof Error ? e.message : "failed to load search result :(",
          );
        }
      })
      .finally(() => {
        if (!ignore) setLoading(false);
      });
    return (): void => {
      ignore = true;
    };
  }, [filters, page, pageSize]);

  return { data, error, loading };
};
