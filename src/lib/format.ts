/**
 * Format date from YYYY-MM-DD to DD-MM-YYYY (German format)
 */
export function formatDate(dateStr: string): string {
  const [year, month, day] = dateStr.split("-");
  return `${day}-${month}-${year}`;
}
