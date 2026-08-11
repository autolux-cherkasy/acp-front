import type { Trip } from "../model/types";

export type RouteOption = { value: string; from: string; to: string; label: string };

export function formatDDMMYYYY(date: Date) {
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();

  return `${day}.${month}.${year}`;
}

export function buildRouteValue(from: string, to: string) {
  return `${from}__${to}`;
}

export function parseRouteValue(value: string) {
  const separatorIndex = value.indexOf("__");

  if (separatorIndex === -1) {
    return { from: value, to: "" };
  }

  return {
    from: value.slice(0, separatorIndex),
    to: value.slice(separatorIndex + 2),
  };
}

export function buildRouteOptions(trips: Trip[]) {
  const optionsMap = new Map<string, RouteOption>();

  for (const trip of trips) {
    const from = trip.from.trim();
    const to = trip.to.trim();

    if (!from || !to) {
      continue;
    }

    const value = buildRouteValue(from, to);

    if (!optionsMap.has(value)) {
      optionsMap.set(value, {
        value,
        from,
        to,
        label: `${from} — ${to}`,
      });
    }
  }

  return [...optionsMap.values()].sort((left, right) => left.label.localeCompare(right.label));
}

export function sortTripsByTime(trips: Trip[]) {
  return [...trips].sort((left, right) => {
    const leftTime = getTripSortValue(left.departureTime);
    const rightTime = getTripSortValue(right.departureTime);

    return leftTime - rightTime;
  });
}

export function getTripSortValue(value: string | null) {
  if (!value) {
    return Number.POSITIVE_INFINITY;
  }

  const parsedValue = Date.parse(value);
  if (!Number.isNaN(parsedValue)) {
    return parsedValue;
  }

  const timeMatch = value.match(/(\d{2}):(\d{2})/);
  if (!timeMatch) {
    return Number.POSITIVE_INFINITY;
  }

  return Number(timeMatch[1]) * 60 + Number(timeMatch[2]);
}

export function formatTripTime(trip: Trip, locale: string) {
  if (!trip.departureTime) {
    return "--:--";
  }

  const parsedDate = new Date(trip.departureTime);

  if (Number.isNaN(parsedDate.getTime())) {
    return normalizeTimeFallback(trip.departureTime);
  }

  return new Intl.DateTimeFormat(locale, {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(parsedDate);
}

export function normalizeTimeFallback(value: string) {
  const match = value.match(/(\d{2}:\d{2})/);
  return match?.[1] ?? value;
}
