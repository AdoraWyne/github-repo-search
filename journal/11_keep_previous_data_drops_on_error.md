# `keepPreviousData` drops `data` on error

A React Query gotcha we hit building the error states. We *assumed* a failed page-2
fetch would keep showing page 1; it doesn't. Worth writing down because the wrong
mental model quietly shaped a whole plan (the abandoned "inline error strip").

## The assumption (wrong)

`placeholderData: keepPreviousData` keeps the previous page on screen while the next
page loads — no skeleton flash during pagination. So we reasoned: *if page 2 fails,
page 1 is still cached, so the list stays and the error is "silent".*

`docs/error-handling.md` even had a `data && error` row for it.

## The reality

When page 2's fetch **errors**, `data` becomes **`undefined`** — page 1 is gone. The
failure lands in `ResultList`'s `!data` branch and the **full-screen banner replaces
the list.** There is no `data && error` state to handle: on error there is no `data`.

## Why — it's a *loading-phase* affordance

`keepPreviousData` bridges the gap **only while the new query is pending**. It answers
"what do I show *while loading* the next page?" — not "what do I show if the next page
*fails*?"

Two things line up to drop the data:

1. **A new page is a new query key** (`["repos", { …, page }]`) → a fresh cache entry
   with no successful data of its own.
2. **On error, the placeholder is no longer served** → with no real data *and* no
   placeholder, `data` is `undefined`.

Contrast with the *paused* (offline) case, which **does** keep page 1: pausing leaves
the query `pending` (it never errors), so the placeholder keeps bridging. This is the
two-axis distinction again — `status` (pending/error/success) vs `fetchStatus`
(fetching/paused/idle). Paused ≠ error.

## What actually happens to the previous page

| New page's outcome | `status` | keeps page 1? | `data` |
| --- | --- | --- | --- |
| still loading | pending | ✅ yes | page 1 (placeholder) |
| paused (offline) | pending | ✅ yes | page 1 (placeholder) |
| success | success | replaced | page 2 |
| **error** | error | ❌ **no** | **`undefined`** |

## How it surfaced

The Slice D red test — "page 1 loads → page 2 returns 503 → assert page 1 still
visible + an inline strip" — failed on the *last* assertion. The DOM showed the full
banner ("GitHub is temporarily unavailable") and `facebook/react/1` was gone. That was
the tell: `data` had dropped to `undefined`, so `!data` fired.

## The consequence

To keep the list visible through a failed page fetch, **React Query won't help** — you
must retain the last-good data yourself:

```ts
const query = useQuery(...);
const lastData = useRef(query.data);
if (query.data) lastData.current = query.data; // remember every success
const data = query.data ?? lastData.current;   // survive the error
```

We decided that wasn't worth it for now and **dropped the inline strip**: any error
shows the full banner. (See `TODO.md` Slice D — dropped, and `docs/error-handling.md`.)

## One-line takeaway

> `keepPreviousData` bridges **loading**, not **failure**. A new-key query that
> **errors** leaves `data` `undefined` — the previous page is not retained. If you need
> it to survive an error, hold the last-good value yourself.
