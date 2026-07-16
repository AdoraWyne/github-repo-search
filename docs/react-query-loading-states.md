# React Query loading / error states — how `ResultList` branches on them

**Status:** implemented (Issue #7). The branching logic lives in
[`src/components/ResultList.tsx`](../src/components/ResultList.tsx). This doc explains *why*
the branch conditions are shaped the way they are — in particular why `if (!data)` (with no
`isLoading`) is the **error** catch-all.

## The two axes React Query tracks

The single most useful mental model: React Query describes a query along **two independent
axes**, not one.

| Axis          | Question it answers            | Values                                   |
| ------------- | ------------------------------ | ---------------------------------------- |
| `status`      | **Do we have data?**           | `pending` (none yet) · `success` · `error` |
| `fetchStatus` | **Is a request in flight now?** | `fetching` · `idle`                       |

Everything else is derived from these two:

- `isPending`  = `status === 'pending'`  → "no data yet"
- `isError`    = `status === 'error'`
- `isFetching` = `fetchStatus === 'fetching'` → "a request is happening right now"
- **`isLoading` = `isPending && isFetching`** → "no data yet **AND** a request is in flight"
- `isRefetching` = `isFetching && !isPending` → "re-fetching, but we already have/had a resolved status"

The crucial takeaway: **`isLoading` is not "we have no data."** It is specifically *"the very
first fetch is in flight."* Once a query resolves once — success **or** error — `isPending`
is gone (until the query key changes), so every later fetch is a *refetch* where `isFetching`
goes true but `isLoading` stays **false**.

## State-by-state truth table

`per_page`/`sort`/`page` changes use `placeholderData: keepPreviousData` (see
[`useRepoSearch`](../src/hooks/useRepoSearch.ts)), which keeps the previous page's `data`
on screen while the next request is in flight. For *why* we use it and its trade-off, see
[keep-previous-data.md](./keep-previous-data.md).

| Situation                                  | `status`  | `fetchStatus` | `isLoading` | `data`      |
| ------------------------------------------ | --------- | ------------- | ----------- | ----------- |
| First fetch, in flight                     | `pending` | `fetching`    | **true**    | `undefined` |
| First fetch **failed**, resting            | `error`   | `idle`        | **false**   | `undefined` |
| Re-requesting after that error             | `error`   | `fetching`    | **false**   | `undefined` |
| Success                                    | `success` | `idle`        | false       | present     |
| Pagination / sort in flight (keepPrevious) | `success` | `fetching`    | false       | **previous page** |

Read the two "no data, `isLoading` false" rows carefully — that combination is the whole
reason the error branch exists.

## Why the branch conditions look the way they do

`ResultList` guards run top to bottom:

```ts
if (!q.trim())          return <prompt/>;      // no query yet (hook is disabled)
if (isLoading && !data) return <skeletons/>;   // genuine FIRST load only
if (!data)              return <error + retry/>; // no data & not first-loading → errored
if (data.items.length === 0) return <EmptyState/>;
// …otherwise render the list
```

- **`isLoading && !data` → skeletons.** True *only* on the first fetch. During pagination/sort,
  `keepPreviousData` means `data` is defined and `isLoading` is false, so this branch is
  skipped and the old cards stay put (no skeleton flash).

- **`if (!data)` → error.** To reach this line we already passed `isLoading && !data`, so
  `isLoading` must be false. Combined with `!data` being true, the only possible state is
  **`data === undefined` AND `isLoading === false`** — i.e. a fetch that finished (or is
  retrying) without ever producing data. That is the error resting/retry state from the table
  above. Hence: **`if (!data)` is the fetch-error catch-all**, not a generic "still loading".

- This guard also **narrows the type**: after `if (!data) return …`, TypeScript knows `data`
  is defined for the rest of the component. Note the earlier `isLoading && !data` does *not*
  narrow `data` on its own — negating `A && B` gives `!A || B`, which doesn't prove `data` is
  defined. A standalone `if (!data)` is what does the narrowing.

## What can't reach the error branch

- No query yet → caught by `!q.trim()` (the hook is disabled, so it never fetches).
- First load in flight → caught by `isLoading && !data` (skeletons).
- Successful load, even with zero results → `data` is defined, so `!data` is false.
- Pagination/sort → `keepPreviousData` keeps `data` defined.

So in one sentence: **the error branch fires only when a request finished (or is retrying)
without any data — practically, a failed fetch.**
