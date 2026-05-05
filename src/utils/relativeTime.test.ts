import { describe, expect, it } from "vitest";

// the lowest is 1min
// within 1 hour, show mins
// at 1 hour, show 1 hour
// Within 24 hours, show hours
// at 24 hours, show 1 day
// within a week (7 days), show days
// at 7days, show the date

// diff = today - updated_at
// if (diff >= 7 days) show the date

describe("relativeTimeFn", () => {});
