import type { RouteSegment } from "@/src/entities/trip";

/** Бекенд склеює напрямок як `${departurePlace} - ${arrivalPlace}`; тире-em трапляється у ручних записах. */
const DIRECTION_SEPARATORS = [" - ", " — ", " – "];

export type DirectionParts = { from: string; to: string };

export function parseDirection(direction: string): DirectionParts | null {
  for (const separator of DIRECTION_SEPARATORS) {
    const index = direction.indexOf(separator);
    if (index === -1) continue;

    const from = direction.slice(0, index).trim();
    const to = direction.slice(index + separator.length).trim();

    if (from && to) return { from, to };
  }

  return null;
}

// Порівнюємо назви, а не id: адмінський розклад тримає напрямок рядком і про
// stopId не знає. «ст.м.» дописує суто відображальний formatMetroStops, тож у
// зіставленні його не має бути.
function normalize(value: string) {
  return value
    .replace(/ст\.м\./g, "")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();
}

function stripParentheses(value: string) {
  return value.replace(/\([^)]*\)/g, "").trim();
}

/**
 * Відрізок публічного каталогу за парою назв із напрямку. Точний збіг перевіряємо
 * першим: без дужок «м.Київ (Харківська)» і «м.Київ (Чернігівська)» злилися б в один.
 */
export function findSegment(
  segments: RouteSegment[],
  parts: DirectionParts | null,
): RouteSegment | null {
  if (!parts) return null;

  const from = normalize(parts.from);
  const to = normalize(parts.to);

  const exact = segments.find(
    (segment) => normalize(segment.from) === from && normalize(segment.to) === to,
  );
  if (exact) return exact;

  const baseFrom = stripParentheses(from);
  const baseTo = stripParentheses(to);

  return (
    segments.find(
      (segment) =>
        stripParentheses(normalize(segment.from)) === baseFrom &&
        stripParentheses(normalize(segment.to)) === baseTo,
    ) ?? null
  );
}
