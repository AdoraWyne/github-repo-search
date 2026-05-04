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

describe("useUrlSearchState", () => {
  it("returns defaults when no params are present", () => {
    const { result } = renderHook(() => useUrlSearchState(), {
      wrapper: wrapperWithUrl("/"),
    });

    expect(result.current.q).toBe("");
    expect(result.current.page).toBe(1);
    expect(result.current.per_page).toBe(10);
    expect(result.current.sort).toBe("best-match");
  });

  it("reads the existing params correctly", () => {
    const { result } = renderHook(() => useUrlSearchState(), {
      wrapper: wrapperWithUrl("/?q=react&page=2&per_page=20&sort=stars"),
    });

    expect(result.current.q).toBe("react");
    expect(result.current.page).toBe(2);
    expect(result.current.per_page).toBe(20);
    expect(result.current.sort).toBe("stars");
  });
});

describe("setters", () => {
  it("setQuery updates q in the URL", () => {
    const { result } = renderHook(() => useUrlSearchState(), {
      wrapper: wrapperWithUrl("/"),
    });

    act(() => {
      result.current.setQuery("react");
    });

    expect(result.current.q).toBe("react");
  });

  it("setPage coerces number to string and updates the URL", () => {
    const { result } = renderHook(() => useUrlSearchState(), {
      wrapper: wrapperWithUrl("/"),
    });

    act(() => {
      result.current.setPage(3);
    });

    expect(result.current.page).toBe(3);
  });

  it("setQuery preserves other params (merge, not replace)", () => {
    const { result } = renderHook(() => useUrlSearchState(), {
      wrapper: wrapperWithUrl("/?q=old&sort=stars&per_page=20"),
    });

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
    const { result } = renderHook(() => useUrlSearchState(), {
      wrapper: wrapperWithUrl("/?q=old&page=5"),
    });

    act(() => {
      result.current.setQueryAndResetPage("new");
    });

    expect(result.current.q).toBe("new");
    expect(result.current.page).toBe(1);
  });

  it("preserves unrelated params (sort, per_page)", () => {
    const { result } = renderHook(() => useUrlSearchState(), {
      wrapper: wrapperWithUrl("/?q=old&page=5&sort=stars&per_page=20"),
    });

    act(() => {
      result.current.setQueryAndResetPage("new");
    });

    expect(result.current.q).toBe("new");
    expect(result.current.page).toBe(1);
    expect(result.current.sort).toBe("stars");
    expect(result.current.per_page).toBe(20);
  });
});
