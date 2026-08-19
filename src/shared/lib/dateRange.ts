export function addMonth(date: Date): Date {
  const shifted = new Date(date.getFullYear(), date.getMonth() + 1, date.getDate());

  // 31 січня + місяць у JS дає 3 березня, тож підтягуємо до кінця місяця.
  if (shifted.getDate() !== date.getDate()) {
    shifted.setDate(0);
  }

  return shifted;
}

/** Типовий фільтр адмінських таблиць: від сьогодні на місяць уперед. */
export function defaultMonthRange(): { from: Date; to: Date } {
  const today = new Date();

  return { from: today, to: addMonth(today) };
}
