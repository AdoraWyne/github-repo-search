import type { ReactNode } from "react";
import { MemoryRouter } from "react-router";
import { render, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { describe, it, expect } from "vitest";
import userEvent from "@testing-library/user-event";
import { http, HttpResponse } from "msw";
import { server } from "../mocks/node";
import SearchPage from "./SearchPage";

const renderPage = () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });

  const wrapper = ({ children }: { children: ReactNode }) => (
    <MemoryRouter initialEntries={["/"]}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </MemoryRouter>
  );

  render(<SearchPage />, { wrapper });
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
});
