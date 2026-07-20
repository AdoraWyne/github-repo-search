// Claude wrote this test

import { describe, it, expect } from "vitest";
import { renderHook } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { ReactNode } from "react";
import { shouldRetry, useRepoSearch } from "./useRepoSearch";
import { ApiError } from "../types/github";
import { toErrorType } from "../api/github";

// shouldRetry only reads error.status; we set a realistic type via toErrorType so the
// fixture isn't misleading.
const apiError = (status: number): ApiError =>
  new ApiError(`HTTP ${status}`, status, toErrorType(status));

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

describe("shouldRetry", () => {
  it.each([400, 403, 422, 429, 499])("does not retry a %i (4xx)", (status) => {
    expect(shouldRetry(0, apiError(status))).toBe(false);
    expect(shouldRetry(5, apiError(status))).toBe(false);
  });

  // A 5xx / network error is transient — retry up to 3 attempts, then give up.
  it("retries a 5xx until the failure-count cutoff (3)", () => {
    expect(shouldRetry(0, apiError(503))).toBe(true);
    expect(shouldRetry(2, apiError(503))).toBe(true);
    expect(shouldRetry(3, apiError(500))).toBe(false);
  });
});
