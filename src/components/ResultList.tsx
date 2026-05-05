import { useState } from "react";
import { useRepoSearch } from "../hooks/useRepoSearch";
import { useUrlSearchState } from "../hooks/useUrlSearchState";
import { RepoCard } from "./RepoCard";
import { relativeTime } from "../utils/relativeTime";

const ResultList: React.FC = () => {
  const [dateNow] = useState(() => Date.now());
  const { q, page, per_page, sort } = useUrlSearchState();
  const { data } = useRepoSearch({ q, page, per_page, sort });

  if (!q.trim()) {
    return <p>What do you want to search?</p>;
  }

  if (data && data.items.length === 0) {
    return <p>No repositories found for "{q}"</p>;
  }

  return (
    <>
      <ul>
        {data?.items.map(
          ({
            id,
            full_name,
            description,
            owner,
            html_url,
            stargazers_count,
            language,
            updated_at,
          }) => {
            return (
              <li key={id} className="my-4">
                <RepoCard
                  full_name={full_name}
                  description={description}
                  owner={owner}
                  html_url={html_url}
                  stargazers_count={stargazers_count}
                  language={language}
                  updatedLabel={relativeTime(dateNow, updated_at)}
                />
              </li>
            );
          },
        )}
      </ul>
    </>
  );
};

export default ResultList;
