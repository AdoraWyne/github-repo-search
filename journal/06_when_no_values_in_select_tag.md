# What a React `<select>` shows when the value matches no option

## The behaviour

For a controlled `<select value={x}>`, if `x` matches **none** of the `<option>` values,
React selects the **first non-disabled option** — not a blank, and not the second/third.

## Why (React, not plain DOM)

The confusing part: plain DOM and React disagree here.

- **Plain DOM** — `selectEl.value = "banana"` (no match) → `selectedIndex = -1` → shows **blank**.
- **React** — does *not* set `select.value`. It loops the options and sets `option.selected`
  on each one individually. Its rule is:
  1. Find an option whose value equals the current value → select it, done.
  2. No match found → select the **first non-disabled option**.

Step 2 is React's own deliberate fallback. So an unrecognised value quietly resolves to the
first option in the list.

## Simple example

```tsx
function Demo() {
  // "banana" is not one of the option values below
  return (
    <select value="banana" onChange={() => {}}>
      <option value="best-match">Best match</option>
      <option value="stars">Most stars</option>
      <option value="updated">Recently updated</option>
    </select>
  );
}
// Renders: "Best match"  ← the first option, because "banana" matched nothing
```

With a disabled first option, React skips it and picks the next one:

```tsx
<select value="banana" onChange={() => {}}>
  <option value="best-match" disabled>Best match</option>
  <option value="stars">Most stars</option>   {/* ← this one is shown */}
  <option value="updated">Recently updated</option>
</select>
// Renders: "Most stars"  ← first *non-disabled* option
```

## The trap to remember

The dropdown **looks** fine (it shows the first option), but the state you passed in is still
the bad value (`"banana"`). The UI and the state silently disagree. So this is not a
validation step — if you need a clean value, normalise it at the boundary before it reaches
the `<select>`.

## Takeaway

React `<select>`, unmatched value → first non-disabled option is shown. It hides the bad
value visually but does not fix it.
