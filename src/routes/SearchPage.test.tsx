import type { ReactNode } from "react";
import { MemoryRouter, useLocation } from "react-router";
import { render, screen } from "@testing-library/react";
import {
  onlineManager,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { describe, it, expect } from "vitest";
import userEvent from "@testing-library/user-event";
import { http, HttpResponse, delay } from "msw";
import { server } from "../mocks/node";
import SearchPage from "./SearchPage";

const LocationDisplay = () => {
  const { search } = useLocation();
  return <div data-testid="location">{search}</div>;
};

// `initialEntry` lets a test start the app already at a given URL — e.g. "on page 3"
// — instead of clicking through pagination to get there.
const renderPage = (initialEntry = "/") => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retryDelay: 0 } },
  });

  const wrapper = ({ children }: { children: ReactNode }) => (
    <MemoryRouter initialEntries={[initialEntry]}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </MemoryRouter>
  );

  render(
    <>
      <SearchPage />
      <LocationDisplay />
    </>,
    { wrapper },
  );
};

describe("SearchPage", () => {
  it("disables the submit button when input is empty", () => {
    renderPage();
    expect(screen.getByRole("button", { name: /submit/i })).toBeDisabled();
  });

  it("does nothing when submitting empty input", async () => {
    const user = userEvent.setup();
    renderPage();

    await user.click(screen.getByRole("button", { name: /submit/i }));

    expect(screen.getByText(/what do you want to search/i)).toBeInTheDocument();
  });

  it("shows results from the API after submitting a query", async () => {
    server.use(
      http.get("https://api.github.com/search/repositories", () =>
        HttpResponse.json({
          total_count: 1,
          incomplete_results: false,
          items: [
            {
              id: 1,
              full_name: "facebook/react",
              description: "The library for web and native user interfaces.",
            },
          ],
        }),
      ),
    );

    const user = userEvent.setup();
    renderPage();

    await user.type(screen.getByRole("textbox"), "react");
    await user.click(screen.getByRole("button", { name: /submit/i }));

    expect(await screen.findByText("facebook/react")).toBeInTheDocument();
    expect(
      screen.getByText(/the library for web and native user interfaces/i),
    ).toBeInTheDocument();
  });

  it("failed: shows an error state and recovers when Retry is clicked", async () => {
    // A counter-backed handler: the first fetch fails, the retry succeeds. One flow
    // exercises both the `!data` error branch (fetchRepoSearch throws on !res.ok, so
    // data stays undefined) and the refetch() the Retry button triggers.
    // The harness sets `retry: false`, so the error surfaces immediately — no backoff.
    let calls = 0;
    server.use(
      http.get("https://api.github.com/search/repositories", () => {
        calls += 1;
        if (calls === 1) {
          return new HttpResponse(null, { status: 500 });
        }
        return HttpResponse.json({
          total_count: 1,
          incomplete_results: false,
          items: [
            {
              id: 1,
              full_name: "facebook/react",
              description: "The library for web and native user interfaces.",
            },
          ],
        });
      }),
    );

    const user = userEvent.setup();
    renderPage();

    await user.type(screen.getByRole("textbox"), "react");
    await user.click(screen.getByRole("button", { name: /submit/i }));

    // First fetch failed → the error region (role="alert") with the message + Retry.
    expect(await screen.findByRole("alert")).toHaveTextContent(
      /something went wrong/i,
    );

    // Clicking Retry re-runs the query; the second response succeeds.
    await user.click(screen.getByRole("button", { name: /retry/i }));

    expect(await screen.findByText("facebook/react")).toBeInTheDocument();
  });

  it("shows the service-unavailable banner with Retry when the API returns 503", async () => {
    const user = userEvent.setup();
    renderPage();

    await user.type(screen.getByRole("textbox"), "trigger:503");
    await user.click(screen.getByRole("button", { name: /submit/i }));

    expect(await screen.findByRole("alert")).toHaveTextContent(
      /github is temporarily unavailable/i,
    );
    expect(screen.getByRole("button", { name: /retry/i })).toBeInTheDocument();
  });

  it("shows the invalid-query message (and no Retry) when the API returns 422", async () => {
    // Uses the default `trigger:422` handler baked into handlers.ts. A 422 maps to
    // error.type === "invalid_query". Unlike service_down, this arm renders NO Retry
    // button: retrying the same rejected query would just 422 again — the user has to
    // change the query. retry: false (from renderPage) makes the banner synchronous.
    const user = userEvent.setup();
    renderPage();

    await user.type(screen.getByRole("textbox"), "trigger:422");
    await user.click(screen.getByRole("button", { name: /submit/i }));

    // The invalid_query arm of ErrorBanner.
    expect(await screen.findByRole("alert")).toHaveTextContent(
      /that search couldn't be processed/i,
    );
    // The defining difference from the other error arms: no Retry offered.
    expect(screen.queryByRole("button", { name: /retry/i })).toBeNull();
  });

  it("shows the waiting-for-connection message on a first load while offline", async () => {
    // React Query's onlineManager is a global singleton that tracks whether RQ
    // believes the app is online. Setting it offline makes the query PAUSE instead
    // of firing: status stays `pending`, fetchStatus is `paused`, data is undefined,
    // and error is null. That lands on ResultList's `!data` branch with no error,
    // which renders the "Waiting for a connection…" message (not an error banner).
    onlineManager.setOnline(false);

    const user = userEvent.setup();
    renderPage();

    await user.type(screen.getByRole("textbox"), "react");
    await user.click(screen.getByRole("button", { name: /submit/i }));

    // The no-error arm of the `!data` branch — the paused/offline message.
    expect(
      await screen.findByText(/waiting for a connection/i),
    ).toBeInTheDocument();
    // And crucially it is NOT the error banner.
    expect(screen.queryByRole("alert")).toBeNull();
    // Reset back to online is handled globally in src/test/setup.ts.
  });

  it("keeps the previous page (no offline message) when a later page is fetched offline", async () => {
    // Contrast with the test above: same paused/offline state, but here page 1 has
    // already loaded. keepPreviousData holds page 1 as placeholder, so `data` stays
    // defined and ResultList NEVER reaches the `!data` branch — no offline message,
    // no error banner. The user just keeps seeing page 1.
    server.use(
      http.get("https://api.github.com/search/repositories", ({ request }) => {
        const page = new URL(request.url).searchParams.get("page");
        if (page === "2") {
          return HttpResponse.json({
            total_count: 11,
            incomplete_results: false,
            items: [
              { id: 11, full_name: "facebook/react/11", description: "page 2" },
            ],
          });
        }
        return HttpResponse.json({
          total_count: 11, // > per_page (10) so a Page 2 button renders
          incomplete_results: false,
          items: Array.from({ length: 10 }, (_, i) => ({
            id: i + 1,
            full_name: `facebook/react/${i + 1}`,
            description: `lorem ipsum ${i + 1}.`,
          })),
        });
      }),
    );

    const user = userEvent.setup();
    renderPage();

    await user.type(screen.getByRole("textbox"), "react");
    await user.click(screen.getByRole("button", { name: /submit/i }));

    // Page 1 loads while online.
    expect(await screen.findByText("facebook/react/1")).toBeInTheDocument();

    // Go offline, THEN navigate to page 2 → the page-2 fetch pauses.
    onlineManager.setOnline(false);
    await user.click(await screen.findByRole("button", { name: "Page 2" }));

    // Page 1 stays put (kept data), and the `!data` branch is skipped:
    expect(screen.getByText("facebook/react/1")).toBeInTheDocument();
    expect(screen.queryByText(/waiting for a connection/i)).toBeNull();
    expect(screen.queryByRole("alert")).toBeNull();
    // Reset back to online is handled globally in src/test/setup.ts.
  });

  it("shows the empty state (naming the query) when the search returns no results", async () => {
    const user = userEvent.setup();
    renderPage();

    await user.type(screen.getByRole("textbox"), "trigger:empty");
    await user.click(screen.getByRole("button", { name: /submit/i }));

    expect(
      await screen.findByText(/no repositories matched/i),
    ).toBeInTheDocument();

    expect(screen.getByText(/trigger:empty/)).toBeInTheDocument();
  });

  it("fetches and displays page 2 results when clicking the Page 2 button", async () => {
    server.use(
      http.get("https://api.github.com/search/repositories", ({ request }) => {
        const page = new URL(request.url).searchParams.get("page");
        if (page === "2") {
          return HttpResponse.json({
            total_count: 11,
            incomplete_results: false,
            items: [
              {
                id: 11,
                full_name: "facebook/react/11",
                description: "lorem ipsum 11.",
              },
            ],
          });
        }

        return HttpResponse.json({
          total_count: 11,
          incomplete_results: false,
          items: [
            {
              id: 1,
              full_name: "facebook/react/1",
              description: "lorem ipsum 1.",
            },
            {
              id: 2,
              full_name: "facebook/react/2",
              description: "lorem ipsum 2.",
            },
            {
              id: 3,
              full_name: "facebook/react/3",
              description: "lorem ipsum 3.",
            },
            {
              id: 4,
              full_name: "facebook/react/4",
              description: "lorem ipsum 4.",
            },
            {
              id: 5,
              full_name: "facebook/react/5",
              description: "lorem ipsum 5.",
            },
            {
              id: 6,
              full_name: "facebook/react/6",
              description: "lorem ipsum 6.",
            },
            {
              id: 7,
              full_name: "facebook/react/7",
              description: "lorem ipsum 7.",
            },
            {
              id: 8,
              full_name: "facebook/react/8",
              description: "lorem ipsum 8.",
            },
            {
              id: 9,
              full_name: "facebook/react/9",
              description: "lorem ipsum 9.",
            },
            {
              id: 10,
              full_name: "facebook/react/10",
              description: "lorem ipsum 10.",
            },
          ],
        });
      }),
    );

    const user = userEvent.setup();
    renderPage();

    await user.type(screen.getByRole("textbox"), "react");
    await user.click(screen.getByRole("button", { name: /submit/i }));

    const item = await screen.findByText("facebook/react/1");
    expect(item).toBeInTheDocument();

    const pageButton = await screen.findByRole("button", { name: "Page 2" });
    await user.click(pageButton);

    const item2 = await screen.findByText("facebook/react/11");
    expect(item2).toBeInTheDocument();
  });

  it("keeps the previous page visible with no skeleton while page 2 loads", async () => {
    // delay(100) on the page-2 branch opens a deterministic in-between window:
    // after the click, page 2 is in flight while keepPreviousData holds page 1.
    server.use(
      http.get(
        "https://api.github.com/search/repositories",
        async ({ request }) => {
          const page = new URL(request.url).searchParams.get("page");
          if (page === "2") {
            await delay(100);
            return HttpResponse.json({
              total_count: 11,
              incomplete_results: false,
              items: [
                {
                  id: 11,
                  full_name: "facebook/react/11",
                  description: "lorem ipsum 11.",
                },
              ],
            });
          }

          return HttpResponse.json({
            total_count: 11,
            incomplete_results: false,
            items: Array.from({ length: 10 }, (_, i) => ({
              id: i + 1,
              full_name: `facebook/react/${i + 1}`,
              description: `lorem ipsum ${i + 1}.`,
            })),
          });
        },
      ),
    );

    const user = userEvent.setup();
    renderPage();

    await user.type(screen.getByRole("textbox"), "react");
    await user.click(screen.getByRole("button", { name: /submit/i }));

    expect(await screen.findByText("facebook/react/1")).toBeInTheDocument();

    // Navigate to page 2 — the response is delayed, so we're now mid-transition.
    await user.click(await screen.findByRole("button", { name: "Page 2" }));

    // Previous page stays on screen ...
    expect(screen.getByText("facebook/react/1")).toBeInTheDocument();
    // ... and crucially there is NO skeleton region during pagination.
    expect(screen.queryByRole("status")).toBeNull();

    // Once the delayed page-2 response resolves, the transition completes.
    expect(await screen.findByText("facebook/react/11")).toBeInTheDocument();
  });

  it("resets page to 1 (and refetches) when the sort is changed while on page 3", async () => {
    // The handler reflects the requested page + sort into the result name, so the
    // rendered item proves which page/sort the app actually fetched.
    server.use(
      http.get("https://api.github.com/search/repositories", ({ request }) => {
        const url = new URL(request.url);
        const page = url.searchParams.get("page") ?? "1";
        const sort = url.searchParams.get("sort") ?? "best-match";
        return HttpResponse.json({
          total_count: 30, // 3 pages at 10/page — page 3 is a valid starting point
          incomplete_results: false,
          items: [
            {
              id: 1,
              full_name: `result-page-${page}-sort-${sort}`,
              description: "lorem ipsum",
            },
          ],
        });
      }),
    );

    const user = userEvent.setup();
    renderPage("/?q=react&page=3");

    // start on page 3 (no sort param → best-match, so no `sort` is sent)
    expect(
      await screen.findByText("result-page-3-sort-best-match"),
    ).toBeInTheDocument();

    // user changes the sort dropdown
    await user.selectOptions(
      screen.getByRole("combobox", { name: /sort/i }),
      "stars",
    );

    // the URL reset page to 1 and applied the new sort
    const location = screen.getByTestId("location");
    expect(location.textContent).toContain("sort=stars");
    expect(location.textContent).toContain("page=1");

    // and the app refetched page 1 with the new sort (not still page 3)
    expect(
      await screen.findByText("result-page-1-sort-stars"),
    ).toBeInTheDocument();
  });

  it("resets page to 1 (and refetches) when the page size is changed while on page 3", async () => {
    // The handler reflects the requested page + per_page into the result name.
    server.use(
      http.get("https://api.github.com/search/repositories", ({ request }) => {
        const url = new URL(request.url);
        const page = url.searchParams.get("page") ?? "1";
        const perPage = url.searchParams.get("per_page") ?? "10";
        return HttpResponse.json({
          total_count: 30,
          incomplete_results: false,
          items: [
            {
              id: 1,
              full_name: `result-page-${page}-perpage-${perPage}`,
              description: "lorem ipsum",
            },
          ],
        });
      }),
    );

    const user = userEvent.setup();
    renderPage("/?q=react&page=3");

    // start on page 3 at the default page size (10)
    expect(
      await screen.findByText("result-page-3-perpage-10"),
    ).toBeInTheDocument();

    // user changes the page-size dropdown
    await user.selectOptions(
      screen.getByRole("combobox", { name: /per.?page/i }),
      "50",
    );

    // The URL reset page to 1 and applied the new page size. Parse the query string
    // (rather than substring-match) so "page=1" can't accidentally match inside
    // "per_page=10" — a trap `toContain("page=1")` would fall into here.
    const params = new URLSearchParams(
      screen.getByTestId("location").textContent ?? "",
    );
    expect(params.get("page")).toBe("1");
    expect(params.get("per_page")).toBe("50");

    // and the app refetched page 1 at the new page size
    expect(
      await screen.findByText("result-page-1-perpage-50"),
    ).toBeInTheDocument();
  });
});
