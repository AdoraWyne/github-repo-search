import { useState } from "react";
import { useQuery } from "@tanstack/react-query";

const SearchInput: React.FC = () => {
  const [value, setValue] = useState<string>("");

  const fetchRepos = async () => {
    const res = await fetch("https://api.github.com/search/repositories?q=Q");
    if (!res.ok) {
      throw new Error("Network error");
    }
    return res.json();
  };

  const { data } = useQuery({
    queryKey: ["repos"],
    queryFn: fetchRepos,
  });

  console.log("adora Repo: ", data);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  };

  const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    alert("query submitted: " + value.trim());
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        className="border border-gray-300 rounded-sm p-2 w-full bg-pink-50 my-4"
        id="search-query"
        name="search-query"
        onChange={handleChange}
        type="text"
        value={value}
      />
      <br />
      <button
        className="border border-gray-300 rounded-sm p-2"
        disabled={!value}
        type="submit"
      >
        Submit
      </button>
    </form>
  );
};

export default SearchInput;
