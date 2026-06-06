// Always shows first and last; current ± 1; ellipsis between gaps. If max ≤ 7, returns the full range (no truncation needed).

// Full range when truncation is not needed
const FULL_RANGE_THRESHOLD = 7;
const SIBLINGS = 1;

const range = (start: number, end: number) => {
  const output: number[] = [];

  for (let i = start; i <= end; i += SIBLINGS) {
    output.push(i);
  }

  return output;
};

export const getPageNumbers = (
  current: number,
  max: number,
): (number | "...")[] => {
  // No truncation needed — render every page
  if (max <= FULL_RANGE_THRESHOLD) {
    return range(1, max);
  }
  // if current is within first 3 pages at beginning
  else if (current <= 3) {
    return [...range(1, current + SIBLINGS), "...", max];
  }
  // if current is within last 3 pages
  else if (current >= max - 2) {
    return [1, "...", ...range(current - SIBLINGS, max)];
  }
  // anything in between
  else {
    return [
      1,
      "...",
      ...range(current - SIBLINGS, current + SIBLINGS),
      "...",
      max,
    ];
  }
};
