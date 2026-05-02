import { describe, it, expect } from "vitest";
import { http, HttpResponse } from "msw";
import { server } from "../mocks/node";
import { fetchRepoSearch } from "./github";
import { ApiError } from "../types/github";

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
});
