import { useState } from "react";
import { useUrlSearchState } from "../hooks/useUrlSearchState";

const SearchInput = () => {
  const { q, setQueryAndResetPage } = useUrlSearchState();
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
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
        <div className="sm:flex-1">
          <label htmlFor="search-query" className="sr-only">
            Search repositories
          </label>
          <input
            className="border border-gray-300 rounded-sm p-2 w-full bg-pink-50 outline-none focus:ring-2 focus:ring-pink-300"
            id="search-query"
            name="search-query"
            onChange={handleChange}
            type="text"
            value={value}
          />
        </div>
        <button
          className="border border-gray-300 rounded-sm p-2 hover:bg-pink-50 hover:cursor-pointer"
          disabled={!value.trim()}
          type="submit"
        >
          {" "}
          Submit
        </button>
      </div>
    </form>
  );
};

export default SearchInput;
