import { beforeAll, afterEach, afterAll } from "vitest";
import { server } from "./src/mocks/node";

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers()); // reset between tests (so per-test overrides don't leak)
afterAll(() => server.close());
