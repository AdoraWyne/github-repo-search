# `keepPreviousData` — why we use it, and its trade-off

**Status:** implemented (Issue #7). Configured in
[`useRepoSearch`](../src/hooks/useRepoSearch.ts) as `placeholderData: keepPreviousData`.
For the underlying flag mechanics (`isLoading = isPending && isFetching`, the error and
offline states), see [react-query-loading-states.md](./react-query-loading-states.md). This doc is about the
**UX decision**: what turning `keepPreviousData` on and off actually does to our app, and the
trade-off we accepted.

## The core mechanic (one paragraph)

React Query caches per **queryKey**. Our key is
`["repos", { q, page, per_page, sort }]`, so changing *any* of those — a new page, a new
sort, a new search term — produces a **different key**, which is a **different, uncached
query**. What the user sees during that switch depends entirely on `keepPreviousData`.

## With vs without — the impact in our app

Concretely, when the user clicks "page 2" (or changes sort / per_page / query):

| | **Without** `keepPreviousData` | **With** `keepPreviousData` (current) |
| --- | --- | --- |
| New queryKey has cached data? | No → treated as a fresh `pending` query | Previous key's data supplied as placeholder |
| `status` during the switch | `pending` | `success` (`isPlaceholderData: true`) |
| `isLoading` during the switch | **true** | **false** |
| What the user sees | Page-1 cards vanish → **6 skeletons flash** → page-2 cards | Page-1 cards **stay on screen** → seamlessly replaced by page-2 |
| Perceived feel | Flickery, "reloading" on every navigation | Calm, "the page updated" |

Without it, every pagination/sort/search re-enters the `isLoading && !data` branch in
[`ResultList`](../src/components/ResultList.tsx) and re-renders skeletons. With it, only the
**genuine first load** (nothing cached, nothing previous) shows skeletons.

## Why we use it → better UX

The issue's acceptance criteria demand exactly this behaviour:

- *"Clicking a different page does NOT show skeletons — previous page stays until the new one arrives."*
- *"Changing sort or page size also keeps previous results visible."*

`keepPreviousData` delivers all of it with a single option, because pagination, sort,
per_page, and query changes **all share one code path** (they're all just queryKey changes).
No manual "remember the last results" state, no per-control special-casing. The previous
result set stays put, the UI doesn't flicker, and the skeleton is reserved for the one moment
it's actually meaningful — the very first search, when there's genuinely nothing to show.

## The trade-off — `keepPreviousData` is blunt

It keeps the previous data for **every** query-key change, including when the user types a
brand-new search term. So changing `react` → `vue` keeps the `react` results on screen (no
skeleton) until `vue` loads.

Is showing stale results for a *different* search good UX? Debatable. Some apps keep-previous
on pagination/sort but show a fresh skeleton on a new query — that needs more nuance than one
option can express (you'd have to distinguish "same search, different page" from "different
search" and branch the placeholder logic accordingly).

For this issue, uniform behaviour matches the acceptance criteria, so we didn't
over-engineer it. Flagging the seam here in case a reviewer asks, or in case a future
"fresh skeleton on new query term" requirement makes it worth splitting the code path.

## Related edge: what happens on error (and offline) differs too

A subtle knock-on effect (full detail in
[react-query-loading-states.md](./react-query-loading-states.md)). The rule is simple: the
`!data` branch only runs when `data` is undefined, and `keepPreviousData` gives later pages a
placeholder — so `data` is defined and the branch is skipped.

- **On the first load, there is no previous page to keep.** So `data` stays undefined and the
  `!data` branch runs — showing the error banner if the fetch failed, or the "Waiting for a
  connection…" message if the user is offline.
- **On a later page, `keepPreviousData` keeps the previous page's results.** So `data` is
  defined, the `!data` branch is skipped, and the user keeps seeing the old page instead of an
  error banner or offline message.

In short: `keepPreviousData` hides **both** the error banner and the offline message whenever
a previous page exists — it changes *which* failures the user sees, not just how loading looks.
