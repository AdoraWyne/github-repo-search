# URL state — page-reset behaviour on filter change

**Status:** implemented (Issue #6, Slice 5). The tests in
[`useUrlSearchState.test.tsx`](../src/hooks/useUrlSearchState.test.tsx) enforce this
contract and the hook satisfies it.

The search UI keeps four pieces of state in the URL query string: `q`, `page`,
`per_page`, and `sort`. When the user changes one of them, the others must behave
predictably. This is the contract.

## Change matrix

For each setter, `new` = takes the caller's value, `reset → 1` = forced back to page 1,
`keep` = left exactly as it was in the URL.

| Setter (param changed)     | `q`   | `page`     | `per_page` | `sort` |
| -------------------------- | ----- | ---------- | ---------- | ------ |
| `setQueryAndResetPage(q)`  | new   | reset → 1  | keep       | keep   |
| `setPage(n)`               | keep  | new        | keep       | keep   |
| `setPerPage(n)`            | keep  | reset → 1  | new        | keep   |
| `setSort(s)`               | keep  | reset → 1  | keep       | new    |

## The principle behind it

There are two kinds of change, and they have opposite effects on `page`:

1. **Changing a filter that reshapes the result set** — `q`, `per_page`, `sort` —
   **resets `page` to 1.**
   Why: after the change, "page N" no longer means what it did. A new query returns a
   different result set; a bigger `per_page` re-draws the page boundaries so page 3 now
   points at different items (or stops existing); a new `sort` reorders everything. In
   every case the user's intent is "show me from the top," so staying on page N would
   strand them on a stale or empty page.

2. **Navigating within the current result set** — `page` — **keeps everything else.**
   Changing the page is not a filter change; it's movement through results the current
   filters already defined. `q`, `per_page`, and `sort` must survive untouched, or
   paging would silently wipe the user's search.

## Invariant that always holds

Every setter performs a **partial update**: it changes only its own key(s) and preserves
all other params (via cloning the previous `URLSearchParams`). So "keep" in the table is
never accidental — no setter may clobber a param it doesn't own. The reset-to-1 cases are
the *only* deliberate cross-param side effect.

## Design note — why reset is baked into the setters (option B)

`setPerPage` / `setSort` reset `page` themselves, rather than exposing a separate
`…AndResetPage` variant a caller must remember to choose. Resetting is **intrinsic** to
these changes (there's no valid case for changing page size or sort while staying on
page N), so it belongs in the setter, not opt-in. This also removes a footgun that had
already caused a real bug: `SearchInput` was calling the non-resetting `setPerPage`, so
changing page size left the user stranded on their current page.

> Follow-up: `setQueryAndResetPage` still uses the older raw-setter + explicit-variant
> split. Folding its reset into `setQuery` too would make the convention uniform
> ("changing any filter resets page, baked in"). Deferred cleanup.
