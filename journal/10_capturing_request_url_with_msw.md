# Capturing the outgoing request URL with a one-off MSW handler

Context: `fetchRepoSearch` takes some params, builds a GitHub search URL from them, and
calls `fetch`. The thing we want to test is **"did it build the right URL?"**.

So we need a way to peek at the URL the function actually sent.

`captureRequestUrl` is a **test helper** that does exactly that.

```ts
const captureRequestUrl = async (
  params: FetchRepoSearchParams,
): Promise<URL> => {
  let capturedUrl = "";

  server.use(
    http.get("https://api.github.com/search/repositories", ({ request }) => {
      capturedUrl = request.url;
      return HttpResponse.json({
        total_count: 0,
        incomplete_results: false,
        items: [],
      });
    }),
  );

  await fetchRepoSearch(params);
  return new URL(capturedUrl);
};
```

## The core idea: test the request, not the response

Most tests assert on what a function **returns**. This one is different — it asserts on
what the function **sent out**. The response is deliberately empty and boring
(`items: []`), because we don't care about it. The whole reason this helper exists is to
snoop on the request side.

Mental model: it's a wiretap. We let the real function run, but we tap the line and record
the URL that went past.

## Walking through it, line by line

### `let capturedUrl = ""` — the stash

A plain variable in the helper's scope. It starts empty and will hold whatever URL the
request carries. The handler below writes to it; the return statement reads from it. This
works because of **closure** — the handler defined inside the helper can still see and
mutate a variable declared in the helper.

### `server.use(...)` — a one-off override handler

`server.use` installs a handler **at runtime**, just for this call. It temporarily
overrides whatever default handler exists for this route. Its job here is two things at
once:

1. **Side effect** — `capturedUrl = request.url` reaches out and grabs the URL off the
   incoming request and stashes it. _This is the point of the whole helper._
2. **Return** — `HttpResponse.json({...})` hands back a valid-but-empty GitHub response so
   `fetchRepoSearch` doesn't choke on a missing body.

Note the `({ request })` destructuring: MSW passes the resolver an object, and `request`
is the intercepted `Request`. `request.url` is the full URL string, query params and all.

### `await fetchRepoSearch(params)` — pull the trigger

This runs the **real** function under test. Internally it builds a URL from `params` and
calls `fetch`. MSW intercepts that fetch, our one-off handler runs, and the assignment on
the "side effect" line fires. After this line, `capturedUrl` is populated.

### `return new URL(capturedUrl)` — hand back something ergonomic

We could return the raw string, but wrapping it in `new URL(...)` means the test can do:

```ts
const url = await captureRequestUrl({ query: "react" });
expect(url.searchParams.get("q")).toBe("react");
```

instead of hand-parsing a query string. `URL` gives you `searchParams`, `pathname`, etc.
for free.

## The easy line to misread

The URL is captured **inside the handler** (`capturedUrl = request.url`), which runs as a
side effect during `fetchRepoSearch`. The `return` line does **not** capture anything — it
just wraps and hands back what was already captured. The capture and the return are two
different moments:

1. Handler runs mid-`fetch` → writes `capturedUrl`.
2. `fetchRepoSearch` resolves → control returns to the helper.
3. Helper wraps `capturedUrl` in a `URL` and returns it.

## Why a one-off handler instead of the default one?

The default handlers (in `src/mocks/`) are there to give the app sensible fake data during
normal test runs. But they don't record anything. For _this_ test we need a handler that
does one special extra job — stash the URL — so we override just for the duration of this
call with `server.use`. When the next test runs, the default handler is back in place.

See also: [08_testing_select_url_side_effects.md](08_testing_select_url_side_effects.md)
— same underlying principle (assert on the side effect you own), applied to a `<select>`
writing to the URL instead of a fetch building a URL.

## Takeaway

`captureRequestUrl(params)` = install a temporary handler that records the outgoing URL,
run the real function, and return the captured URL as a parsed `URL` object. It lets tests
verify **how the request was built** without caring about the response — the request side
is the thing `fetchRepoSearch` is actually responsible for.
