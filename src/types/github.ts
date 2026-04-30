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
