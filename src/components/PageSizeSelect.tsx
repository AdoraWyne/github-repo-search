import { useUrlSearchState } from "../hooks/useUrlSearchState";

const PageSizeSelect = () => {
  const { per_page, setPerPage } = useUrlSearchState();

  return (
    <div className="inline-flex items-center gap-2 rounded-md border border-gray-300 bg-white px-3 py-1.5 focus-within:ring-2 focus-within:ring-pink-300">
      <label htmlFor="per_page" className="text-sm text-gray-600">
        Per page
      </label>
      <select
        name="per_page"
        id="per_page"
        value={per_page}
        onChange={(e) => setPerPage(Number(e.target.value))}
        className="cursor-pointer border-none bg-transparent p-0 text-sm text-gray-900 focus:outline-none"
      >
        <option value="10">10</option>
        <option value="25">25</option>
        <option value="50">50</option>
      </select>
    </div>
  );
};

export default PageSizeSelect;
