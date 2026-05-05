export function formatCompactNumber(stars: number): string {
  const formatter = new Intl.NumberFormat("en", {
    notation: "compact",
    maximumFractionDigits: 1,
  });
  return formatter.format(stars);
}
