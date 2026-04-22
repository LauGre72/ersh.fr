export function getCurrentSchoolYear(date = new Date()) {
  const year = date.getFullYear();
  const startYear = date.getMonth() >= 8 ? year : year - 1;

  return `${startYear}-${startYear + 1}`;
}
