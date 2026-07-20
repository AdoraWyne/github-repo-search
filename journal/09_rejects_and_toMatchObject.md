# `.rejects` and `toMatchObject` in async tests

## The line in question

```js
await expect(
  fetchRepoSearch({ q: "test", page: 1, per_page: 10, sort: "best-match" }),
).rejects.toMatchObject({ status: 503, type: "service_down" });
```

Read as a sentence: *"I expect this promise to reject, and the value it rejects with to be an object that matches `{ status: 503, type: "service_down" }`."*

`fetchRepoSearch(...)` returns a **promise**. With MSW faking a 503 response, the code is expected to `throw` an `ApiError`. In async code, throwing == the promise **rejecting**.

## `.rejects` is only for promise rejection

`.rejects` is a Jest/Vitest modifier that:

1. Takes the promise passed to `expect(...)`
2. Waits for it to **settle**
3. If it **rejects** → unwraps the rejection value and hands it to the next matcher
4. If it **resolves** instead → the test fails immediately ("expected promise to reject, but it resolved")

Its mirror image is `.resolves`, which expects the promise to **fulfil** and unwraps the resolved value.

So `.rejects` is specifically the "I expect this to blow up" path — and yes, it hands the rejected value to whatever matcher follows.

## `toMatchObject` checks the unwrapped value

After `.rejects` unwraps the rejection, the caught value (the `ApiError` instance) becomes the subject of the matcher. `toMatchObject(...)` then checks that subject.

### Why `toMatchObject` and not `toEqual`

`toMatchObject` checks a **subset** — it only verifies the properties listed and ignores any others.

The real `ApiError` probably looks more like:

```js
{ status: 503, type: "service_down", message: "...", name: "ApiError", stack: "..." }
```

- `toMatchObject({ status: 503, type: "service_down" })` → **passes** ✅ (named props match; `message`/`stack` ignored)
- `toEqual({ status: 503, type: "service_down" })` → **fails** ❌ (demands *exactly* those keys and nothing else)

Choosing `toMatchObject` deliberately says *"I only care that `status` and `type` are right"* — the parts that matter for this behaviour — without coupling the test to the exact message or every field.

## Don't miss the `await`

```js
await expect(...).rejects.toMatchObject(...)
```

`.rejects` produces a promise (it must wait for the async work). Without `await`, the test function could finish before the assertion runs, and a failure might slip through silently. Whenever you use `.rejects` or `.resolves`, either `await` it or `return` it.

## Takeaways

- `.rejects` / `.resolves` unwrap a settled promise so the next matcher runs against the unwrapped value.
- `.rejects` fails the test if the promise resolves; `.resolves` fails if it rejects.
- `toMatchObject` = subset match (assert only what matters); `toEqual` = exact match.
- Always `await` (or `return`) assertions built on `.rejects` / `.resolves`.
