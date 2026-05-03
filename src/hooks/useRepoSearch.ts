import { useQuery } from "@tanstack/react-query";
import { fetchRepoSearch } from "../api/github";

interface UseRepoSearchParams {
  q: string;
  page: number;
  per_page: number;
  sort: "best-match" | "stars" | "forks" | "updated";
}

export const useRepoSearch = ({
  q,
  page,
  per_page,
  sort,
}: UseRepoSearchParams) => {
  return useQuery({
    queryKey: ["repos", { q, page, per_page, sort }],
    queryFn: () => fetchRepoSearch({ q, page, per_page, sort }),
    enabled: q.trim().length > 0,
    staleTime: 60_000,
  });
};
