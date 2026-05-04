import PageLayout from "../components/PageLayout";
import ResultList from "../components/ResultList";
import SearchInput from "../components/SearchInput";

const SearchPage = () => {
  return (
    <PageLayout>
      <h1 className="text-4xl font-semibold">
        Github Repository Search by adora 🐖
      </h1>

      <SearchInput />
      <ResultList />
    </PageLayout>
  );
};

export default SearchPage;
