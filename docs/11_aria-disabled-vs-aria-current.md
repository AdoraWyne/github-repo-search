# `aria-disabled` vs `aria-current` — different questions

Two ARIA attributes that both make a control "not really clickable" but mean
completely different things. Choosing the wrong one tells a screen reader a
falsehood. This came up in the Pagination component (see
[`10_pagination-current-page-focus-and-history.md`](./10_pagination-current-page-focus-and-history.md)),
where the Prev/Next buttons and the numbered current-page button are treated
differently *on purpose*.

## The two attributes answer different questions

| Attribute            | Question it answers   | Meaning                                         |
| -------------------- | --------------------- | ----------------------------------------------- |
| `aria-disabled="true"` | *"Can I use this?"*   | **No** — the control exists but isn't operable now |
| `aria-current="page"`  | *"Am I on this?"*     | **Yes** — this is the item you're currently on  |

They are not interchangeable. `aria-disabled` is about **availability**;
`aria-current` is about **location**.

## Why Pagination uses each

| Button                  | What's actually true                                   | Correct semantic        |
| ----------------------- | ------------------------------------------------------ | ----------------------- |
| Prev / Next at boundary | The action is **unavailable** — there is no prev/next page | `aria-disabled="true"`  |
| Current page number     | Not unavailable — this is **where you are**            | `aria-current="page"`   |

- **Prev on page 1** is genuinely unavailable: there's nowhere to go, so pressing
  it *should* do nothing. That's the textbook meaning of disabled → `aria-disabled`.
- **The current-page button** is *not* unavailable. Its action ("go to page 3") is
  merely **redundant** because you're already on page 3. That's a different reason
  for the click to no-op — you're at your current location, not blocked.

So the current page gets `aria-current="page"` and **no disabled of any kind**. The
click guard (`if (currentPage !== page)`) is just there to skip a pointless
navigation / history push — it is *not* communicating a "disabled" state to the user.

## Why you must not stack both

If we added `aria-disabled` to the current-page button, a screen reader would
announce something like:

> "Page 3, **current page**, **dimmed / unavailable**."

The last two clauses contradict each other — *"you're on this page"* and *"this
page is unavailable"* at once. `aria-current="page"` already fully conveys the
state; `aria-disabled` only injects a false, noisier signal.

## Rule of thumb

- Control is genuinely not usable right now → `aria-disabled="true"`
  (and guard the handler, because an `aria-disabled` element is still clickable —
  see the pagination doc for why we avoid the HTML `disabled` attribute).
- Control represents the currently-active item in a set → `aria-current`
  (`page` / `step` / `true` / etc.), and leave it fully operable/focusable.
- Never put both on the same element — they answer opposite questions.
