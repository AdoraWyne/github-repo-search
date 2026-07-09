/**
 * Formats a number into a compact, human-readable string using
 * English-locale suffixes (K, M, B, T) with up to 1 fractional digit.
 *
 * @param stars - the number to format
 * @returns the compact string representation
 *
 * @example
 *   formatCompactNumber(999);     // "999"
 *   formatCompactNumber(1_500);   // "1.5K"
 *   formatCompactNumber(244_712); // "244.7K"
 *   formatCompactNumber(1e9);     // "1B"
 *   formatCompactNumber(Infinity);     // "∞"
 */
export function formatCompactNumber(stars: number): string {
  const formatter = new Intl.NumberFormat("en", {
    notation: "compact",
    maximumFractionDigits: 1,
  });
  return formatter.format(stars);
}
