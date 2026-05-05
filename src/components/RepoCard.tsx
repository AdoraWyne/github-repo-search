import type { Owner } from "../types/github";
import { formatCompactNumber } from "../utils/formatCompactNumber";

export interface RepoCardProps {
  full_name: string;
  description: string | null;
  owner?: Owner;
  html_url: string;
  stargazers_count: number;
  language: string | null;
  updatedLabel: string;
}

export const RepoCard = ({
  full_name,
  description,
  owner,
  html_url,
  stargazers_count,
  language,
  updatedLabel,
}: RepoCardProps) => {
  const starsLabel = `${formatCompactNumber(stargazers_count)} ${stargazers_count === 1 ? "star" : "stars"}`;

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
          <ul className="flex text-gray-500 text-sm items-center flex-wrap">
            {language && (
              <>
                <li>{language}</li>
                <span className="mx-2">.</span>
              </>
            )}
            <li>{starsLabel}</li>
            <span className="mx-2">.</span>
            <li>{updatedLabel}</li>
          </ul>
        </div>
      </div>
    </>
  );
};
