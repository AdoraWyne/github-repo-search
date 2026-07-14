import { useUrlSearchState } from "../hooks/useUrlSearchState";
import type { SortOption } from "../types/github";

const SortSelect = () => {
  const { sort, setSort } = useUrlSearchState();

  return (
    <div className="inline-flex items-center gap-2 rounded-md border border-gray-300 bg-white px-3 py-1.5 focus-within:ring-2 focus-within:ring-pink-300">
      <label htmlFor="sort" className="text-sm text-gray-600">
        Sort by
      </label>
      <select
        id="sort"
        value={sort}
        onChange={(e) => setSort(e.target.value as SortOption)}
        className="cursor-pointer border-none bg-transparent p-0 text-sm text-gray-900 focus:outline-none"
      >
        <option value="best-match">Best match</option>
        <option value="stars">Most stars</option>
        <option value="updated">Recently updated</option>
      </select>
    </div>
  );
};

export default SortSelect;
