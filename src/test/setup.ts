import "@testing-library/jest-dom/vitest";
import { beforeAll, afterEach, afterAll } from "vitest";
import { cleanup } from "@testing-library/react";
import { onlineManager } from "@tanstack/react-query";
import { server } from "../mocks/node";

beforeAll(() => server.listen());
afterEach(() => {
  cleanup(); // unmount React tree, clear DOM
  server.resetHandlers(); // reset between tests (so per-test overrides don't leak)
  onlineManager.setOnline(true); // reset RQ's global online flag (offline tests set it false)
});
afterAll(() => server.close());
