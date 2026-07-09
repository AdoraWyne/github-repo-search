import { getPageNumbers } from "../utils/getPageNumber";

type PaginationProps = {
  currentPage: number;
  maxPage: number;
  onPageChange: (v: number) => void;
};

const Pagination = ({
  currentPage,
  maxPage,
  onPageChange,
}: PaginationProps) => {
  const pages = getPageNumbers(currentPage, maxPage);

  return (
    <div>
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        Previous
      </button>
      {pages.map((page, i) => {
        if (page === "...") return <span key={`ellipsis-${i}`}>{page}</span>;
        return (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            disabled={page === currentPage}
            className="m-2"
          >
            {page}
          </button>
        );
      })}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === maxPage}
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;
