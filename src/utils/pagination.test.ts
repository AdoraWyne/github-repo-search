import { describe, expect, it } from "vitest";
import { getPageNumbers } from "./pagination";

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
      output: [1, 2, 3, "ellipsis", 10],
    },
    {
      current: 3,
      max: 10,
      output: [1, 2, 3, 4, "ellipsis", 10],
    },
    {
      current: 8,
      max: 10,
      output: [1, "ellipsis", 7, 8, 9, 10],
    },
    {
      current: 98,
      max: 100,
      output: [1, "ellipsis", 97, 98, 99, 100],
    },
    {
      current: 99,
      max: 100,
      output: [1, "ellipsis", 98, 99, 100],
    },
    {
      current: 45,
      max: 46,
      output: [1, "ellipsis", 44, 45, 46],
    },
    {
      current: 4,
      max: 10,
      output: [1, "ellipsis", 3, 4, 5, "ellipsis", 10],
    },
    {
      current: 13,
      max: 99,
      output: [1, "ellipsis", 12, 13, 14, "ellipsis", 99],
    },
    {
      current: 1,
      max: 99,
      output: [1, 2, "ellipsis", 99],
    },
    {
      current: 99,
      max: 99,
      output: [1, "ellipsis", 98, 99],
    },
  ];

  TEST_CASES.forEach(({ current, max, output }) => {
    it(`returns ${output} when current is ${current} and max is ${max}`, () => {
      expect(getPageNumbers(current, max)).toEqual(output);
    });
  });
});
