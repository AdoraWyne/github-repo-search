import { describe, expect, it } from "vitest";
import { relativeTime } from "./relativeTime";

describe("relativeTimeFn", () => {
  const DATE_NOW = 1777975200000; // 2026-05-05T10:00:00Z
  const TEST_CASES = [
    // lowest boundary: exactly 1 minute
    // diff: 30s
    {
      dateNow: DATE_NOW,
      updatedAtTime: "2026-05-05T09:59:30Z",
      output: "1 minute",
    },
    // within 1 hour: show minutes
    // diff: 3540s (59mins)
    {
      dateNow: DATE_NOW,
      updatedAtTime: "2026-05-05T09:01:00Z",
      output: "59 minutes",
    },
    // at exactly 1 hour: show hours
    {
      dateNow: DATE_NOW,
      updatedAtTime: "2026-05-05T09:00:00Z",
      output: "1 hour",
    },
    // within 24 hours: show hours
    // diff: 6 hrs 52 mins
    {
      dateNow: DATE_NOW,
      updatedAtTime: "2026-05-05T03:07:14.036Z",
      output: "6 hours",
    },
    // at exactly 24 hours: show days
    {
      dateNow: DATE_NOW,
      updatedAtTime: "2026-05-04T10:00:00Z",
      output: "1 day",
    },
    // within 7 days: show days
    {
      dateNow: DATE_NOW,
      updatedAtTime: "2026-05-01T10:00:00Z",
      output: "4 days",
    },
    // at 7 days: show formatted date
    {
      dateNow: DATE_NOW,
      updatedAtTime: "2026-04-28T10:00:00Z",
      output: "28 April 2026",
    },
    // well beyond 7 days
    {
      dateNow: DATE_NOW,
      updatedAtTime: "2025-04-30T16:42:54Z",
      output: "1 May 2025",
    },
    {
      dateNow: DATE_NOW,
      updatedAtTime: "2026-05-05T11:00:00Z", // 1 hour in the future
      output: "Repo is updated in the future time.",
    },
  ];

  TEST_CASES.forEach(({ dateNow, updatedAtTime, output }) => {
    it(`returns ${output} when given ${updatedAtTime}`, () => {
      expect(relativeTime(dateNow, updatedAtTime)).toBe(output);
    });
  });
});
