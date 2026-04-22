export function getTodayDateInputValue() {
  const today = new Date();
  const localToday = new Date(today.getTime() - today.getTimezoneOffset() * 60_000);

  return localToday.toISOString().slice(0, 10);
}

export function isDateInputValueInFuture(value: unknown) {
  if (typeof value !== "string") return false;

  const date = value.trim();
  return /^\d{4}-\d{2}-\d{2}$/.test(date) && date > getTodayDateInputValue();
}
