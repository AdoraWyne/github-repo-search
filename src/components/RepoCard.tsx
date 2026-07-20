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

  // Each metadata item draws its own leading "." via CSS, so the separators are
  // decoration (not DOM content) and the <ul> holds only <li>. `first:` drops the
  // dot from whichever item renders first (language is optional, so "first" varies).
  const metaItem = "before:content-['.'] before:mx-2 first:before:content-none";

  return (
    <article className="border border-solid border-pink-300 rounded-md p-4">
      {/* Header */}
      <div className="flex items-center">
        {/* Decorative: the repo-name link beside it already conveys identity.
            alt="" tells screen readers to skip it (vs. omitting alt, which makes
            some readers announce the filename/URL). */}
        <img src={owner?.avatar_url} alt="" className="w-7 h-7 inline mr-2" />
        <span>
          <a
            href={html_url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-pink-600 text-xl font-semibold"
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
          {language && <li className={metaItem}>{language}</li>}
          <li className={metaItem}>{starsLabel}</li>
          <li className={metaItem}>{updatedLabel}</li>
        </ul>
      </div>
    </article>
  );
};
