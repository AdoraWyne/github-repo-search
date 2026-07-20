# Validation at the boundary

A recurring principle we kept hitting while building the sort feature. Worth writing
down because it applies far beyond sort.

## What is a "boundary"?

A **boundary** is any point where data crosses *from something you don't control into
your typed, trusted code*. The outside world — URLs, network responses, user input,
external APIs — can hand you anything. Inside your app, you want to trust your types.

**The rule:** at the crossing, check and normalize the data into a known-good,
correctly-typed value. After that point, inner code can trust it without re-checking.

**How to spot one:** ask *"could this value be something my type says it can't be?"*
If yes, you're at a boundary that needs validation.

## Three parts of the principle

1. **Sanitize once, at the edge** — not scattered defensively through every consumer.
   Fix it where the data enters, and everything downstream is protected for free.
2. **Fail safe** — collapse bad input to a sensible default, rather than trusting it
   *or* crashing. A hand-edited URL should degrade gracefully, not blow up the page.
3. **Never fake it with a cast.** `x as SortOption` *claims* validation happened without
   doing it. The type says "safe," the value isn't. We called this the **cast-lie**.

## The cast-lie, concretely

The bug we found (and fixed) in three places. This line *looks* like a guard:

```ts
const sort = (searchParams.get("sort") as SortOption) ?? "best-match";
```

But `?? "best-match"` only replaces `null` (the *missing* case). An *invalid* value
like `?sort=banana` is not null, so it slips through — and `as SortOption` tells
TypeScript to stop checking. Result: `sort` is `"banana"` at runtime while typed as a
valid `SortOption`. Everything downstream trusts a guarantee that was never true.

The fix is to *replace the lie with a real check* — parse, don't cast:

```ts
const parseSort = (raw: string | null): SortOption =>
  raw === "stars" || raw === "updated" ? raw : "best-match";

const sort = parseSort(searchParams.get("sort")); // genuinely a SortOption now
```

## Where this shows up in the app

| Boundary | Untrusted input | Status | How |
| --- | --- | --- | --- |
| `useUrlSearchState` — `sort` | `?sort=banana` | ✅ validated | `parseSort` → best-match |
| `useUrlSearchState` — `page` | `?page=abc`, `?page=0` | ⚠️ partial | `Number(...) \|\| 1` (misses negatives/huge) |
| `useUrlSearchState` — `per_page` | `?per_page=xyz` | ⚠️ partial | `Number(...) \|\| 10` (misses out-of-range) |
| `useUrlSearchState` — `q` | `?q=<anything>` | ✅ by nature | `?? ""` — any string is a valid query |
| `fetchRepoSearch` — `sort` | app state → request | ✅ validated | `SORTABLE_VALUES` allowlist |
| Mock handler — `sort` | request URL → mock | ✅ validated | `switch` default |
| `SortSelect` — `e.target.value` | change event | ✅ safe cast | options constrained by construction — a legit cast, not a lie |
| `fetchRepoSearch` — **response** | GitHub JSON → app | ❌ unvalidated | `res.json()` is `any`, asserted as `SearchResponse` |

## Known gaps (logged as follow-up issues)

1. **`page` / `per_page` range.** `Number(...) || default` catches missing / zero /
   non-numeric, but not **negative or absurd** values (`?page=-3` → `-3`;
   `?per_page=9999` passes through). Today GitHub rejects these — i.e. we're leaning on
   a downstream layer to defend us, the same asymmetry we disliked with sort. Fix: clamp.

2. **API response shape.** `res.json()` returns `any`, asserted as `SearchResponse`
   without runtime verification. If GitHub's shape drifted, TS would believe our types
   while the real object didn't match — a runtime bug TS can't catch. Fix: parse the
   response through a schema (e.g. Zod) — validation at the *response* boundary.

## The nuance: don't over-validate

Not every boundary needs heavy validation. `q` is complete with just `?? ""` — any
string is a valid search query. Part of the skill is judging **how much** each boundary
needs: enough to make the type honest, no more. Over-validating a plain string is wasted
ceremony.

## One-line takeaway

> At every point external data enters, turn it into a value your types can honestly
> trust — by **checking**, not by **casting**. Fall back safely; don't lean on
> downstream layers to catch what you let through.
