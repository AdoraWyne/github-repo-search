import { useState } from "react";
import { useUrlSearchState } from "../hooks/useUrlSearchState";

const SearchInput: React.FC = () => {
  const { q, setQueryAndResetPage } = useUrlSearchState();
  const [value, setValue] = useState<string>(q);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  };

  const handleSubmit = (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    setQueryAndResetPage(value.trim());
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
      <button
        className="border border-gray-300 rounded-sm p-2"
        disabled={!value.trim()}
        type="submit"
      >
        Submit
      </button>
    </form>
  );
};

export default SearchInput;
