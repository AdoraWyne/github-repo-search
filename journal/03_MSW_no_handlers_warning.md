# MSW: "intercepted a request without a matching request handler"

## What I saw

While working on Slice 4 (pagination), I refreshed the page in the browser at a URL like `http://localhost:5173/?q=react&page=7` and got this warning in the console:

```
[MSW] Warning: intercepted a request without a matching request handler:

  • GET /?q=react&page=7

If you still wish to intercept this unhandled request, please create a request handler for it.
```

At first this was confusing — my MSW handler only cares about the GitHub API URL, so why is MSW even seeing a request to `/?q=react&page=7`?

## Why the warning happens

MSW's job is to intercept **every request** that comes out of my app's origin, then check: _"Do I have a handler for this?"_

- If yes → return the mocked response
- If no → do whatever `onUnhandledRequest` is set to (default is `'warn'`)

The warning was firing because MSW saw a request that had no matching handler. That request wasn't a GitHub API call — it was the **browser reloading the page itself**.

## MSW's role: the service worker

MSW works by installing a **service worker** in the browser (that's what `worker.start()` does in `main.tsx`).

A service worker is a background script that sits **between the app and the network**:

```
Browser → [Service Worker (MSW)] → Network
```

Once installed, the SW sees every outgoing request from the app's origin. Not just `fetch()` calls in my code — everything. That includes:

- API calls (`fetch('https://api.github.com/...')`)
- Loading images
- Loading CSS/JS files
- **Navigation requests** (the browser loading a page's HTML)

That last one is the key.

## The flow when I refresh the page

When I refresh at `http://localhost:5173/?q=react&page=7`, my browser doesn't send _one_ request. It sends **multiple separate requests**, at different times.

### Request #1 — Navigation request (the one that warned)

- **URL:** `GET http://localhost:5173/?q=react&page=7`
- **When:** immediately, the moment I hit refresh
- **Why:** the browser needs the HTML file for that URL
- **MSW status:** no handler → **warning shown** ⚠️
- **What actually happens:** Vite dev server returns `index.html` (SPAs return the same HTML for every URL — client-side routing decides what to render)

### Request #2 — JS bundle

- **URL:** `GET http://localhost:5173/src/main.tsx` (or similar)
- **When:** after the HTML loads and the browser sees `<script src="...">`
- **Why:** the browser needs the JavaScript bundle
- **MSW status:** no handler (but usually filtered by MSW defaults so no warning)

### Request #3 — The GitHub API call

- **URL:** `GET https://api.github.com/search/repositories?q=react&page=7&per_page=10`
- **When:** after React boots and `useRepoSearch` runs
- **Why:** React Query calls `fetch()` with the API URL
- **MSW status:** handler matches → returns mocked response ✅

To confirm which: open DevTools → Network tab, filter to "Fetch/XHR", refresh the page, and see what's firing. The "Initiator" column tells you what triggered each request.

## The mental model

**One user action (refresh) → many separate requests over time.**

Not one big bundled thing. Each request happens independently as the browser realises it needs something.

## Why the warning shows a relative path

The warning shows `GET /?q=react&page=7`, not `GET http://localhost:5173/?q=react&page=7`.

MSW abbreviates same-origin URLs (requests to my dev server) to just the path — it's cleaner in the console. Cross-origin requests (like `api.github.com`) would show the full URL.

## When the warning shows up

I'll see this warning specifically when:

- I **refresh** the page
- I **open the URL in a new tab / from a bookmark**
- I **paste the URL in the address bar and hit Enter**

All of these trigger navigation requests.

I will NOT see it when:

- Clicking pagination buttons (React Router uses `pushState` — no HTTP request)
- Typing in the search box (no request)
- Submitting a search (also `pushState`)

## The fix

Configure `onUnhandledRequest` in `worker.start()` inside `main.tsx`.

### Option A — silence everything unhandled

```ts
return worker.start({
  onUnhandledRequest: "bypass",
});
```

Simple, but if I ever typo an API URL, MSW won't warn — the request just passes through unhandled.

### Option B — only warn for real API calls

```ts
return worker.start({
  onUnhandledRequest(request, print) {
    if (new URL(request.url).hostname === "api.github.com") {
      print.warning();
    }
    // else silently bypass
  },
});
```

Keeps the warning for actual API mistakes; ignores dev-server noise like navigation requests.

**I went with Option B.** It preserves the safety net (typo'd URLs still get flagged) without the console noise from routine navigations.

## Takeaway

The warning wasn't a bug in my app. MSW was correctly telling me: _"I saw a request I don't have a plan for."_ The reason it wasn't obvious is because I was thinking of "requests" as only API calls — but navigation is also a request, and service workers see them all.

Rule of thumb: **anything that leaves the browser is a request, even when it doesn't feel like one.**
