import {
  ApiError,
  type ApiErrorType,
  type SearchResponse,
  type SortOption,
} from "../types/github";

export interface FetchRepoSearchParams {
  q: string;
  page: number;
  per_page: number;
  sort: SortOption;
}

// The sort values GitHub accepts as a `sort` query param that we also surface in
// the UI. "best-match" is the neutral default (expressed by omitting the param),
// so it is deliberately excluded. This is an allowlist: any value not listed here
// (including a corrupted URL like ?sort=banana) falls through and sends no sort.
// NB: "forks" is intentionally omitted — RepoCard doesn't show fork counts, so
// sorting by a dimension the user can't see would be confusing.
const SORTABLE_VALUES: readonly FetchRepoSearchParams["sort"][] = [
  "stars",
  "updated",
];

// Boundary logic: translate an HTTP status into our own error vocabulary so
// nothing downstream has to know about status codes. Skeleton for now — real
// mappings land test-first, one error code at a time (503 is first).
export const toErrorType = (status: number): ApiErrorType => {
  switch (status) {
    case 503:
      return "service_down";
    default:
      return "unknown";
  }
};

export const fetchRepoSearch = async (
  params: FetchRepoSearchParams,
): Promise<SearchResponse> => {
  // set the params
  const searchParams = new URLSearchParams();
  searchParams.set("q", params.q);
  searchParams.set("page", String(params.page));
  searchParams.set("per_page", String(params.per_page));
  if (SORTABLE_VALUES.includes(params.sort)) {
    searchParams.set("sort", params.sort);
  }

  // construct the API url
  const base = "https://api.github.com/search/repositories";
  const url = `${base}?${searchParams.toString()}`;

  // fetch API
  const res = await fetch(url);
  if (!res.ok) {
    throw new ApiError(
      `Github API Error: ${res.status} ${res.statusText}`,
      res.status,
      toErrorType(res.status),
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
