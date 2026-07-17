# React Query loading / error states — how `ResultList` branches on them

**Status:** implemented (Issue #7). The branching logic lives in
[`src/components/ResultList.tsx`](../src/components/ResultList.tsx). This doc explains *why*
the branch conditions are shaped the way they are — in particular why `if (!data)` is **not**
a pure "error" branch: it fires when there is nothing to show, which can mean the fetch
**failed** *or* the fetch is **paused/offline**.

## The two axes React Query tracks

The single most useful mental model: React Query describes a query along **two independent
axes**, not one.

| Axis          | Question it answers            | Values                                    |
| ------------- | ------------------------------ | ----------------------------------------- |
| `status`      | **Do we have data?**           | `pending` (none yet) · `success` · `error` |
| `fetchStatus` | **Is a request in flight now?** | `fetching` · `paused` · `idle`             |

The third `fetchStatus` value — **`paused`** — is easy to forget and is the reason the
`!data` branch is not a pure error branch. `paused` means "React Query *wants* to fetch but
can't right now — most commonly because the browser is offline." It is waiting, not failing.

Everything else is derived from these two:

- `isPending`  = `status === 'pending'`  → "no data yet"
- `isError`    = `status === 'error'`
- `isFetching` = `fetchStatus === 'fetching'` → "a request is happening right now"
- **`isLoading` = `isPending && isFetching`** → "no data yet **AND** a request is in flight"
- `isRefetching` = `isFetching && !isPending` → "re-fetching, but we already have/had a resolved status"

The crucial takeaway: **`isLoading === false` does not mean "the fetch finished."** It can
also mean **"the fetch never started running"** — e.g. it is `paused` (offline) or `idle`
(disabled). "Not loading" and "done" are different things, and conflating them is the trap
this whole doc exists to avoid.

## State-by-state truth table

`per_page`/`sort`/`page` changes use `placeholderData: keepPreviousData` (see
[`useRepoSearch`](../src/hooks/useRepoSearch.ts)), which keeps the previous page's `data`
on screen while the next request is in flight. For *why* we use it and its trade-off, see
[keep-previous-data.md](./keep-previous-data.md).

| Situation                                  | `status`  | `fetchStatus` | `isLoading` | `error`     | `data`            |
| ------------------------------------------ | --------- | ------------- | ----------- | ----------- | ----------------- |
| First fetch, in flight                     | `pending` | `fetching`    | **true**    | `null`      | `undefined`       |
| First fetch, **offline (paused)**          | `pending` | `paused`      | **false**   | `null`      | `undefined`       |
| First fetch **failed**, resting            | `error`   | `idle`        | **false**   | present     | `undefined`       |
| Re-requesting after that error             | `error`   | `fetching`    | **false**   | present     | `undefined`       |
| Success                                    | `success` | `idle`        | false       | `null`      | present           |
| Pagination / sort in flight (keepPrevious) | `success` | `fetching`    | false       | `null`      | **previous page** |

Read the three "no data, `isLoading` false" rows carefully — **paused**, **error resting**,
and **error retrying**. All three land on the `if (!data)` branch, but the *paused* row has
`error === null` while the two error rows have `error` set. That single difference is what the
branch checks.

## Why the branch conditions look the way they do

`ResultList` guards run top to bottom:

```ts
if (!q.trim())          return <prompt/>;        // no query yet (hook is disabled)
if (isLoading && !data) return <skeletons/>;     // genuine FIRST load only
if (!data)                                       // no data & not first-loading
  return error
    ? <ErrorBanner/>                             //   → the fetch failed
    : <p>Waiting for a connection…</p>;          //   → paused/offline (no error)
if (data.items.length === 0) return <EmptyState/>;
// …otherwise render the list
```

- **`isLoading && !data` → skeletons.** True *only* on the first fetch that is actually in
  flight. During pagination/sort, `keepPreviousData` means `data` is defined and `isLoading`
  is false, so this branch is skipped and the old cards stay put (no skeleton flash).

- **`if (!data)` → error *or* paused.** To reach this line we already passed
  `isLoading && !data`, so the query is not "first fetch in flight". Combined with `!data`,
  the remaining states from the truth table are:
  1. **error resting / retrying** — `error` is set → render `ErrorBanner`.
  2. **paused (offline)** — `error` is `null` → render a "waiting for a connection" message.

  So `!data` means **"pending-or-errored with nothing to show"**, not "errored". We check
  `error` inside the branch precisely to tell those two apart. Showing an error banner in the
  paused case would be a lie (nothing failed); rendering nothing would leave a blank screen
  with no feedback — hence the explicit waiting message.

- This guard also **narrows the type**: after `if (!data) return …`, TypeScript knows `data`
  is defined for the rest of the component. Note the earlier `isLoading && !data` does *not*
  narrow `data` on its own — negating `A && B` gives `!A || B`, which doesn't prove `data` is
  defined. A standalone `if (!data)` is what does the narrowing.

## What can't reach the `!data` branch

- **No query yet** → caught by `!q.trim()` (the hook is disabled via `enabled`, so it never
  fetches). This is why the `idle` + `pending` "disabled" state can't reach `!data` here — the
  empty-query guard removes it first.
- **First load in flight** → caught by `isLoading && !data` (skeletons).
- **Successful load, even with zero results** → `data` is defined, so `!data` is false.
- **Pagination/sort** → `keepPreviousData` keeps `data` defined.

What *does* survive all those filters: **error** (failed/retrying) and **paused** (offline).
So in one sentence: **the `!data` branch fires when there is genuinely nothing to show — the
fetch either failed (`error` set) or is paused/offline (`error` null) — and the branch checks
`error` to render the right one.**
