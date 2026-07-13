import { useUrlSearchState, type SortOption } from "../hooks/useUrlSearchState";

const SortSelect = () => {
  const { sort, setSort } = useUrlSearchState();

  return (
    <div className="flex flex-col gap-1">
      <label htmlFor="sort" className="text-sm font-medium text-gray-600">
        Sort by
      </label>
      <select
        id="sort"
        value={sort}
        onChange={(e) => setSort(e.target.value as SortOption)}
        className="cursor-pointer rounded-sm border border-gray-300 bg-pink-50 p-2 focus:outline-none focus:ring-2 focus:ring-pink-300"
      >
        <option value="best-match">Best match</option>
        <option value="stars">Most stars</option>
        <option value="updated">Recently updated</option>
      </select>
    </div>
  );
};

export default SortSelect;
