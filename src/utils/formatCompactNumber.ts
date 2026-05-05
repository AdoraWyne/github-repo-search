// Below 999 -> 999

// 1000 -> 1k
// 1265 -> 1.2k
// 10000 -> 10k
// 18765 -> 18.7k
// 100000 -> 100k
// 244772 -> 244k

// 1,000,000 -> 1m
// 1,673,893 -> 1.6m

// 1,000,000,000 -> 1b
// 2,397,397,777 -> 2.3b

export function formatCompactNumber(stars: number): string {
  if (stars <= 999) return stars.toString();

  if (stars >= 1_000 && stars <= 999_999) {
    if (Number.isInteger(stars / 1_000)) {
      return `${stars / 1_000}k`;
    } else {
      return (stars / 1_000)
        .toString()
        .replace(/(^\d+)(.)(\d)(\d+)/, "$1$2$3k");
    }
  }

  if (stars >= 1_000_000 && stars <= 999_999_999) {
    if (Number.isInteger(stars / 1_000_000)) {
      return `${stars / 1_000_000}m`;
    } else {
      return (stars / 1_000_000)
        .toString()
        .replace(/(^\d+)(.)(\d)(\d+)/, "$1$2$3m");
    }
  }

  if (stars >= 1_000_000_000 && stars <= 999_999_999_999) {
    if (Number.isInteger(stars / 1_000_000_000)) {
      return `${stars / 1_000_000_000}b`;
    } else {
      return (stars / 1_000_000_000)
        .toString()
        .replace(/(^\d+)(.)(\d)(\d+)/, "$1$2$3b");
    }
  }

  if (stars >= 1_000_000_000_000 && stars <= 999_999_999_999_999) {
    if (Number.isInteger(stars / 1_000_000_000_000)) {
      return `${stars / 1_000_000_000_000}t`;
    } else {
      return (stars / 1_000_000_000_000)
        .toString()
        .replace(/(^\d+)(.)(\d)(\d+)/, "$1$2$3t");
    }
  }

  return "Infinity";
}
