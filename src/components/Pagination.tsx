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

  const baseBtn = "m-1 px-3 py-2 border-none rounded-md";
  const navBtn = (isBoundary: boolean) =>
    `${baseBtn} ${
      isBoundary
        ? "text-gray-400 cursor-not-allowed"
        : "text-black hover:cursor-pointer hover:bg-gray-100"
    }`;

  return (
    <nav aria-label="Pagination">
      <button
        onClick={() => {
          if (currentPage > 1) onPageChange(currentPage - 1);
        }}
        aria-disabled={currentPage === 1}
        aria-label="Previous page"
        className={navBtn(currentPage === 1)}
      >
        Previous
      </button>
      {pages.map((page, i) => {
        if (page === "...")
          return (
            <span
              key={`ellipsis-${i}`}
              aria-hidden="true"
              className="text-gray-400 cursor-not-allowed"
            >
              {page}
            </span>
          );
        return (
          <button
            key={page}
            onClick={() => {
              if (currentPage !== page) onPageChange(page);
            }}
            aria-label={`Page ${page}`}
            aria-current={page === currentPage ? "page" : undefined}
            className={`${baseBtn} ${page === currentPage ? "bg-pink-200 cursor-default" : "hover:cursor-pointer hover:bg-gray-100"}`}
          >
            {page}
          </button>
        );
      })}
      <button
        onClick={() => {
          if (currentPage < maxPage) onPageChange(currentPage + 1);
        }}
        aria-disabled={currentPage === maxPage}
        aria-label="Next page"
        className={navBtn(currentPage === maxPage)}
      >
        Next
      </button>
    </nav>
  );
};

export default Pagination;
