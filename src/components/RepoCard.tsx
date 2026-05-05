import type { Owner } from "../types/github";

export interface RepoCardProps {
  id: number;
  full_name: string;
  description: string | null;
  owner?: Owner;
  html_url: string;
  stargazers_count: number;
  language: string | null;
  updated_at: string;
}

export const RepoCard = ({
  id,
  full_name,
  description,
  owner,
  html_url,
  stargazers_count,
  language,
  updated_at,
}: RepoCardProps) => {
  return (
    <>
      <div className="border-1 border-solid border-pink-300 rounded-md p-4"></div>
    </>
  );
};
