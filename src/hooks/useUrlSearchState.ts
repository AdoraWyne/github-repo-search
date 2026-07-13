import { useSearchParams } from "react-router";
import type { SortOption } from "../types/github";

// validation at boundary
const parseSort = (raw: string | null): SortOption =>
  raw === "stars" || raw === "updated" ? raw : "best-match";

export const useUrlSearchState = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  // default value when query string is not existed
  const q = searchParams.get("q") ?? "";
  const page = Number(searchParams.get("page")) || 1;
  const per_page = Number(searchParams.get("per_page")) || 10;
  const sort = parseSort(searchParams.get("sort"));

  // update param
  const updateParams = (updates: Record<string, string>) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      for (const [key, value] of Object.entries(updates)) {
        next.set(key, value);
      }
      return next;
    });
  };

  const setQuery = (v: string) => updateParams({ q: v });
  const setPage = (v: number) => updateParams({ page: String(v) });
  const setPerPage = (v: number) =>
    updateParams({ per_page: String(v), page: "1" });
  const setSort = (v: SortOption) => updateParams({ sort: v, page: "1" });
  const setQueryAndResetPage = (v: string) => updateParams({ q: v, page: "1" });

  return {
    page,
    per_page,
    q,
    setPage,
    setPerPage,
    setQuery,
    setQueryAndResetPage,
    setSort,
    sort,
  };
};
