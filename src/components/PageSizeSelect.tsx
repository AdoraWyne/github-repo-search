import { useUrlSearchState } from "../hooks/useUrlSearchState";

const PageSizeSelect = () => {
  const { per_page, setPerPage } = useUrlSearchState();

  return (
    <div className="flex flex-col gap-1">
      <label htmlFor="per_page" className="text-sm font-medium text-gray-600">
        Per page
      </label>
      <select
        name="per_page"
        id="per_page"
        value={per_page}
        onChange={(e) => setPerPage(Number(e.target.value))}
        className="cursor-pointer rounded-sm border border-gray-300 bg-pink-50 p-2 focus:outline-none focus:ring-2 focus:ring-pink-300"
      >
        <option value="10">10</option>
        <option value="25">25</option>
        <option value="50">50</option>
      </select>
    </div>
  );
};

export default PageSizeSelect;
