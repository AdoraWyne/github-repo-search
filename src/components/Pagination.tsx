import { getPageNumbers } from "../utils/getPageNumber";

export type PaginationProps = {
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
    <nav aria-label="Pagination">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        Previous
      </button>
      {pages.map((page, i) => {
        if (page === "...")
          return (
            <span key={`ellipsis-${i}`} aria-hidden="true">
              {page}
            </span>
          );
        return (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            disabled={page === currentPage}
            aria-label={`Page ${page}`}
            aria-current={page === currentPage ? "page" : undefined}
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
    </nav>
  );
};

export default Pagination;
