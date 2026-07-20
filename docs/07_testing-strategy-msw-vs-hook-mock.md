# Testing strategy — MSW vs. mocking `useRepoSearch`

**Status:** decided.

_adora's_:

- Decided to choose MSW instead, because this file is intended to be integration test and I wanted to test the whole flow, instead mocking useRepoSearch's response.

`SearchPage.test.tsx` is an **integration test** and drives the whole
stack through **MSW** (network-level mocking). We briefly tried mocking the `useRepoSearch`
hook directly with `vi.mock` and decided against it. This doc records _why_, so the decision
isn't relitigated every time a test is awkward to write.

## The decision in one line

For `SearchPage.test.tsx`, mock the **network** (MSW), not the **hook** (`vi.mock`), because
the point of this file is to prove the pieces work together — and mocking the hook mocks away
the very behaviour the test exists to verify.

## What each approach replaces

Every test of `SearchPage` sits on top of this stack:

```
SearchPage (form, ResultList, pagination)
   └─ useRepoSearch      ← our hook: React Query + the per-error retry policy
        └─ fetchRepoSearch ← our api layer: maps HTTP status → ApiError
             └─ fetch()      ← the network
                  └─ MSW    ← intercepts HERE
```

- **MSW** replaces the **bottom** (the network). Everything above it runs for real: the hook,
  the retry policy, the status→`ApiError` mapping, React Query's caching and
  `keepPreviousData`.
- **`vi.mock("../hooks/useRepoSearch")`** replaces the **middle**. You hand `SearchPage` a
  fake hook result directly, and everything below the hook never executes.

That single difference is the whole tradeoff.

## Why we rejected mocking the hook here

**It makes an integration test into theatre.** Several tests only mean something if the _real_
logic runs:

- `"invalid-query (and no Retry) when 422"` verifies the retry policy in
  [`useRepoSearch.ts`](../src/hooks/useRepoSearch.ts)
  (`error.status >= 400 && error.status < 500 ? false : …`). If we fake the hook to return
  `{ error: invalid_query, isError: true }`, that line never runs — we've _assumed_ the exact
  thing the test was supposed to _prove_. The test would stay green even if the retry policy
  were deleted.
- `"shows an error state and recovers when Retry is clicked"` verifies the real flow: fetch
  fails → `fetchRepoSearch` throws → `data` stays undefined → banner shows → `refetch()`
  re-fires → second response succeeds. A faked hook short-circuits all of it.

## When mocking the hook _would_ be the right tool

Not never — just not here. `vi.mock` (or better, passing props directly) is right for a
**pure unit test**: "given _this_ hook state, does the component render _that_?", with zero
interest in how the state was produced. Testing `ResultList` in isolation is the natural home
for that. If we ever want fast, network-free unit tests of `SearchPage`'s render branches,
they belong in a **separate file** that mocks the hook for _all_ its tests and never touches
MSW — not mixed in with the integration suite.

## Tradeoff summary

|                       | MSW (chosen)                                        | `vi.mock` the hook                                  |
| --------------------- | --------------------------------------------------- | --------------------------------------------------- |
| Realism               | High — real hook, retry, error mapping, caching run | Low — inject the end state directly                 |
| What it tests         | The system wired together                           | Just the component's rendering, given a hook result |
| Driving odd states    | Sometimes awkward (offline, loading windows)        | Trivial                                             |
| Coupling to internals | Loose — survives hook refactors                     | Tight — must hand-maintain the hook's return shape  |
| Type safety           | Intact                                              | Needs `Partial` casts that rot silently             |

The one honest cost of MSW: a few states are fiddly to drive at the network layer — the
offline tests lean on React Query's `onlineManager` global, and the "no skeleton during
pagination" test needs an MSW `delay()` to open a deterministic in-between window. Those are
the legitimate places people reach for hook mocking; we solved them with MSW instead, so we
don't need it.

## See also

- [`msw-handler-behaviour.md`](./msw-handler-behaviour.md) — the `trigger:*` magic queries
  (`trigger:503`, `trigger:422`, `trigger:empty`) that let us drive error/empty states through
  MSW without a per-test `server.use(...)`.
- [`react-query-loading-states.md`](./react-query-loading-states.md)
- [`keep-previous-data.md`](./keep-previous-data.md)
