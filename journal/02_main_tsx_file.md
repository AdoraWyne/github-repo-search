# main.tsx

In `main.tsx` file, I have (or had) this code:

```ts
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import "./index.css";
import SearchPage from "./routes/SearchPage.tsx";

const queryClient = new QueryClient();

async function enableMocking() {
  if (!import.meta.env.DEV) return;
  const { worker } = await import("./mocks/browser");
  return worker.start();
}

enableMocking().then(() => {
  createRoot(document.getElementById("root")!).render(
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<SearchPage />} />
          </Routes>
        </BrowserRouter>
      </QueryClientProvider>
    </StrictMode>,
  );
});
```

# Explanation one

```ts
async function enableMocking() {
  if (!import.meta.env.DEV) return;
  const { worker } = await import("./mocks/browser");
  return worker.start();
}
```

Understanding:

- Check what environment the app is running. If it's not dev, early return `undefined`.
- If it's dev, we dynamic import "./mock/browser" module.
  - This is MSW's service worker intercepts the browser and mocks network request with what we set in the handler.
- Then `worker.start()` to register the service worker under `./mockServiceWorker.js` and starts the request interception.
  - What is service worker?
    - the service worker sits between your app and the network, like a proxy.

The module:

```ts
import { setupWorker } from "msw/browser";
import { handlers } from "./handlers";

export const worker = setupWorker(...handlers);
```

- We need async await here because we using dynamic import, as opposed to static import.
- Dynamic import is an async operation and it returns a Promise that resolves to the module. The reason is because the browser needs time to fetch and load the JS module file that is not bundled into the main code upfront (similar to lazy loading).
- The **main reasoning** for this:
  - when the app is run on production, we dont need to ship the MSW mocked handler. MSW mocked handler only needed in dev environment.
  - if we static import "./mock/browser" module, the mocked handlers will be included for everyone, every environment.

# Explanation two

```ts
enableMocking().then(() => {
  createRoot(document.getElementById("root")!).render(
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<SearchPage />} />
          </Routes>
        </BrowserRouter>
      </QueryClientProvider>
    </StrictMode>,
  );
});
```

**Understanding**

- We need `enableMocking` to be completed first - to allow service worker to be fully registered before the app renders.
- `enableMocking` is an async function and it returns a Promise. Then, we use `.then()` to wait for the Promise to be resolved before rendering the app. (This is equivalent to using `await`, both are ways to handle a Promise.)

- This prevents a **race condition** where your components fire fetch requests before the mock handler is in place.

Picture what would happen without it:

```ts
// ❌ BAD — race condition
enableMocking(); // starts registering service worker...
createRoot(...).render(...); // app renders immediately, fires API calls
// Service worker isn't ready yet → requests hit the real network
```

But by using `then()`

```ts
// ✅ GOOD — guaranteed order
enableMocking().then(() => {
  createRoot(...).render(...); // only renders after worker is ready
});
```

The app only mounts after MSW is intercepting. So it prevents the race condition mentioned above.
