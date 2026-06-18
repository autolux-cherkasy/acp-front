import type { Locale } from "@/src/shared/i18n/config";
import type { Trip } from "./types";

export type LocalizedValue<T> = Record<Locale, T>;

export type PopularRoute = {
  id: string;
  slug: string;
  searchFrom: string;
  searchTo: string;
  title: LocalizedValue<string>;
  imageSrc: string;
  imageAlt: LocalizedValue<string>;
  nearestTripLabel: LocalizedValue<string>;
  price: number;
  maxSeats: number;
  tripDate: string | null;
  departureTime: string | null;
  arrivalTime: string | null;
  departureCity: LocalizedValue<string>;
  departureStop: LocalizedValue<string>;
  arrivalCity: LocalizedValue<string>;
  arrivalStop: LocalizedValue<string>;
};

function localize<T>(uk: T, en: T): LocalizedValue<T> {
  return { uk, en };
}

export const popularRoutes: PopularRoute[] = [
  {
    id: "1",
    slug: "cherkasy-kyiv-kharkivska",
    searchFrom: "Черкаси",
    searchTo: "Київ",
    title: {
      uk: "Черкаси-Київ (ст.м. Харківська)",
      en: "Cherkasy-Kyiv (Kharkivska metro)",
    },
    imageSrc: "/Routes/cherkasy-kyiv-kharkivska.jpg",
    imageAlt: {
      uk: "Рейс Черкаси-Київ Харківська",
      en: "Cherkasy-Kyiv Kharkivska route",
    },
    nearestTripLabel: {
      uk: "Найближчий рейс: сьогодні о 10:30",
      en: "Nearest trip: today at 10:30",
    },
    price: 500,
    maxSeats: 7,
    tripDate: null,
    departureTime: "10:30",
    arrivalTime: null,
    departureCity: localize("м. Черкаси", "Cherkasy"),
    departureStop: localize("пл. Дружби Народів", "Druzhby Narodiv Sq."),
    arrivalCity: localize("м. Київ", "Kyiv"),
    arrivalStop: localize("ст.м. Харківська", "Kharkivska metro"),
  },
  {
    id: "2",
    slug: "cherkasy-kyiv-chernihivska",
    searchFrom: "Черкаси",
    searchTo: "Київ",
    title: {
      uk: "Черкаси-Київ (ст.м. Чернігівська)",
      en: "Cherkasy-Kyiv (Chernihivska metro)",
    },
    imageSrc: "/Routes/cherkasy-kyiv-chernihivska.png",
    imageAlt: {
      uk: "Рейс Черкаси-Київ Чернігівська",
      en: "Cherkasy-Kyiv Chernihivska route",
    },
    nearestTripLabel: {
      uk: "Найближчий рейс: сьогодні о 11:00",
      en: "Nearest trip: today at 11:00",
    },
    price: 500,
    maxSeats: 7,
    tripDate: null,
    departureTime: "11:00",
    arrivalTime: null,
    departureCity: localize("м. Черкаси", "Cherkasy"),
    departureStop: localize("пл. Дружби Народів", "Druzhby Narodiv Sq."),
    arrivalCity: localize("м. Київ", "Kyiv"),
    arrivalStop: localize("ст.м. Чернігівська", "Chernihivska metro"),
  },
  {
    id: "3",
    slug: "kyiv-kharkivska-cherkasy",
    searchFrom: "Київ",
    searchTo: "Черкаси",
    title: {
      uk: "Київ (ст.м. Харківська)-Черкаси",
      en: "Kyiv (Kharkivska metro)-Cherkasy",
    },
    imageSrc: "/Routes/kyiv-kharkivska-cherkasy.png",
    imageAlt: {
      uk: "Рейс Київ Харківська-Черкаси",
      en: "Kyiv Kharkivska-Cherkasy route",
    },
    nearestTripLabel: {
      uk: "Найближчий рейс: сьогодні о 08:00",
      en: "Nearest trip: today at 08:00",
    },
    price: 500,
    maxSeats: 7,
    tripDate: null,
    departureTime: "08:00",
    arrivalTime: null,
    departureCity: localize("м. Київ", "Kyiv"),
    departureStop: localize("ст.м. Харківська", "Kharkivska metro"),
    arrivalCity: localize("м. Черкаси", "Cherkasy"),
    arrivalStop: localize("пл. Дружби Народів", "Druzhby Narodiv Sq."),
  },
  {
    id: "4",
    slug: "kyiv-chernihivska-cherkasy",
    searchFrom: "Київ",
    searchTo: "Черкаси",
    title: {
      uk: "Київ (ст.м. Чернігівська)-Черкаси",
      en: "Kyiv (Chernihivska metro)-Cherkasy",
    },
    imageSrc: "/Routes/kyiv-chernihivska-cherkasy.jpg",
    imageAlt: {
      uk: "Рейс Київ Чернігівська-Черкаси",
      en: "Kyiv Chernihivska-Cherkasy route",
    },
    nearestTripLabel: {
      uk: "Найближчий рейс: сьогодні о 08:15",
      en: "Nearest trip: today at 08:15",
    },
    price: 500,
    maxSeats: 7,
    tripDate: null,
    departureTime: "08:15",
    arrivalTime: null,
    departureCity: localize("м. Київ", "Kyiv"),
    departureStop: localize("ст.м. Чернігівська", "Chernihivska metro"),
    arrivalCity: localize("м. Черкаси", "Cherkasy"),
    arrivalStop: localize("пл. Дружби Народів", "Druzhby Narodiv Sq."),
  },
  {
    id: "5",
    slug: "cherkasy-kharkiv",
    searchFrom: "Черкаси",
    searchTo: "Харків",
    title: {
      uk: "Черкаси-Харків",
      en: "Cherkasy-Kharkiv",
    },
    imageSrc: "/Routes/cherkasy-kharkiv.png",
    imageAlt: {
      uk: "Рейс Черкаси-Харків",
      en: "Cherkasy-Kharkiv route",
    },
    nearestTripLabel: {
      uk: "Найближчий рейс: сьогодні о 07:00",
      en: "Nearest trip: today at 07:00",
    },
    price: 950,
    maxSeats: 7,
    tripDate: null,
    departureTime: "07:00",
    arrivalTime: null,
    departureCity: localize("м. Черкаси", "Cherkasy"),
    departureStop: localize("пл. Дружби Народів", "Druzhby Narodiv Sq."),
    arrivalCity: localize("м. Харків", "Kharkiv"),
    arrivalStop: localize("", ""),
  },
  {
    id: "6",
    slug: "cherkasy-poltava",
    searchFrom: "Черкаси",
    searchTo: "Полтава",
    title: {
      uk: "Черкаси-Полтава",
      en: "Cherkasy-Poltava",
    },
    imageSrc: "/Routes/cherkasy-poltava.png",
    imageAlt: {
      uk: "Рейс Черкаси-Полтава",
      en: "Cherkasy-Poltava route",
    },
    nearestTripLabel: {
      uk: "Найближчий рейс: сьогодні о 09:00",
      en: "Nearest trip: today at 09:00",
    },
    price: 667,
    maxSeats: 7,
    tripDate: null,
    departureTime: "09:00",
    arrivalTime: null,
    departureCity: localize("м. Черкаси", "Cherkasy"),
    departureStop: localize("пл. Дружби Народів", "Druzhby Narodiv Sq."),
    arrivalCity: localize("м. Полтава", "Poltava"),
    arrivalStop: localize("", ""),
  },
  {
    id: "7",
    slug: "cherkasy-kremenchuk",
    searchFrom: "Черкаси",
    searchTo: "Кременчук",
    title: {
      uk: "Черкаси-Кременчук",
      en: "Cherkasy-Kremenchuk",
    },
    imageSrc: "/Routes/cherkasy-kremenchuk.jpg",
    imageAlt: {
      uk: "Рейс Черкаси-Кременчук",
      en: "Cherkasy-Kremenchuk route",
    },
    nearestTripLabel: {
      uk: "Найближчий рейс: сьогодні о 08:20",
      en: "Nearest trip: today at 08:20",
    },
    price: 400,
    maxSeats: 7,
    tripDate: null,
    departureTime: "08:20",
    arrivalTime: null,
    departureCity: localize("м. Черкаси", "Cherkasy"),
    departureStop: localize("пл. Дружби Народів", "Druzhby Narodiv Sq."),
    arrivalCity: localize("м. Кременчук", "Kremenchuk"),
    arrivalStop: localize("", ""),
  },
  {
    id: "8",
    slug: "zolotonosha-kyiv",
    searchFrom: "Золотоноша",
    searchTo: "Київ",
    title: {
      uk: "Золотоноша-Київ",
      en: "Zolotonosha-Kyiv",
    },
    imageSrc: "/Routes/zolotonosha-kyiv.png",
    imageAlt: {
      uk: "Рейс Золотоноша-Київ",
      en: "Zolotonosha-Kyiv route",
    },
    nearestTripLabel: {
      uk: "Найближчий рейс: сьогодні о 06:45",
      en: "Nearest trip: today at 06:45",
    },
    price: 450,
    maxSeats: 7,
    tripDate: null,
    departureTime: "06:45",
    arrivalTime: null,
    departureCity: localize("м. Золотоноша", "Zolotonosha"),
    departureStop: localize("", ""),
    arrivalCity: localize("м. Київ", "Kyiv"),
    arrivalStop: localize("", ""),
  },
];

