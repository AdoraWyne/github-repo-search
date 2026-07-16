import { useState } from "react";
import { useRepoSearch } from "../hooks/useRepoSearch";
import { useUrlSearchState } from "../hooks/useUrlSearchState";
import { formatCompactNumber } from "../utils/formatCompactNumber";
import { relativeTime } from "../utils/relativeTime";
import Pagination from "./Pagination";
import { SkeletonCard } from "./SkeletonCard";
import { RepoCard } from "./RepoCard";
import { EmptyState } from "./EmptyState";

const GITHUB_RESULT_CAP = 1_000;
const SKELETON_COUNT = 6;

const ResultList: React.FC = () => {
  const [dateNow] = useState(() => Date.now());
  const { q, page, per_page, sort, setPage } = useUrlSearchState();
  const { data, isLoading } = useRepoSearch({ q, page, per_page, sort });

  if (!q.trim()) {
    return <p>What do you want to search?</p>;
  }

  if (isLoading && !data) {
    return (
      <div role="status">
        <span className="sr-only">Loading repositories…</span>
        <ul>
          {Array.from({ length: SKELETON_COUNT }).map((_, i) => (
            <li key={i} className="my-4">
              <SkeletonCard />
            </li>
          ))}
        </ul>
      </div>
    );
  }

  // When first request is return with an error, so no data (isLoading is false)
  if (!data) return null;

  if (data?.items.length === 0) {
    return <EmptyState query={q} />;
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
