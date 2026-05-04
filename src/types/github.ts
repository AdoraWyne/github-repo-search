export interface Repo {
  id: number;
  full_name: string;
  description: string | null;
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
