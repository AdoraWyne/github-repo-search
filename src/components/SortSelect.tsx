import { useUrlSearchState, type SortOption } from "../hooks/useUrlSearchState";

const SortSelect = () => {
  const { sort, setSort } = useUrlSearchState();

  return (
    <>
      <label htmlFor="sort">Sort by:</label>
      <select
        id="sort"
        value={sort}
        onChange={(e) => setSort(e.target.value as SortOption)}
      >
        <option value="best-match">Best match</option>
        <option value="stars">Most stars</option>
        <option value="updated">Recently updated</option>
      </select>
    </>
  );
};

export default SortSelect;
