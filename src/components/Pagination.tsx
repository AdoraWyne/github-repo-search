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
        className={`m-1 px-3 py-2 border-none rounded-md ${currentPage === 1 ? "text-gray-400 cursor-not-allowed" : "text-black hover:cursor-pointer hover:bg-gray-100"}`}
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
            className={`m-1 px-3 py-2 border-none rounded-md hover:cursor-pointer ${page === currentPage ? "bg-pink-200" : "hover:bg-gray-100"}`}
          >
            {page}
          </button>
        );
      })}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === maxPage}
        className={`m-1 px-3 py-2 border-none rounded-md ${currentPage === maxPage ? "text-gray-400 cursor-not-allowed" : "text-black hover:cursor-pointer hover:bg-gray-100"}`}
      >
        Next
      </button>
    </nav>
  );
};

export default Pagination;
