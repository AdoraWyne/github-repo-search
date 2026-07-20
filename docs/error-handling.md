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
| 6 | `data && error` | keep list + inline error strip | 🚧 Slice D |
| 7 | `data && !error` | the results list + pagination | ✅ built |

Rule of thumb: states 2–4 all require **`!data`** on purpose. With
`keepPreviousData`, once we have *any* results, `data` stays defined — so these
"nothing to show" states only ever fire on a **first load**, never mid-pagination.

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

## 6. `data && error` → keep the list, show an inline strip 🚧 (Slice D — planned)

If earlier results are cached and a *later* fetch fails (e.g. paginating to page 2),
`data` is still defined, so none of the `!data` guards above fire.

- **Current behaviour:** the error is **silent** — we keep showing the stale list
  and give no sign the last fetch failed.
- **Expected behaviour (Slice D):** keep the list visible **and** surface the error
  in a **non-blocking inline strip** (not the full-screen banner, which would wipe
  good data), carrying the same Retry. The strip presents any `error.type`.

## 7. `data && !error` → the results list

The happy path: render the repo cards, plus pagination when there's more than one
page of results.
