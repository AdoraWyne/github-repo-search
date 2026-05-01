import { ApiError, type SearchResponse } from "../types/github";

interface FetchRepoSearchParams {
  q: string;
  page: number;
  per_page: number;
  sort: "best-match" | "stars" | "forks" | "updated";
}

export const fetchRepoSearch = async (
  params: FetchRepoSearchParams,
): Promise<SearchResponse> => {
  // set the params
  const searchParams = new URLSearchParams();
  searchParams.set("q", params.q);

  // construct the API url
  const base = "https://api.github.com/search/repositories";
  const url = `${base}?${searchParams.toString()}`;

  // fetch API
  const res = await fetch(url);
  if (!res.ok) {
    throw new ApiError(
      `Github API Error: ${res.status} ${res.statusText}`,
      res.status,
    );
  }
  return res.json();
};

// Ask
// - res.json -> Promise<any>
// - fetchRepoSearch -> Promise<SearchResponse>
