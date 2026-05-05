export const relativeTime = (dateTime: string): string => {
  // turn it to Date instance
  const date = new Date(dateTime);

  return date.toLocaleDateString("en-AU", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};
