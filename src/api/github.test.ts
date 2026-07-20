import { describe, it, expect } from "vitest";
import { http, HttpResponse } from "msw";
import { server } from "../mocks/node";
import {
  fetchRepoSearch,
  toErrorType,
  type FetchRepoSearchParams,
} from "./github";
import { ApiError } from "../types/github";

// Spin up a one-off handler that captures the outgoing request URL, call
// fetchRepoSearch, and hand back the parsed URL so tests can assert on params.
// read journal/10_capturing_request_url_with_msw.md
const captureRequestUrl = async (
  params: FetchRepoSearchParams,
): Promise<URL> => {
  let capturedUrl = "";

  server.use(
    http.get("https://api.github.com/search/repositories", ({ request }) => {
      capturedUrl = request.url;
      return HttpResponse.json({
        total_count: 0,
        incomplete_results: false,
        items: [],
      });
    }),
  );

  await fetchRepoSearch(params);
  return new URL(capturedUrl);
};

describe("toErrorType", () => {
  it.each([
    [503, "service_down"],
    [422, "invalid_query"],
    [403, "rate_limited"],
    [429, "rate_limited"],
    [500, "unknown"],
  ] as const)("maps %i to %s", (status, expected) => {
    expect(toErrorType(status)).toBe(expected);
  });
});

describe("fetchRepoSearch", () => {
  it("builds the correct URL with q param", async () => {
    let capturedUrl: string | null = null;

    server.use(
      http.get("https://api.github.com/search/repositories", ({ request }) => {
        capturedUrl = request.url;
        return HttpResponse.json({
          total_count: 0,
          incomplete_results: false,
          items: [],
        });
      }),
    );

    await fetchRepoSearch({
      q: "react",
      page: 1,
      per_page: 10,
      sort: "best-match",
    });

    expect(capturedUrl).toContain("q=react");
  });

  it("return error", async () => {
    server.use(
      http.get("https://api.github.com/search/repositories", () => {
        return new HttpResponse(null, { status: 422 });
      }),
    );

    await expect(
      fetchRepoSearch({
        q: "test",
        page: 1,
        per_page: 10,
        sort: "best-match",
      }),
    ).rejects.toBeInstanceOf(ApiError);

    await expect(
      fetchRepoSearch({
        q: "test",
        page: 1,
        per_page: 10,
        sort: "best-match",
      }),
    ).rejects.toMatchObject({ status: 422 });
  });

  it("throws an ApiError typed service_down on a 503 response", async () => {
    server.use(
      http.get("https://api.github.com/search/repositories", () => {
        return new HttpResponse(null, { status: 503 });
      }),
    );

    await expect(
      fetchRepoSearch({
        q: "test",
        page: 1,
        per_page: 10,
        sort: "best-match",
      }),
      // read journal/09_rejects_and_toMatchObject.md to understand this syntax
    ).rejects.toMatchObject({ status: 503, type: "service_down" });
  });

  it("throws an ApiError typed unknown on an unmapped 500 response", async () => {
    server.use(
      http.get("https://api.github.com/search/repositories", () => {
        return new HttpResponse(null, { status: 500 });
      }),
    );

    await expect(
      fetchRepoSearch({
        q: "test",
        page: 1,
        per_page: 10,
        sort: "best-match",
      }),
    ).rejects.toMatchObject({ status: 500, type: "unknown" });
  });

  describe("sort param mapping", () => {
    const base: FetchRepoSearchParams = {
      q: "react",
      page: 1,
      per_page: 10,
      sort: "best-match",
    };

    // Scenario 1: empty / default → best-match is the neutral default, so we send
    // NO sort param at all and let GitHub apply its own best-match ranking.
    it("omits the sort param when sort is best-match (the default)", async () => {
      const url = await captureRequestUrl({ ...base, sort: "best-match" });

      expect(url.searchParams.has("sort")).toBe(false);
    });

    it.each(["stars", "updated"] as const)(
      "sends ?sort=%s for the allowed value %s",
      async (sort) => {
        const url = await captureRequestUrl({ ...base, sort });

        expect(url.searchParams.get("sort")).toBe(sort);
      },
    );

    // Scenario 3: an invalid value (e.g. a hand-edited ?sort=banana) is untrusted
    // input — validate at the boundary and fall back to best-match (omit the param)
    // rather than forwarding a bad value to GitHub.
    it("falls back to best-match (omits sort) for an invalid value", async () => {
      // Double-cast to slip a value past the union and simulate a corrupted URL.
      const invalidSort = "banana" as unknown as FetchRepoSearchParams["sort"];

      const url = await captureRequestUrl({ ...base, sort: invalidSort });

      expect(url.searchParams.has("sort")).toBe(false);
    });
  });

  describe("per_page param forwarding", () => {
    it("reflects per_page in the request URL", async () => {
      const base: FetchRepoSearchParams = {
        q: "react",
        page: 1,
        per_page: 10,
        sort: "best-match",
      };

      const url = await captureRequestUrl({ ...base, per_page: 25 });

      expect(url.searchParams.get("per_page")).toBe("25");
    });
  });
});
