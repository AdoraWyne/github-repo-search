# Pagination: why the current-page button isn't `disabled`

**Decision:** the numbered button for the page you're already on is **not**
`disabled`. Instead it stays enabled and its click handler no-ops:

```jsx
onClick={() => { if (page !== currentPage) onPageChange(page); }}
```

Prev/Next are a different story — they _keep_ `disabled` at the boundaries
(page 1 / last page), because there genuinely is no previous/next page there.
This doc is only about the **numbered current-page** button.

---

## The problem: `disabled` drops focus and hides "you are here"

We originally rendered the current page in Pagination component as:

```ts
  <button
    key={page}
    onClick={() =>  onPageChange(page)}
    disabled={page === currentPage}
    // some codes...
  >
    {page}
  </button>
```

That looks harmless, but it breaks two things.

### 1. Focus falls off the button

When you click page 3, that button becomes `disabled`. A disabled element
**cannot hold focus**, so the browser yanks focus off it and drops it onto
`<body>` — the top of the document. A keyboard or screen-reader user who was
mid-pagination is suddenly stranded at the top with no signal that anything
happened.

### 2. The screen reader skips the one button that says "you are here"

A `disabled` button is **removed from the Tab order** and announced as
"dimmed / unavailable." So a screen-reader user tabbing through the pagination
**skips right over the current page** — the very button that anchors "where am
I?" — and loses their orientation.

And it's redundant: `aria-current="page"` _already_ tells assistive tech "this
is the current page." `disabled` adds no information on top of that — it only
subtracts focusability.

The WAI-ARIA pagination pattern keeps the current page **focusable** and marks
it with `aria-current`, precisely **not** `disabled`. So removing `disabled`
isn't a hack to dodge the focus bug — it's the more correct pattern, and it
fixes the focus drop as a bonus.

---

## Why was it `disabled` in the first place?

The original intent was reasonable: **don't let the user fire a duplicate
request** by clicking the page they're already on.

But React Query already solves that. Clicking the current page produces the
**same query key**, so within `staleTime` the result is served straight from
cache — no network call. The guard `disabled` was protecting against a problem
the data layer had already handled. So we can safely drop it.

---

## The one catch: `setPage` pushes a history entry

Removing `disabled` means a click on the current page now actually _runs_. And
`setPage` → `setSearchParams` → react-router `navigate`, which **pushes a new
history entry by default — even when the page value is unchanged.**

So an enabled current-page button with no guard means clicking "page 2" while
on page 2 stacks duplicate `?page=2` entries into browser history, and the Back
button starts to look broken. That's why we add the `if (page !== currentPage)`
guard: no navigate call → no new history entry.

### This is a _history stack_ problem, not a URL problem

A natural first worry: does clicking page 2 again make the URL
`?q=react&page=2&page=2`? **No.** Look at `updateParams`:

```js
const next = new URLSearchParams(prev);
next.set("page", value); // .set() REPLACES the key, never appends
```

`.set()` overwrites, so `page` is always a single value. The URL stays exactly:

```
http://localhost:5173/?q=react&page=2
```

You'd only get `page=2&page=2` if the code used `.append()`. It doesn't. So a
malformed URL is not the concern.

The duplicate lives in the **browser history stack** — the list of entries
behind the Back/Forward buttons. Every `navigate` push adds an entry, even if
its URL is identical to the one already on top. Clicking "page 2" while on
page 2 three times gives you:

```
History stack (top = where you are now):
  ┌─────────────────────────┐
  │ ?q=react&page=2   ← now │
  │ ?q=react&page=2         │   ← duplicate
  │ ?q=react&page=2         │   ← duplicate
  │ ?q=react&page=1         │   ← the real previous page
  └─────────────────────────┘
```

Same URL string on four entries; four separate slots in the stack.

### Why that's annoying

The user hits **Back** expecting to return to page 1. Instead:

- Click 1 → `page=2` (URL doesn't visibly change — looks like nothing happened)
- Click 2 → `page=2` (still nothing)
- Click 3 → `page=2` (still nothing)
- Click 4 → _finally_ `page=1`

The Back button appears broken for three presses. That's the cost of an enabled
button that re-navigates to the same URL — and exactly what the
`if (page !== currentPage)` guard prevents.

---

## How to see the history stack yourself

You can't read the _contents_ of the stack (the browser hides other entries'
URLs for privacy), but you can watch its **size**:

- `window.history.length` — number of entries in this tab's session history.
  Goes up on a push. (Rough gauge — browsers cap it ~50 and it counts forward
  entries too.)
- `window.history.state?.idx` — react-router stamps an index on each entry.
  Increments on a **push**, stays flat on a **replace**. Cleaner signal.

Experiment: log `history.length` and `history.state?.idx`, click the button for
the page you're already on, log again.

- **Enabled, no guard** → both climb by 1 each click (push → duplicate entry).
- **With the guard** → both stay flat (no navigate → no entry).

No-code version: click-and-hold the browser Back button to see the actual list
of entries — after a few repeat clicks you'll see several rows with the same URL
stacked up.

---

## Summary

|                   | Numbered current page                                 | Prev / Next at boundary       |
| ----------------- | ----------------------------------------------------- | ----------------------------- |
| `disabled`?       | **No** — keep focusable, `aria-current` conveys state | **Yes** — no such page exists |
| Duplicate click   | guarded no-op (`if (page !== currentPage)`)           | already inert (disabled)      |
| Duplicate request | React Query serves from cache                         | n/a                           |
| History churn     | avoided by the guard                                  | n/a                           |

Related: [`url-state-reset-behaviour.md`](./url-state-reset-behaviour.md) for how
`setPage` / `setSort` / `setPerPage` write to the URL.
