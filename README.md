# Demo

You can see [the live demo link here](https://repo-scout.fly.dev/).

# TODO:

in useUrlSearchState hook:

- Q: do we need setQuery? since we ady have setQueryAndResetPage
- BUG: `const page = Number(searchParams.get("page")) || 1;` -> negative number could pass through
  - Claude:" Negative page numbers (useUrlSearchState.ts:10): Number("-3") || 1 is -3 (truthy), so ?page=-3 passes straight through to the API. Probably harmless, but I noted it in the docs so it's not a surprise."
- BUG: Unvalidated sort cast (useUrlSearchState.ts:12): searchParams.get("sort") as SortOption tells TypeScript to trust the URL, but ?sort=banana would flow through typed as a valid SortOption without being one. This is the same class of issue you already flagged yourself in github.ts:37-45 — the as cast asserts a shape the compiler can't verify, so it only surfaces at runtime. A small allowlist check (isSortOption(...)) or the Zod approach you mentioned would close both.

- Create a Selector component that sort selector and page size selector can use
