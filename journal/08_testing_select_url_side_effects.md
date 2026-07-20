# Testing a `<select>` that writes to the URL

Context: `PageSizeSelect` renders a native `<select>` for the `per_page` param. When the
user picks an option, the component's job is to update the URL (`?per_page=50`). The
question: how do you test that correctly?

## The trap: `<select>` has its own memory

A native HTML `<select>` tracks its own selected value **inside the browser**, all by
itself. When the user (or `user.selectOptions` in a test) clicks "50", the browser
immediately marks that option as selected. That happens no matter what your code does.

Your `onChange` handler *also* fires as a result — but these are **two separate things**:

1. The browser updating the visible selection (guaranteed, built-in).
2. Your `onChange` writing `per_page=50` into the URL (your responsibility, could be broken).

### Light-switch analogy

Flipping a wall switch always moves the switch to the "up" position — mechanical,
guaranteed. Whether the *light turns on* depends on the wiring behind it.

- Switch position = the `<select>`'s own value → always updates.
- The light = your URL update → only happens if your `onChange` wiring works.

They are independent.

## Why asserting on the select is a false pass

Say your `onChange` is **broken** and never touches the URL:

```tsx
await user.selectOptions(select, "50");
expect(select).toHaveValue("50");   // ✅ STILL PASSES — but proves nothing
```

This passes because clicking "50" made the *browser* set the value (the switch flipped).
It has nothing to do with your broken URL logic. The test looks like it verifies your
feature, but it really just verifies that the browser's built-in `<select>` works.

Note: `toHaveValue("50")` checks the *currently selected* value — not whether "50" exists
as an option in the list.

## The fix: assert on the side effect you own (the URL)

The URL isn't visible text you can assert on directly, so mount a tiny periscope
component that reads the URL and prints it into the DOM:

```tsx
const LocationDisplay = () => {
  const { search } = useLocation();          // "?per_page=50"
  return <div data-testid="location">{search}</div>;
};
```

Now the test can assert on the outcome that actually matters:

```tsx
await user.selectOptions(select, "50");
expect(screen.getByTestId("location").textContent).toContain("per_page=50"); // ❌ fails if URL logic is broken
```

**Rule of thumb: test the side effect you're responsible for, not the built-in behavior
of the platform.**

## The render helper, explained

```tsx
const renderAtUrl = (url = "/") =>
  render(
    <>
      <PageSizeSelect />
      <LocationDisplay />
    </>,
    {
      wrapper: ({ children }: { children: ReactNode }) => (
        <MemoryRouter initialEntries={[url]}>{children}</MemoryRouter>
      ),
    },
  );
```

### `render()` takes TWO arguments (not three)

```tsx
render(ui, options)
```

- **Argument 1** = the JSX to render. Here it's a `<>...</>` **Fragment** — an invisible
  wrapper that groups two sibling components into one root element (render only accepts
  one root).
- **Argument 2** = an options object. `wrapper` is a *key inside that object*, NOT a third
  thing being rendered.

### What `wrapper` does

`wrapper` tells RTL: "wrap whatever I'm rendering inside this component." RTL passes
argument 1 in as `children`. So the tree that actually renders is:

```tsx
<MemoryRouter initialEntries={[url]}>
  <PageSizeSelect />
  <LocationDisplay />
</MemoryRouter>
```

You could inline the `<MemoryRouter>` instead — identical for a single render. The
`wrapper` option earns its keep when many tests need the same setup: write it once in
`renderAtUrl`, reuse everywhere.

### What `MemoryRouter` is

React Router ships different routers:

- `BrowserRouter` — reads/writes the real address bar (needs a real browser).
- `MemoryRouter` — keeps the "URL" in a plain JS variable in memory.

Tests run in jsdom (a simulated DOM, no real navigation), so `MemoryRouter` is the right
choice. You hand it a starting URL via `initialEntries={[url]}` and `useLocation` has
something to read from. That's why `LocationDisplay` can report the URL at all.

## Takeaway

`renderAtUrl("/?per_page=25")` = render `PageSizeSelect` + the `LocationDisplay`
periscope, wrapped in a `MemoryRouter` starting at that URL — in one line. Then assert on
the URL, not the select, so the test catches real bugs instead of rubber-stamping the
browser's built-in behavior.
