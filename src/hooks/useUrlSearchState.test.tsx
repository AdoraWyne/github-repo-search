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
});
