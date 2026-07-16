# MSW handler — mock search behaviour

**Status:** implemented (Issue #7). The mock lives in
[`src/mocks/handlers.ts`](../src/mocks/handlers.ts) and backs both the browser dev server
(`browser.ts`) and the test server (`node.ts`).

This handler intercepts `GET https://api.github.com/search/repositories` and returns
canned data instead of hitting the real GitHub API. Two behaviours surprise people, so
they're documented here as an intentional contract, not a bug.

## 1. The `trigger:empty` magic query → zero results

Searching for the exact string **`trigger:empty`** returns an empty result set:

```ts
if (q === "trigger:empty") {
  return HttpResponse.json<SearchResponse>({
    total_count: 0,
    incomplete_results: false,
    items: [],
  });
}
```

**Use it when** you want to see the empty state — in the browser during manual/dev
verification, or as the input in an integration test.

**Why a magic string instead of a test override?** A test could force an empty response
with `server.use(...)`, but that only works *inside a test*. The magic trigger works
**anywhere the handler runs**, including the real dev server in the browser — so you can
reproduce the empty state by hand without touching code. It's special-cased **before** the
sort/slice logic so it short-circuits the normal path.

## 2. The mock ignores `q` for everything else — you always get the "react" fixtures

The fixture list (`allItems`) is a fixed set of ~70 React-ecosystem repos. **Apart from the
`trigger:empty` special case, the handler does not filter by `q`.** So:

- Search `vue` → you still get the React repos.
- Search `anything at all` → same React repos.

**This is expected. Don't be surprised.** The handler reads `q` only to check for the
`trigger:empty` trigger; it never uses it to filter the fixtures.

**Why leave it un-filtered?**

- **Local testing is the point.** The mock exists to exercise *our* UI — loading states,
  pagination, sort, empty state — not to re-implement GitHub's search relevance. Real
  filtering would add logic we'd have to maintain and test for no product value.
- **Deterministic fixtures.** A fixed result set makes pagination and sort tests
  predictable (page 2 always holds the same items; "sort by stars" always yields the same
  order). Query-dependent results would make those tests fragile.
- **Honest boundary.** The handler still reads `page`, `per_page`, and `sort` from the URL
  and applies them, so the parts of the contract we *do* care about (paging, sorting) are
  faithfully mocked. Only relevance-filtering is stubbed out.

## What the handler *does* honour

| URL param   | Honoured? | Behaviour                                                       |
| ----------- | --------- | -------------------------------------------------------------- |
| `q`         | partial   | Only checked for `trigger:empty`; otherwise ignored            |
| `page`      | yes       | Slices `allItems` into the requested page                      |
| `per_page`  | yes       | Page size for the slice (defaults to 10)                       |
| `sort`      | yes       | `stars` / `updated` re-order a copy; unknown values → fixture order |

`total_count` always reports `allItems.length` (except the `trigger:empty` case), so
pagination controls behave as if the full fixture set were the search result.
