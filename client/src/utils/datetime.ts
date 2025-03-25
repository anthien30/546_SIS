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

export const formatTime = (hour: string) => {
  const hourInt = parseInt(hour, 10); // Convert string to integer
  const period = hourInt >= 12 ? "PM" : "AM";
  const formattedHour = hourInt % 12 || 12; // Convert 0 or 12+ to 12-hour format
  return `${formattedHour}:00 ${period}`;
};
