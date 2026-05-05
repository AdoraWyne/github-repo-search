import { useRepoSearch } from "../hooks/useRepoSearch";
import { useUrlSearchState } from "../hooks/useUrlSearchState";

const ResultList: React.FC = () => {
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
        {data?.items.map(({ id, full_name, description }) => {
          return (
            <li key={id} className="my-4">
              <p>{full_name}</p>
              <p>{description}</p>
            </li>
          );
        })}
      </ul>
    </>
  );
};

export default ResultList;
