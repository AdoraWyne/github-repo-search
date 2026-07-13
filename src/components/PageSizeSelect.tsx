import { useUrlSearchState } from "../hooks/useUrlSearchState";

const PageSizeSelect = () => {
  const { per_page, setPerPage } = useUrlSearchState();

  return (
    <div>
      <label htmlFor="per_page">Per Page:</label>
      <select
        name="per_page"
        id="per_page"
        value={per_page}
        onChange={(e) => setPerPage(Number(e.target.value))}
      >
        <option value="10">10</option>
        <option value="25">25</option>
        <option value="50">50</option>
      </select>
    </div>
  );
};

export default PageSizeSelect;
