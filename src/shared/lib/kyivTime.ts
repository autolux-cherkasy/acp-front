export const KYIV_TIME_ZONE = "Europe/Kyiv";

const KYIV_PARTS_FORMATTER = new Intl.DateTimeFormat("en-US", {
  timeZone: KYIV_TIME_ZONE,
  hourCycle: "h23",
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
});

function getKyivOffsetMs(instant: Date): number {
  const parts = KYIV_PARTS_FORMATTER.formatToParts(instant);
  const read = (type: Intl.DateTimeFormatPartTypes) =>
    Number(parts.find((part) => part.type === type)?.value ?? 0);

  const wallClockAsUtc = Date.UTC(
    read("year"),
    read("month") - 1,
    read("day"),
    read("hour"),
    read("minute"),
    read("second"),
  );

  return wallClockAsUtc - instant.getTime();
}

/**
 * Київський настінний час (YYYY-MM-DD + HH:mm) у момент часу в ISO-8601.
 *
 * Рейси диспетчер заводить у київському часі, і бекенд теж рахує добу за
 * Europe/Kyiv. Брати таймзону браузера не можна: оператор із іншим системним
 * часовим поясом створив би рейс на кілька годин повз розклад.
 *
 * Зсув читається двічі, бо шуканий момент і є аргументом для зсуву — це дає
 * правильний результат по обидва боки переходу на літній час.
 */
export function kyivWallClockToIso(dateOnly: string, time: string): string {
  const [year, month, day] = dateOnly.split("-").map(Number);
  const [hours, minutes] = time.split(":").map(Number);

  const wallClockAsUtc = Date.UTC(year, month - 1, day, hours, minutes, 0, 0);
  const firstGuess = wallClockAsUtc - getKyivOffsetMs(new Date(wallClockAsUtc));

  return new Date(
    wallClockAsUtc - getKyivOffsetMs(new Date(firstGuess)),
  ).toISOString();
}

/** Календарна дата моменту часу за київською добою, YYYY-MM-DD. */
export function kyivDateOnly(iso: string): string {
  // en-CA дає саме ISO-подібний формат YYYY-MM-DD.
  return new Date(iso).toLocaleDateString("en-CA", {
    timeZone: KYIV_TIME_ZONE,
  });
}

/**
 * Прибуття раніше за відправлення означає рейс через північ, тож дата прибуття
 * — наступна доба.
 */
export function nextDateOnly(dateOnly: string): string {
  const [year, month, day] = dateOnly.split("-").map(Number);

  return new Date(Date.UTC(year, month - 1, day + 1)).toISOString().slice(0, 10);
}
