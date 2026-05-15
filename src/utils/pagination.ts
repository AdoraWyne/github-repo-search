// Always shows first and last; current ± 1; ellipsis between gaps. If max ≤ 7, returns the full range (no truncation needed).
const range = (start: number, end: number, step = 1) => {
  const output = [];

  if (typeof end === "undefined") {
    end = start;
    start = 1;
  }

  for (let i = start; i <= end; i += step) {
    output.push(i);
  }

  return output;
};

export const getPageNumbers = (
  current: number,
  max: number,
): (number | "ellipsis")[] => {
  // render 1-7
  if (range(1, max).length <= 7) {
    return range(1, max);
    // if current <=3 at beginning
  } else if (current <= 3) {
    return [...range(1, current + 1), "ellipsis", max];
    // if current at less 4 pages
  } else if (max - current <= 4) {
    return [1, "ellipsis", ...range(current - 1, max)];
    // anything in between
  } else {
    return [1, "ellipsis", ...range(current - 1, current + 1), "ellipsis", max];
  }
};
