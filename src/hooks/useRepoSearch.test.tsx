// Claude wrote this test

import { describe, it, expect } from "vitest";
import { renderHook } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { ReactNode } from "react";
import { useRepoSearch } from "./useRepoSearch";

const renderWithClient = <T,>(callback: () => T) => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  const wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
  const result = renderHook(callback, { wrapper });
  return { queryClient, ...result };
};

describe("useRepoSearch", () => {
  it("uses the correct queryKey shape", () => {
    const params = {
      q: "react",
      page: 1,
      per_page: 10,
      sort: "best-match" as const,
    };

    const { queryClient } = renderWithClient(() => useRepoSearch(params));

    const query = queryClient.getQueryCache().getAll()[0];
    expect(query.queryKey).toEqual(["repos", params]);
  });

  it.each([
    { q: "", label: "empty string" },
    { q: "   ", label: "whitespace only" },
  ])("does not fetch when q is $label", ({ q }) => {
    const { queryClient } = renderWithClient(() =>
      useRepoSearch({ q, page: 1, per_page: 10, sort: "best-match" }),
    );

    const query = queryClient.getQueryCache().getAll()[0];
    expect(query.state.fetchStatus).toBe("idle");
  });
});
