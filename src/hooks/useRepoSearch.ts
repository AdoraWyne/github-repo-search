import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { fetchRepoSearch } from "../api/github";
import type { ApiError, SearchResponse, SortOption } from "../types/github";

interface UseRepoSearchParams {
  q: string;
  page: number;
  per_page: number;
  sort: SortOption;
}

export const useRepoSearch = ({
  q,
  page,
  per_page,
  sort,
}: UseRepoSearchParams) => {
  return useQuery<SearchResponse, ApiError>({
    queryKey: ["repos", { q, page, per_page, sort }],
    queryFn: () => fetchRepoSearch({ q, page, per_page, sort }),
    enabled: q.trim().length > 0,
    staleTime: 60_000,
    placeholderData: keepPreviousData,
  });
};
