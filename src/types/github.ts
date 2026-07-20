// The sort options the UI surfaces and the GitHub API accepts. "best-match" is the
// neutral default (sent as no `sort` param).
export type SortOption = "best-match" | "stars" | "updated";

export interface Owner {
  avatar_url: string;
}

export interface Repo {
  id: number;
  full_name: string;
  description: string | null;
  owner?: Owner;
  html_url: string;
  stargazers_count: number;
  language: string | null;
  updated_at: string;
}

export interface SearchResponse {
  total_count: number;
  incomplete_results: boolean;
  items: Repo[];
}

// The semantic error categories the UI renders. The presentation layer branches
// on this — never on the raw HTTP status — so GitHub's status codes stay out of
// the components. `unknown` is the catch-all (network failures, unexpected 5xx).
export type ApiErrorType =
  | "rate_limited"
  | "invalid_query"
  | "service_down"
  | "unknown";

export class ApiError extends Error {
  status: number;
  // Required: every ApiError carries a semantic category.
  type: ApiErrorType;

  constructor(message: string, status: number, type: ApiErrorType) {
    super(message);
    this.status = status;
    this.type = type;
    this.name = "ApiError";
  }
}
