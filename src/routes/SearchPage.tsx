import PageLayout from "../components/PageLayout";
import PageSizeSelect from "../components/PageSizeSelect";
import ResultList from "../components/ResultList";
import SearchInput from "../components/SearchInput";
import SortSelect from "../components/SortSelect";

const SearchPage = () => {
  return (
    <PageLayout>
      <h1 className="text-4xl font-semibold">
        Github Repository Search by adora 🐖
      </h1>

      <SearchInput />
      <PageSizeSelect />
      <SortSelect />
      <ResultList />
    </PageLayout>
  );
};

export default SearchPage;
