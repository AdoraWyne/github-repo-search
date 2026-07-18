# Why `sortItems` takes `sort: string | null` (not `SortOption`)

(Validation at boundary)

In `src/mocks/handlers.ts`, the mock handler reads the `sort` query param and passes it
to a `sortItems` helper. The question: should that parameter be typed as the domain union
`SortOption` (`"best-match" | "stars" | "updated"`), or as the wider `string | null`?

We went with `string | null`. Here's the reasoning.

## First: TypeScript is compile-time only

Types are erased before the code runs. Typing a parameter `SortOption` does **not** change
the runtime value — it only changes what the compiler believes and checks. So the choice is
about _honesty of the label_, not about runtime behaviour.

## Where the value comes from

```ts
const sort = url.searchParams.get("sort"); // returns string | null at runtime
```

This is **raw, untrusted input from the URL**. A user can hand-edit `?sort=banana`. So the
truthful type for what actually arrives is `string | null`.

## The trap we removed (old line 903)

We previously had:

```ts
const sort = (url.searchParams.get("sort") as SortOption) ?? "best-match";
```

This _looks_ like a guard but isn't. `?? "best-match"` only replaces `null` (the missing
case) — it does nothing for invalid strings. Trace three inputs:

| URL            | `get("sort")` | after `?? "best-match"` | runtime `sort`    |
| -------------- | ------------- | ----------------------- | ----------------- |
| `?sort=stars`  | `"stars"`     | stays                   | `"stars"` ✅      |
| (missing)      | `null`        | replaced                | `"best-match"` ✅ |
| `?sort=banana` | `"banana"`    | **stays** (not null)    | **`"banana"`** ❌ |

`"banana"` slips through. And `as SortOption` then _lies_ to the compiler — the label says
`SortOption` while the real value is `"banana"`. Type says "safe," value isn't.

## Why `string | null` is the honest choice here

Because we don't do a real validation step, `string | null` correctly describes what we
have: an unchecked value that might be anything. The `switch` inside `sortItems` then does
the neutralising — its `default` arm turns `stars`/`updated` misses (including `null` and
`banana`) into fixture order, which is our best-match stand-in.

> **Adora's summary (the conclusion we landed on):**
>
> Because we dont guard any invalid value, so passing in a bad value will slip through. so having string |
> null is to cover that, all the bad values will fall under default which is best-match.
>
> this is also align with what we did in src/api/github.ts line 29-31, when the sort is not one of the SORTABLE_VALUES, we dont send
> request with sort and let the default value sort from github api (which is best-match) to handle it.

## The pattern, seen at two layers

Same idea — an **allowlist with a safe fallback** — applied in two places:

| Layer                          | Unknown value →    | Who produces "best-match"          |
| ------------------------------ | ------------------ | ---------------------------------- |
| `src/api/github.ts` (real)     | omit `sort` param  | GitHub's server applies best-match |
| `src/mocks/handlers.ts` (mock) | `switch` `default` | our mock returns fixture order     |

Both **neutralise** bad input rather than reject it — a hand-edited URL degrades gracefully
to sensible results instead of crashing. Fail-safe, not fail-loud.

## Takeaway

Type a value by what has actually been guaranteed about it. Unvalidated boundary input →
the honest wide type (`string | null`), with a safe fallback downstream. Don't cast to a
narrow type you haven't earned. (If we _did_ want `sortItems` to take `SortOption`, the
correct move would be a real `parseSort` that checks the value at the boundary — not a cast.)
