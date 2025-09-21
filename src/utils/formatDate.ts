export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const currentYear = new Date().getFullYear();
  const dateYear = date.getFullYear();

  const options: Intl.DateTimeFormatOptions = {
    month: "short",
    day: "numeric",
  };

  if (dateYear !== currentYear) {
    options.year = "numeric";
  }

  return date.toLocaleDateString(undefined, options);
}

export function getStatus(date: string): "neutral" | "alert" | "negative" {
  const now = new Date();
  const createdDate = new Date(date);
  const diffInWeeks =
    (now.getTime() - createdDate.getTime()) / (1000 * 60 * 60 * 24 * 7);

  if (diffInWeeks > 6) {
    return "negative";
  } else if (diffInWeeks > 2) {
    return "alert";
  } else {
    return "neutral";
  }
}
