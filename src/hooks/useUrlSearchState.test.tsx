import { describe, it, expect } from "vitest";
import { act, renderHook } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import type { ReactNode } from "react";
import { useUrlSearchState } from "./useUrlSearchState";

const wrapperWithUrl = (url: string) => {
  return ({ children }: { children: ReactNode }) => (
    <MemoryRouter initialEntries={[url]}>{children}</MemoryRouter>
  );
};

// Render the hook at a given URL. Hides the renderHook/wrapper plumbing so each
// test shows only what matters: the starting URL and the assertions. Returns the
// full renderHook result (result, rerender, unmount) — tests destructure what they need.
const renderUrlState = (url = "/") =>
  renderHook(() => useUrlSearchState(), { wrapper: wrapperWithUrl(url) });

describe("useUrlSearchState", () => {
  it("returns defaults when no params are present", () => {
    const { result } = renderUrlState();

    expect(result.current.q).toBe("");
    expect(result.current.page).toBe(1);
    expect(result.current.per_page).toBe(10);
    expect(result.current.sort).toBe("best-match");
  });

  it("reads the existing params correctly", () => {
    const { result } = renderUrlState("/?q=react&page=2&per_page=20&sort=stars");

    expect(result.current.q).toBe("react");
    expect(result.current.page).toBe(2);
    expect(result.current.per_page).toBe(20);
    expect(result.current.sort).toBe("stars");
  });

  // Boundary protection: the URL is untrusted (a user can hand-edit ?sort=banana).
  // An unrecognized sort must collapse to best-match, not leak through as-is —
  // otherwise a controlled <select value={sort}> renders blank.
  it("falls back to best-match when the URL sort is invalid", () => {
    const { result } = renderUrlState("/?sort=banana");

    expect(result.current.sort).toBe("best-match");
  });
});

describe("setters", () => {
  it("setQuery updates q in the URL", () => {
    const { result } = renderUrlState();

    act(() => {
      result.current.setQuery("react");
    });

    expect(result.current.q).toBe("react");
  });

  it("setPage coerces number to string and updates the URL", () => {
    const { result } = renderUrlState();

    act(() => {
      result.current.setPage(3);
    });

    expect(result.current.page).toBe(3);
  });

  it("setQuery preserves other params (merge, not replace)", () => {
    const { result } = renderUrlState("/?q=old&sort=stars&per_page=20");

    act(() => {
      result.current.setQuery("new");
    });

    expect(result.current.q).toBe("new");
    expect(result.current.sort).toBe("stars");
    expect(result.current.per_page).toBe(20);
  });
});

describe("setQueryAndResetPage", () => {
  it("updates q and resets page to 1", () => {
    const { result } = renderUrlState("/?q=old&page=5");

    act(() => {
      result.current.setQueryAndResetPage("new");
    });

    expect(result.current.q).toBe("new");
    expect(result.current.page).toBe(1);
  });

  it("preserves unrelated params (sort, per_page)", () => {
    const { result } = renderUrlState("/?q=old&page=5&sort=stars&per_page=20");

    act(() => {
      result.current.setQueryAndResetPage("new");
    });

    expect(result.current.q).toBe("new");
    expect(result.current.page).toBe(1);
    expect(result.current.sort).toBe("stars");
    expect(result.current.per_page).toBe(20);
  });
});

// See docs/url-state-reset-behaviour.md for the full change matrix.
// Changing a filter that reshapes the result set (sort, per_page) resets page → 1;
// navigating pages leaves every other param untouched.

describe("setSort", () => {
  it("updates sort, resets page to 1, and preserves q and per_page", () => {
    const { result } = renderUrlState("/?q=react&page=5&per_page=20&sort=best-match");

    act(() => {
      result.current.setSort("stars");
    });

    expect(result.current.sort).toBe("stars"); // new
    expect(result.current.page).toBe(1); // reset → 1
    expect(result.current.q).toBe("react"); // keep
    expect(result.current.per_page).toBe(20); // keep
  });
});

describe("setPerPage", () => {
  it("updates per_page, resets page to 1, and preserves q and sort", () => {
    const { result } = renderHook(() => useUrlSearchState(), {
      wrapper: wrapperWithUrl("/?q=react&page=5&per_page=10&sort=stars"),
    });

    act(() => {
      result.current.setPerPage(50);
    });

    expect(result.current.per_page).toBe(50); // new
    expect(result.current.page).toBe(1); // reset → 1
    expect(result.current.q).toBe("react"); // keep
    expect(result.current.sort).toBe("stars"); // keep
  });
});

describe("setPage (navigation, not a filter change)", () => {
  it("updates page and preserves q, per_page, and sort (no reset)", () => {
    const { result } = renderUrlState("/?q=react&page=2&per_page=20&sort=stars");

    act(() => {
      result.current.setPage(4);
    });

    expect(result.current.page).toBe(4); // new
    expect(result.current.q).toBe("react"); // keep
    expect(result.current.per_page).toBe(20); // keep
    expect(result.current.sort).toBe("stars"); // keep
  });
});
