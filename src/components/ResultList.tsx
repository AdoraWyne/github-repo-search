import { useRepoSearch } from "../hooks/useRepoSearch";
import { useUrlSearchState } from "../hooks/useUrlSearchState";
import { RepoCard } from "./RepoCard";

// testing ---
import type { RepoCardProps } from "./RepoCard";
// ---

const ResultList: React.FC = () => {
  const { q, page, per_page, sort } = useUrlSearchState();
  const { data } = useRepoSearch({ q, page, per_page, sort });

  if (!q.trim()) {
    return <p>What do you want to search?</p>;
  }

  if (data && data.items.length === 0) {
    return <p>No repositories found for "{q}"</p>;
  }
  console.log("adora data: ", data);

  const testingData: RepoCardProps = {
    id: 10270250,
    full_name: "facebook/react",
    description: "The library for web and native user interfaces.",
    owner: {
      avatar_url: "https://avatars.githubusercontent.com/u/69631?v=4",
      url: "https://api.github.com/users/facebook",
    },
    html_url: "https://github.com/facebook/react",
    updated_at: "2026-04-30T16:42:54Z",
    stargazers_count: 244772,
    language: "JavaScript",
  };

  return (
    <>
      <ul>
        {data?.items.map(({ id, full_name, description }) => {
          return (
            <li key={id} className="my-4">
              <p>{full_name}</p>
              <p>{description}</p>
            </li>
          );
        })}
      </ul>

      <hr />
      <RepoCard
        id={testingData.id}
        full_name={testingData.full_name}
        description={testingData.description}
        owner={testingData.owner}
        html_url={testingData.html_url}
        stargazers_count={testingData.stargazers_count}
        language={testingData.language}
        updated_at={testingData.updated_at}
      />
    </>
  );
};

export default ResultList;
