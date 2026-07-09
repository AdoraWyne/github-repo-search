import { describe, expect, it } from "vitest";
import { getPageNumbers } from "./getPageNumber";

describe("getPageNumbers Fn", () => {
  const TEST_CASES = [
    {
      current: 1,
      max: 7,
      output: [1, 2, 3, 4, 5, 6, 7],
    },
    {
      current: 2,
      max: 10,
      output: [1, 2, 3, "...", 10],
    },
    {
      current: 3,
      max: 10,
      output: [1, 2, 3, 4, "...", 10],
    },
    {
      current: 8,
      max: 10,
      output: [1, "...", 7, 8, 9, 10],
    },
    {
      current: 9,
      max: 12,
      output: [1, "...", 8, 9, 10, "...", 12],
    },
    {
      current: 75,
      max: 75,
      output: [1, "...", 74, 75],
    },
    {
      current: 98,
      max: 100,
      output: [1, "...", 97, 98, 99, 100],
    },
    {
      current: 99,
      max: 100,
      output: [1, "...", 98, 99, 100],
    },
    {
      current: 45,
      max: 46,
      output: [1, "...", 44, 45, 46],
    },
    {
      current: 4,
      max: 10,
      output: [1, "...", 3, 4, 5, "...", 10],
    },
    {
      current: 13,
      max: 99,
      output: [1, "...", 12, 13, 14, "...", 99],
    },
    {
      current: 1,
      max: 99,
      output: [1, 2, "...", 99],
    },
    {
      current: 99,
      max: 99,
      output: [1, "...", 98, 99],
    },
  ];

  TEST_CASES.forEach(({ current, max, output }) => {
    it(`returns ${output} when current is ${current} and max is ${max}`, () => {
      expect(getPageNumbers(current, max)).toEqual(output);
    });
  });
});
