import { useState } from "react";
import { useRepoSearch } from "../hooks/useRepoSearch";
import { useUrlSearchState } from "../hooks/useUrlSearchState";
import { RepoCard } from "./RepoCard";
import { formatCompactNumber } from "../utils/formatCompactNumber";
import { relativeTime } from "../utils/relativeTime";
import Pagination from "./Pagination";

const GITHUB_RESULT_CAP = 1_000;

const ResultList: React.FC = () => {
  const [dateNow] = useState(() => Date.now());
  const { q, page, per_page, sort, setPage } = useUrlSearchState();
  const { data } = useRepoSearch({ q, page, per_page, sort });

  if (!q.trim()) {
    return <p>What do you want to search?</p>;
  }

  if (!data) {
    return <p>Loading…</p>;
  }

  if (data && data.items.length === 0) {
    return <p>No repositories found for "{q}"</p>;
  }

  const maxPage = Math.min(
    Math.ceil(data.total_count / per_page),
    Math.ceil(GITHUB_RESULT_CAP / per_page),
  );

  return (
    <>
      <p>About {formatCompactNumber(data.total_count)} results.</p>
      <ul>
        {data.items.map(
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
      {data.total_count > per_page && (
        <Pagination
          currentPage={page}
          maxPage={maxPage}
          onPageChange={setPage}
        />
      )}
    </>
  );
};

export default ResultList;
