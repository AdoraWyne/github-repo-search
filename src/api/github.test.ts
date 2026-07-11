import { describe, it, expect } from "vitest";
import { http, HttpResponse } from "msw";
import { server } from "../mocks/node";
import { fetchRepoSearch } from "./github";
import { ApiError } from "../types/github";

type FetchParams = Parameters<typeof fetchRepoSearch>[0];

// Spin up a one-off handler that captures the outgoing request URL, call
// fetchRepoSearch, and hand back the parsed URL so tests can assert on params.
const captureRequestUrl = async (params: FetchParams): Promise<URL> => {
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

  describe("sort param mapping", () => {
    const base: FetchParams = {
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

    // Scenario 2: an allowed value is forwarded verbatim as ?sort=<value>.
    it("sends ?sort=stars for an allowed value", async () => {
      const url = await captureRequestUrl({ ...base, sort: "stars" });

      expect(url.searchParams.get("sort")).toBe("stars");
    });

    // Scenario 3: an invalid value (e.g. a hand-edited ?sort=banana) is untrusted
    // input — validate at the boundary and fall back to best-match (omit the param)
    // rather than forwarding a bad value to GitHub.
    it("falls back to best-match (omits sort) for an invalid value", async () => {
      // Double-cast to slip a value past the union and simulate a corrupted URL.
      const invalidSort = "banana" as unknown as FetchParams["sort"];

      const url = await captureRequestUrl({ ...base, sort: invalidSort });

      expect(url.searchParams.has("sort")).toBe(false);
    });
  });
});
