import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import Pagination, { type PaginationProps } from "./Pagination";

const renderPagination = (props: Partial<PaginationProps> = {}) => {
  const user = userEvent.setup();
  const onPageChange = vi.fn();
  render(
    <Pagination
      currentPage={1}
      maxPage={10}
      onPageChange={onPageChange}
      {...props}
    />,
  );

  return { user, onPageChange };
};

describe("Pagination", () => {
  it("calls onPageChange with the clicked page number", async () => {
    const { user, onPageChange } = renderPagination();

    const pageButton = screen.getByRole("button", { name: "Page 2" });
    await user.click(pageButton);

    expect(onPageChange).toHaveBeenCalledWith(2);
    expect(onPageChange).toHaveBeenCalledTimes(1);
  });

  it("disables Previous button when on page 1", () => {
    renderPagination();

    const previousButton = screen.getByRole("button", { name: /previous/i });

    expect(previousButton).toBeDisabled();
  });

  it("disables Next button when on the last page", () => {
    renderPagination({ currentPage: 10 });

    const nextButton = screen.getByRole("button", { name: /next/i });

    expect(nextButton).toBeDisabled();
  });

  it("marks the active page with aria-current='page'", () => {
    renderPagination({ currentPage: 3 });

    const pageButton = screen.getByRole("button", { name: "Page 3" });

    expect(pageButton).toHaveAttribute("aria-current", "page");
  });

  it("does not call onPageChange when clicking the current page", async () => {
    const { user, onPageChange } = renderPagination();

    const pageButton = screen.getByRole("button", { name: "Page 1" });
    await user.click(pageButton);

    expect(onPageChange).not.toHaveBeenCalled();
  });
});
