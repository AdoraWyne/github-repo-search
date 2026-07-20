# MSW: `browser.ts` vs `node.ts`

Both files look almost identical, but they exist for two different **runtime environments**. MSW intercepts network requests and returns fake responses — *how* it intercepts depends on where the code runs.

## The two files

| File | Environment | How it intercepts |
|------|-------------|-------------------|
| `browser.ts` (`setupWorker`) | Real browser (app in dev server) | Registers a Service Worker |
| `node.ts` (`setupServer`) | Node.js (tests in Vitest) | Monkey-patches Node's request modules |

## Why two mechanisms?

- **Browser** has the Service Worker API — a browser feature that sits between the app and the network like a proxy. The request actually leaves the app, the worker catches it, MSW responds. This is why a `mockServiceWorker.js` file lives in `public/`.
- **Node** has no browser APIs, so there's no Service Worker. Instead MSW patches Node's `http`/`https` and `fetch` to intercept requests before they leave.

> `setupServer` is a misleading name — it does **not** start a server. It sets up interception for a server-side (Node) environment.

## The key design point: shared handlers

```ts
export const worker = setupWorker(...handlers);  // browser.ts
export const server = setupServer(...handlers);  // node.ts
```

Both import the same `./handlers`. Mocks are written **once** and reused, so dev-server mocks and test mocks stay in sync.

## When each runs

- **`browser.ts`** → started in the app entry point (`main.tsx`), guarded to dev only. Develop UI against fake data, no real backend.
- **`node.ts`** → started in the test setup file. Tests run with no real network calls.
