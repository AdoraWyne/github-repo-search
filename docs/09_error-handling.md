# How the app handles error & non-happy states

`ResultList` is the single place that decides what to render for every non-happy
state. The checks are **ordered guard clauses** — the first match wins — so read
the table top to bottom.

| # | Condition | Renders | Status |
| --- | --- | --- | --- |
| 1 | empty query | prompt (submit disabled) | ✅ built |
| 2 | `isLoading && !data` | skeleton cards | ✅ built |
| 3 | `!data && error` | `ErrorBanner` (full screen) | ✅ built |
| 4 | `!data && !error` | "Waiting for a connection…" | ✅ built |
| 5 | `data.items.length === 0` | `EmptyState` | ✅ built |
| 6 | `data && !error` | the results list + pagination | ✅ built |

Rule of thumb: states 2–4 require **`!data`**. `keepPreviousData` keeps `data`
defined while a new page is *loading* (pending/paused) — that's why the skeleton
and waiting states only fire on a **first load**, never during a *successful*
pagination.

**But an error is different.** `keepPreviousData` only bridges the loading phase;
when a fetch **errors**, `data` falls to `undefined`. So *any* failure — first load
**or** a later page — lands in state 3 and shows the **full banner**. There is no
"`data && error`" state: on error there is no `data`. (See the "no inline strip"
note below.)

---

## 1. Empty query — no submit allowed

Two layers enforce this:

- The submit button is **disabled** while the input is blank.
- The hook sets `enabled: q.trim().length > 0`, so React Query never fires for an
  empty query. `ResultList` shows a "What do you want to search?" prompt.

## 2. `isLoading && !data` → skeleton

`isLoading` is `isPending && isFetching` — the query has **no cached data** *and*
a request is in flight. This is the **very first load** of a given query key.

Why also `&& !data`? During pagination `keepPreviousData` keeps the previous page
in `data`, so we keep showing it (no skeleton flash). The `!data` guard makes the
skeleton fire **only** when there's genuinely nothing on screen yet.

## 3. `!data && error` → `ErrorBanner` (full screen)

A first-load fetch **failed** and we have nothing to show, so the whole area is
replaced by the banner. The banner picks its message from the semantic
**`error.type`**, never the raw HTTP status. The types we define:

| `error.type` | From status | Message intent | Retry button? |
| --- | --- | --- | --- |
| `service_down` | 503 | temporarily unavailable | yes |
| `invalid_query` | 422 | change your query | no |
| `rate_limited` | 403 / 429 | rate limited, try again shortly | yes ("Try again") |
| `unknown` | anything else | generic "something went wrong" | yes |

> Note: `rate_limited` originally planned a live countdown from `x-ratelimit-reset`.
> We dropped it for now (showing seconds felt like too much) — the banner is a static
> "Try again in a few moments" and the reset parsing was removed. Re-add when the
> countdown returns.

## 4. `!data && !error` → "Waiting for a connection…"

The query is **paused**, not failed. When `onlineManager` reports offline, React
Query won't fire the request: `status: pending`, `fetchStatus: paused`, `data`
undefined, `error` null. On a first load that lands here — a *paused* state, which
is deliberately distinct from an *error*. (This is the second status axis:
`status` says "no data", `fetchStatus` says "paused" — see
`docs/react-query-loading-states.md`.)

## 5. No results → `EmptyState`

The fetch **succeeded** but returned zero items. `EmptyState` names the query so
the user knows what came back empty.

## 6. `data && !error` → the results list

The happy path: render the repo cards, plus pagination when there's more than one
page of results.

## No inline error strip (Slice D — dropped)

We considered keeping the list visible and surfacing a *later* failure (e.g. page 2)
in a non-blocking inline strip. We dropped it: `keepPreviousData` doesn't retain
`data` through an error, so a mid-pagination failure already collapses to state 3
(the full banner replaces the list). Keeping the list would mean holding the
last-good data ourselves (a ref) — not worth it for now. **Decision: any error shows
the full banner.** Revisit if we later want the list to survive a failed page fetch.
