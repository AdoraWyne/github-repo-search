import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, useLocation } from "react-router";
import type { ReactNode } from "react";
import SortSelect from "./SortSelect";

// Shows the current query string so a test can assert the URL actually changed —
// otherwise a native <select> updates its own displayed value on click even if the
// onChange handler never wrote to the URL (a false pass).
const LocationDisplay = () => {
  const { search } = useLocation();
  return <div data-testid="location">{search}</div>;
};

const renderAtUrl = (url = "/") =>
  render(
    <>
      <SortSelect />
      <LocationDisplay />
    </>,
    {
      wrapper: ({ children }: { children: ReactNode }) => (
        <MemoryRouter initialEntries={[url]}>{children}</MemoryRouter>
      ),
    },
  );

describe("SortSelect", () => {
  it("renders exactly the three sort options", () => {
    renderAtUrl();

    expect(
      screen.getByRole("option", { name: "Best match" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("option", { name: "Most stars" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("option", { name: "Recently updated" }),
    ).toBeInTheDocument();
    // exactly three — guards against a stray "forks" (or any extra) option
    expect(screen.getAllByRole("option")).toHaveLength(3);
  });

  it("defaults to best-match when the URL has no sort param", () => {
    renderAtUrl("/");

    expect(screen.getByRole("combobox", { name: /sort/i })).toHaveValue(
      "best-match",
    );
  });

  it("reflects the sort value from the URL", () => {
    renderAtUrl("/?sort=stars");

    expect(screen.getByRole("combobox", { name: /sort/i })).toHaveValue(
      "stars",
    );
  });

  it("updates the URL sort param when the user picks an option", async () => {
    const user = userEvent.setup();
    renderAtUrl("/");

    await user.selectOptions(
      screen.getByRole("combobox", { name: /sort/i }),
      "updated",
    );

    expect(screen.getByTestId("location").textContent).toContain(
      "sort=updated",
    );
  });
});
