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

// Full range when where truncation is not needed
const FULL_RANGE_THRESHOLD = 7;

export const getPageNumbers = (
  current: number,
  max: number,
): (number | "...")[] => {
  // render 1-7
  if (max <= FULL_RANGE_THRESHOLD) {
    return range(1, max);
    // if current is within first 3 pages at beginning
  } else if (current <= 3) {
    return [...range(1, current + 1), "...", max];
    // if current is within last 3 pages
  } else if (max - current <= 2) {
    return [1, "...", ...range(current - 1, max)];
    // anything in between
  } else {
    return [1, "...", ...range(current - 1, current + 1), "...", max];
  }
};
