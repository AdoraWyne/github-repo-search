## [useRepoSearch](../src/hooks/useRepoSearch.ts)

Fetches GitHub repository search results via TanStack Query, with caching keyed by the full set of search parameters.

### Usage

```tsx
const { data, isLoading, isError } = useRepoSearch({
  q: "react",
  page: 1,
  per_page: 30,
  sort: "stars",
});
```

### Parameters

Takes a single `UseRepoSearchParams` object:

| Param      | Type                                              | Description                                        |
| ---------- | ------------------------------------------------- | -------------------------------------------------- |
| `q`        | `string`                                          | Search query. Empty/whitespace disables the fetch. |
| `page`     | `number`                                          | Page number (1-based), passed to the GitHub API.   |
| `per_page` | `number`                                          | Results per page.                                  |
| `sort`     | `"best-match" \| "stars" \| "forks" \| "updated"` | Sort order for results.                            |

### Returns

The full `useQuery` result object. The fields callers typically use:

- `data` — a `SearchResponse` (see `src/types/github.ts`) from `fetchRepoSearch`
- `isLoading` — true during the initial fetch
- `isError` / `error` — fetch failure state; on non-2xx responses `error` is an `ApiError` carrying the HTTP status code

### Behavior notes

- **Conditional fetching:** the query only runs when `q` contains non-whitespace characters (`enabled: q.trim().length > 0`). With an empty search box, no request is made and the hook stays in an idle/pending state — this is expected, not a bug.
- **Cache identity:** the query key is `["repos", { q, page, per_page, sort }]`, so every distinct combination of parameters gets its own cache entry. Navigating back to a previously visited page or sort order is served from cache instantly.
- **Stale time (60s):** results are considered fresh for 60 seconds. Repeating the same search within that window returns cached data without hitting the network. This is deliberate — GitHub's search API is heavily rate-limited (10 requests/min unauthenticated), so we trade slightly stale results for fewer 403s.
