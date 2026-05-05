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
      <div className="border-1 border-solid border-pink-300 rounded-md p-4">
        {/* Header */}
        <div className="flex items-center">
          <img src={owner?.avatar_url} className="w-7 h-7 inline mr-2" />
          <span>
            <a
              href={html_url}
              target="_blank"
              className="text-pink-500 text-lg font-semibold"
            >
              {full_name}
            </a>
          </span>
        </div>

        {/* Description */}
        {description && (
          <div className="mt-2">
            <span>{description}</span>
          </div>
        )}

        {/* Footer */}
        <div className="mt-2">
          <ul className="flex text-gray-500 text-sm">
            {language && (
              <>
                <li>{language}</li>
                <span className="mx-2">.</span>
              </>
            )}
            <li>{stargazers_count} stars</li>
            <span className="mx-2">.</span>
            <li>{updated_at}</li>
          </ul>
        </div>
      </div>
    </>
  );
};
