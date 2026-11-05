import type { HistogramResponse, SearchFilters } from "@mono/types";
import { useEffect, useState } from "react";
import {
  fetchSearchResultsHistogram,
  searchFilterToParams,
} from "../services/search";

export const useSearchResultHistogram = (
  filters: SearchFilters,
): {
  data: HistogramResponse | null;
  error: string | null;
  loading: boolean;
} => {
  const [data, setData] = useState<HistogramResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let ignore = false;

    const params = new URLSearchParams({
      ...searchFilterToParams(filters),
    });

    fetchSearchResultsHistogram(params)
      .then((result) => {
        if (!ignore) setData(result);
      })
      .catch((e: unknown) => {
        if (!ignore) {
          setError(e instanceof Error ? e.message : "Failed to load histogram");
        }
      })
      .finally(() => {
        if (!ignore) setLoading(false);
      });
    return (): void => {
      ignore = true;
    };
  }, [filters]);
  return { data, error, loading };
};
