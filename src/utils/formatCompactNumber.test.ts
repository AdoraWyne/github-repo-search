import { describe, expect, it } from "vitest";
import { formatCompactNumber } from "./formatCompactNumber";

describe("formatCompactNumber Fn", () => {
  const TEST_CASES = [
    {
      input: 0,
      output: "0",
    },
    {
      input: 1,
      output: "1",
    },
    {
      input: 999,
      output: "999",
    },
    {
      input: 1000,
      output: "1K",
    },
    {
      input: 9999,
      output: "10K",
    },
    {
      input: 10_000,
      output: "10K",
    },
    {
      input: 10_038,
      output: "10K",
    },
    {
      input: 100_000,
      output: "100K",
    },
    {
      input: 244_712,
      output: "244.7K",
    },
    {
      input: 999_999,
      output: "1M",
    },
    {
      input: 1_000_000,
      output: "1M",
    },
    {
      input: 999_999_999,
      output: "1B",
    },
    {
      input: 1_000_000_000,
      output: "1B",
    },
    {
      input: 999_999_999_999,
      output: "1T",
    },
    {
      input: 1_000_000_000_000,
      output: "1T",
    },
    {
      input: 999_999_999_999_999,
      output: "1000T",
    },
    {
      input: Infinity,
      output: "∞",
    },
  ];

  TEST_CASES.forEach(({ input, output }) => {
    it(`returns ${output} when given ${input}`, () => {
      expect(formatCompactNumber(input)).toEqual(output);
    });
  });
});
