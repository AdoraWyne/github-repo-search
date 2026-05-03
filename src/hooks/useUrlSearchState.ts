import { useSearchParams } from "react-router";

export type SortOption = "best-match" | "stars" | "forks" | "updated";

export const useUrlSearchState = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  // default value when query string is not existed
  const q = searchParams.get("q") ?? "";
  const page = Number(searchParams.get("page")) || 1;
  const per_page = Number(searchParams.get("per_page")) || 10;
  const sort = (searchParams.get("sort") as SortOption) ?? "best-match";

  return {
    page,
    per_page,
    q,
    sort,
  };
};
