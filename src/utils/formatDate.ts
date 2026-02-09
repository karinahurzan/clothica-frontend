export function formatDateToDayMonthYear(date: string | Date): string {
  const parsedDate = typeof date === "string" ? new Date(date) : date;

  if (Number.isNaN(parsedDate.getTime())) {
    return "";
  }

  const day = String(parsedDate.getDate()).padStart(2, "0");
  const month = String(parsedDate.getMonth() + 1).padStart(2, "0");
  const year = parsedDate.getFullYear();

  return `${day}.${month}.${year}`;
}