export function getLocalizedRouteValue<T>(value: LocalizedValue<T>, locale: Locale) {
  return value[locale];
}

function buildSearchRouteValue(from: string, to: string) {
  return `${from}__${to}`;
}

export function getPopularRouteHref(route: Pick<PopularRoute, "searchFrom" | "searchTo">) {
  const searchParams = new URLSearchParams({
    route: buildSearchRouteValue(route.searchFrom, route.searchTo),
  });

  return `/?${searchParams.toString()}#booking`;
}

export function getPopularRouteBySlug(slug: string) {
  return popularRoutes.find((route) => route.slug === slug);
}

function formatTripDateLabel(date: string | null, locale: Locale) {
  if (!date) {
    return locale === "en" ? "date to be confirmed" : "дату уточнюйте";
  }

  const parsedDate = new Date(`${date}T00:00:00`);

  if (Number.isNaN(parsedDate.getTime())) {
    return date;
  }

  return new Intl.DateTimeFormat(locale === "en" ? "en-GB" : "uk-UA", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(parsedDate);
}

function formatTripTimeLabel(trip: Trip, locale: Locale) {
  const dateLabel = formatTripDateLabel(trip.date, locale);
  const timeLabel = formatTripTimeValue(trip.departureTime, locale);

  return locale === "en"
    ? `Nearest trip: ${dateLabel} at ${timeLabel}`
    : `Найближчий рейс: ${dateLabel} о ${timeLabel}`;
}

function formatTripTimeValue(value: string | null, locale: Locale) {
  if (!value) {
    return locale === "en" ? "time to be confirmed" : "час уточнюйте";
  }

  const parsedDate = new Date(value);

  if (Number.isNaN(parsedDate.getTime())) {
    const timeMatch = value.match(/(\d{2}:\d{2})/);
    return timeMatch?.[1] ?? value;
  }

  return new Intl.DateTimeFormat(locale === "en" ? "en-GB" : "uk-UA", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(parsedDate);
}

export function mapTripToPopularRoute(trip: Trip, fallbackRoute?: PopularRoute): PopularRoute {
  const title = `${trip.from} — ${trip.to}`;
  const imageSrc = trip.imageSrc ?? "/BookingHero/main_photo_bus.png";
  const maxSeatsCandidate = trip.availableSeats ?? trip.totalSeats ?? 1;
  const departureTime = formatTripTimeValue(trip.departureTime, "uk");
  const arrivalTime = trip.arrivalTime ? formatTripTimeValue(trip.arrivalTime, "uk") : null;

  return {
    id: trip.id,
    slug: trip.slug ?? trip.id,
    searchFrom: trip.from,
    searchTo: trip.to,
    title: {
      uk: fallbackRoute?.title.uk ?? title,
      en: fallbackRoute?.title.en ?? title,
    },
    imageSrc: fallbackRoute?.imageSrc ?? imageSrc,
    imageAlt: {
      uk: fallbackRoute?.imageAlt.uk ?? `Рейс ${title}`,
      en: fallbackRoute?.imageAlt.en ?? `${title} route`,
    },
    nearestTripLabel: {
      uk: formatTripTimeLabel(trip, "uk"),
      en: formatTripTimeLabel(trip, "en"),
    },
    price: trip.price ?? 0,
    maxSeats: Math.max(1, maxSeatsCandidate),
    tripDate: trip.date,
    departureTime,
    arrivalTime,
    departureCity: fallbackRoute?.departureCity ?? localize(trip.from, trip.from),
    departureStop: fallbackRoute?.departureStop ?? localize("", ""),
    arrivalCity: fallbackRoute?.arrivalCity ?? localize(trip.to, trip.to),
    arrivalStop: fallbackRoute?.arrivalStop ?? localize("", ""),
  };
}
