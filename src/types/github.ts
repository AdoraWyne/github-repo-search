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

export class ApiError extends Error {
  status: number;
  rateLimitReset?: number;

  constructor(message: string, status: number, rateLimitReset?: number) {
    super(message);
    this.status = status;
    this.rateLimitReset = rateLimitReset;
    this.name = "ApiError";
  }
}

// id: items[] -> item.id
// full_name: items[] -> item.full_name
// owner avatar: items[] -> item.owner?.avatar_url
// owner login (linked to owner's GitHub page)
// description: items[] -> item.description
// html_url: item.html_url
// stargazers_count: items[] -> item.stargazers_count
// primary language: items[] -> item.language
// updatedAt: items[] -> item.updated_at
