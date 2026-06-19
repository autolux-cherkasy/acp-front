import type { Trip } from "./types";

const CHERKASY = "Черкаси";
const KYIV = "Київ";
const KHARKIV = "Харків";
const POLTAVA = "Полтава";
const KREMENCHUK = "Кременчук";
const PEREIASLAV = "Переяслав";

const M_CHERKASY = `м.${CHERKASY}`;
const M_KYIV = `м.${KYIV}`;
const M_KHARKIV = `м.${KHARKIV}`;
const M_POLTAVA = `м.${POLTAVA}`;
const M_KREMENCHUK = `м.${KREMENCHUK}`;
const M_PEREIASLAV = `м.${PEREIASLAV}`;

export type PopularRoute = {
  id: string;
  slug: string;
  searchFrom: string;
  searchTo: string;
  title: string;
  imageSrc: string;
  imageAlt: string;
};

export const popularRoutes: PopularRoute[] = [
  {
    id: "1",
    slug: "cherkasy-kyiv-kharkivska",
    searchFrom: CHERKASY,
    searchTo: KYIV,
    title: `${M_CHERKASY} — ${M_KYIV} (ст.м.Харківська)`,
    imageSrc: "/Routes/cherkasy-kyiv-kharkivska.jpg",
    imageAlt: `Рейс ${CHERKASY}-${KYIV} Харківська`,
  },
  {
    id: "2",
    slug: "cherkasy-kyiv-chernihivska",
    searchFrom: CHERKASY,
    searchTo: KYIV,
    title: `${M_CHERKASY} — ${M_KYIV} (ст.м.Чернігівська)`,
    imageSrc: "/Routes/cherkasy-kyiv-chernihivska.png",
    imageAlt: `Рейс ${CHERKASY}-${KYIV} Чернігівська`,
  },
  {
    id: "3",
    slug: "kyiv-kharkivska-cherkasy",
    searchFrom: KYIV,
    searchTo: CHERKASY,
    title: `${M_KYIV} (ст.м.Харківська) — ${M_CHERKASY}`,
    imageSrc: "/Routes/kyiv-kharkivska-cherkasy.png",
    imageAlt: `Рейс ${KYIV} Харківська-${CHERKASY}`,
  },
  {
    id: "4",
    slug: "kyiv-chernihivska-cherkasy",
    searchFrom: KYIV,
    searchTo: CHERKASY,
    title: `${M_KYIV} (ст.м.Чернігівська) — ${M_CHERKASY}`,
    imageSrc: "/Routes/kyiv-chernihivska-cherkasy.jpg",
    imageAlt: `Рейс ${KYIV} Чернігівська-${CHERKASY}`,
  },
  {
    id: "5",
    slug: "cherkasy-kharkiv",
    searchFrom: CHERKASY,
    searchTo: KHARKIV,
    title: `${M_CHERKASY} — ${M_KHARKIV}`,
    imageSrc: "/Routes/cherkasy-kharkiv.png",
    imageAlt: `Рейс ${CHERKASY}-${KHARKIV}`,
  },
  {
    id: "6",
    slug: "cherkasy-poltava",
    searchFrom: CHERKASY,
    searchTo: POLTAVA,
    title: `${M_CHERKASY} — ${M_POLTAVA}`,
    imageSrc: "/Routes/cherkasy-poltava.png",
    imageAlt: `Рейс ${CHERKASY}-${POLTAVA}`,
  },
  {
    id: "7",
    slug: "cherkasy-kremenchuk",
    searchFrom: CHERKASY,
    searchTo: KREMENCHUK,
    title: `${M_CHERKASY} — ${M_KREMENCHUK}`,
    imageSrc: "/Routes/cherkasy-kremenchuk.jpg",
    imageAlt: `Рейс ${CHERKASY}-${KREMENCHUK}`,
  },
  {
    id: "8",
    slug: "pereiaslav-kyiv",
    searchFrom: PEREIASLAV,
    searchTo: KYIV,
    title: `${M_PEREIASLAV} — ${M_KYIV}`,
    imageSrc: "/Routes/pereiaslav-kyiv.png",
    imageAlt: `Рейс ${PEREIASLAV}-${KYIV}`,
  },
];

function buildSearchRouteValue(from: string, to: string) {
  return `${from}__${to}`;
}

export function getPopularRouteHref(route: Pick<PopularRoute, "searchFrom" | "searchTo">) {
  const searchParams = new URLSearchParams({
    route: buildSearchRouteValue(route.searchFrom, route.searchTo),
  });

  return `/?${searchParams.toString()}#booking`;
}

export function mapTripToPopularRoute(trip: Trip, fallbackRoute?: PopularRoute): PopularRoute {
  const title = `${trip.from} — ${trip.to}`;
  const imageSrc = trip.imageSrc ?? "/BookingHero/main_photo_bus.png";

  return {
    id: trip.id,
    slug: trip.slug ?? trip.id,
    searchFrom: trip.from,
    searchTo: trip.to,
    title: fallbackRoute?.title ?? title,
    imageSrc: fallbackRoute?.imageSrc ?? imageSrc,
    imageAlt: fallbackRoute?.imageAlt ?? `Рейс ${title}`,
  };
}
