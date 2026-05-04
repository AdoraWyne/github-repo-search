import "@testing-library/jest-dom/vitest";
import { beforeAll, afterEach, afterAll } from "vitest";
import { cleanup } from "@testing-library/react";
import { server } from "../mocks/node";

beforeAll(() => server.listen());
afterEach(() => {
  cleanup(); // unmount React tree, clear DOM
  server.resetHandlers(); // reset between tests (so per-test overrides don't leak)
});
afterAll(() => server.close());
