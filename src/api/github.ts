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

// Comment: this could be a potential bug
// Claude chat: https://claude.ai/chat/ffe51ab3-edec-4949-80d4-cc1015ad1583

/**
 * Promise<any> from res.json() and Promise<SearchRepo> from the fetchRepoSearch function.
 *
 * This could be a potential bug, because what if res.json return something does not match with SearchRepo type, TS will trust it but not verify because any matches with any type including SearchRepo type
 *
 * so compiler will not able to catch it and we only know during runtime.
 *
 * Unless we use define a schema, i.e. Zod for res.json so it will check when res.json returns and the schema able to return some sort of errors.
 */
