## [useUrlSearchState](../src/hooks/useUrlSearchState.ts)

Reads and writes the search UI state (query, page, per-page, sort) to the URL's query string. The URL is the single source of truth, so searches are shareable, bookmarkable, and survive a page refresh or back/forward navigation.

### Usage

```tsx
const { q, page, per_page, sort, setQueryAndResetPage, setPage, setSort } =
  useUrlSearchState();

// wire the current values straight into useRepoSearch
const { data } = useRepoSearch({ q, page, per_page, sort });
```

Takes no arguments.

### Returns

An object with the current state values (parsed from the URL) and setters that write back to it.

**State values**

| Field      | Type         | Default from URL | Notes                                             |
| ---------- | ------------ | ---------------- | ------------------------------------------------- |
| `q`        | `string`     | `""`             | Missing `?q` becomes an empty string.             |
| `page`     | `number`     | `1`              | Missing/`0`/non-numeric falls back to `1`.        |
| `per_page` | `number`     | `10`             | Missing/`0`/non-numeric falls back to `10`.       |
| `sort`     | `SortOption` | `"best-match"`   | `"best-match" \| "stars" \| "forks" \| "updated"` |

**Setters**

| Setter                 | Signature                 | Effect                                               |
| ---------------------- | ------------------------- | ---------------------------------------------------- |
| `setQuery`             | `(v: string) => void`     | Sets `q`.                                            |
| `setPage`              | `(v: number) => void`     | Sets `page`.                                         |
| `setPerPage`           | `(v: number) => void`     | Sets `per_page`.                                     |
| `setSort`              | `(v: SortOption) => void` | Sets `sort`.                                         |
| `setQueryAndResetPage` | `(v: string) => void`     | Sets `q` **and** resets `page` to `1` in one update. |

### Behavior notes

- **URL is the source of truth:** state is derived from `useSearchParams` (react-router) on every render, not held in local `useState`. Any change flows through the URL, which is what makes searches shareable and back/forward-navigable.
- **Partial updates preserve other params:** every setter goes through `updateParams`, which clones the previous params (`new URLSearchParams(prev)`) before setting its keys. Calling `setPage` won't wipe out `q` or `sort`.
- **Query changes reset pagination:** use `setQueryAndResetPage` (not `setQuery`) when the user types a new search. It moves back to page 1 in the same update, avoiding the "stranded on page 5 of a 2-page result set" problem. Both values change together, so the URL only updates once.
- **Numeric fallback quirk:** `page` and `per_page` use `Number(...) || fallback`. Because `Number("")` is `0` and `0` is falsy, missing, zero, or non-numeric values all collapse to the default. Note a negative like `?page=-3` is truthy and passes through unchanged — it isn't clamped here.

# How does this work?

🚨 The URL is the source of truth!

When component is re-rendered, `useUrlSearchState()` will be called.

To grab from the URL:

```ts
const q = searchParams.get("q") ?? "";
const page = Number(searchParams.get("page")) || 1;
const per_page = Number(searchParams.get("per_page")) || 10;
const sort = (searchParams.get("sort") as SortOption) ?? "best-match";
```

This part:

- will grab the filter param from the URL.
- If there is no filter params, it has the default value for each category.

To update the URL:

```ts
// update param
const updateParams = (updates: Record<string, string>) => {
  setSearchParams((prev) => {
    const next = new URLSearchParams(prev);
    for (const [key, value] of Object.entries(updates)) {
      next.set(key, value);
    }
    return next;
  });
};

const setQuery = (v: string) => updateParams({ q: v });
const setPage = (v: number) => updateParams({ page: String(v) });
const setPerPage = (v: number) => updateParams({ per_page: String(v) });
const setSort = (v: SortOption) => updateParams({ sort: v });
const setQueryAndResetPage = (v: string) => updateParams({ q: v, page: "1" });
```

- These setter functions will be passed to the components where user can update their filter options.

---

# The Flow

The flow is:

- A setter runs → `setSearchParams` changes the URL.
- Changing the URL causes react-router to re-render your component.
- On that re-render, `useUrlSearchState()` runs again and re-reads `searchParams.get(...)` — so q, page, etc. now reflect the new URL.
