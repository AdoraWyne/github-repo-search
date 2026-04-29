const SearchInput: React.FC = () => {
  return (
    <form>
      <input
        className="border border-gray-300 rounded-sm p-2 w-full bg-pink-50 my-4"
        type="text"
        id="search-query"
        name="search-query"
      />
      <br />
      <button className="border border-gray-300 rounded-sm p-2" type="submit">
        Submit
      </button>
    </form>
  );
};

export default SearchInput;
