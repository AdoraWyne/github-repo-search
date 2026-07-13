import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, useLocation } from "react-router";
import type { ReactNode } from "react";
import PageSizeSelect from "./PageSizeSelect";

// Shows the current query string so a test can assert the URL actually changed —
// a native <select> updates its own displayed value on click even if onChange never
// wrote to the URL (a false pass), so we assert on the URL, not the select value.
const LocationDisplay = () => {
  const { search } = useLocation();
  return <div data-testid="location">{search}</div>;
};

const renderAtUrl = (url = "/") =>
  render(
    <>
      <PageSizeSelect />
      <LocationDisplay />
    </>,
    {
      wrapper: ({ children }: { children: ReactNode }) => (
        <MemoryRouter initialEntries={[url]}>{children}</MemoryRouter>
      ),
    },
  );

describe("PageSizeSelect", () => {
  it("renders exactly the three page-size options", () => {
    renderAtUrl();

    expect(screen.getByRole("option", { name: "10" })).toBeInTheDocument();
    expect(screen.getByRole("option", { name: "25" })).toBeInTheDocument();
    expect(screen.getByRole("option", { name: "50" })).toBeInTheDocument();
    expect(screen.getAllByRole("option")).toHaveLength(3);
  });

  it("defaults to 10 when the URL has no per_page param", () => {
    renderAtUrl("/");

    expect(screen.getByRole("combobox", { name: /per.?page/i })).toHaveValue(
      "10",
    );
  });

  it("reflects the per_page value from the URL", () => {
    renderAtUrl("/?per_page=25");

    expect(screen.getByRole("combobox", { name: /per.?page/i })).toHaveValue(
      "25",
    );
  });

  it("updates the URL per_page param when the user picks an option", async () => {
    const user = userEvent.setup();
    renderAtUrl("/");

    await user.selectOptions(
      screen.getByRole("combobox", { name: /per.?page/i }),
      "50",
    );

    expect(screen.getByTestId("location").textContent).toContain("per_page=50");
  });
});
