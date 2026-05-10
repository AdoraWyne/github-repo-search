import { useState } from "react";
import { useUrlSearchState } from "../hooks/useUrlSearchState";

const SearchInput = () => {
  const { per_page, q, setPerPage, setQueryAndResetPage } = useUrlSearchState();
  const [value, setValue] = useState<string>(q);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  };

  const handleSubmit = (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    const trimmed = value.trim();
    if (!trimmed) return;
    setQueryAndResetPage(trimmed);
  };

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="search-query" className="sr-only">
        Search repositories
      </label>
      <input
        className="border border-gray-300 rounded-sm p-2 w-full bg-pink-50 my-4"
        id="search-query"
        name="search-query"
        onChange={handleChange}
        type="text"
        value={value}
      />
      <div>
        <label htmlFor="per_page">Per Page:</label>
        <select
          name="per_page"
          id="per_page"
          defaultValue={per_page}
          onChange={(e) => setPerPage(Number(e.target.value))}
        >
          <option value="10">10</option>
          <option value="25">25</option>
          <option value="50">50</option>
        </select>
      </div>
      <button
        className="border border-gray-300 rounded-sm p-2"
        disabled={!value.trim()}
        type="submit"
      >
        {" "}
        Submit
      </button>
    </form>
  );
};

export default SearchInput;
