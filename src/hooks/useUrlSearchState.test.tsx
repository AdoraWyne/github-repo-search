import { describe, it, expect } from "vitest";
import { renderHook } from "@testing-library/react";
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
