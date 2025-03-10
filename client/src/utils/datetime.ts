export const jsDateTimeToString = (datetimeValue: Date | string) => {
  if (!datetimeValue) return "";

  return new Intl.DateTimeFormat("en-US", {
    month: "2-digit",
    day: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  })
    .format(new Date(datetimeValue))
    .replace(",", "");
};
