# Retry policy: why we branch on `error.status`, not `error.type`

**Decision:** `useRepoSearch` decides whether to auto-retry using the HTTP
status range, not the semantic `error.type`.

```ts
retry: (failureCount, error) =>
  error.status >= 400 && error.status < 500 ? false : failureCount < 3,
```

Read as: never retry a 4xx (client error); retry everything else (5xx / network)
up to 3 times.

## What we considered first

Keying off the semantic type:

```ts
retry: (_n, error) => (error.type === "invalid_query" ? false : ...)
```

## Why we chose status instead

- **DRY / future-proof.** `4xx → don't retry` covers 422 *and* 403/429 in one
  rule, so `rate_limited` (Slice C) needs no change here. The type version would
  have to enumerate each non-retryable type.
- **Correct HTTP semantics.** 4xx = "your request is wrong" → deterministic,
  retrying can't help. 5xx / network = server hiccup → transient, worth retrying.
  This is the standard client retry rule.

## The design-rule caveat

Our rule is "the **UI** branches on `error.type`, never on `status`." That rule is
about the presentation layer. This retry policy lives in the **data layer** (the
hook), which is where HTTP status legitimately still has meaning — `fetchRepoSearch`
is what produces it. Status never reaches the components, so the rule holds.

**Trade-off:** status-range treats all 5xx alike. If we ever need to retry 503 but
not 500, we'd reach for `error.type` again.
