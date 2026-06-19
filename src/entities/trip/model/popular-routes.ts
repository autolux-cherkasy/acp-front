import type { Trip } from "./types";

const CHERKASY = "Черкаси";
const KYIV = "Київ";
const KHARKIV = "Харків";
const POLTAVA = "Полтава";
const KREMENCHUK = "Кременчук";
const PEREIASLAV = "Переяслав";
const KHARKIVSKA = "Харківська";
const CHERNIHIVSKA = "Чернігівська";
const ST_M_KHARKIVSKA = `(ст.м.${KHARKIVSKA})`;
const ST_M_CHERNIHIVSKA = `(ст.м.${CHERNIHIVSKA})`;
const KYIV_KHARKIVSKA = `${KYIV} (${KHARKIVSKA})`;
const KYIV_CHERNIHIVSKA = `${KYIV} (${CHERNIHIVSKA})`;

const M_CHERKASY = `м.${CHERKASY}`;
const M_KYIV = `м.${KYIV}`;
const M_KHARKIV = `м.${KHARKIV}`;
const M_POLTAVA = `м.${POLTAVA}`;
const M_KREMENCHUK = `м.${KREMENCHUK}`;
const M_PEREIASLAV = `м.${PEREIASLAV}`;

export type PopularRoute = {
  id: string;
  searchFrom: string;
  searchTo: string;
  title: string;
  imageSrc: string;
  imageAlt: string;
};

export const popularRoutes: PopularRoute[] = [
  {
    id: "1",
    searchFrom: CHERKASY,
    searchTo: KYIV_KHARKIVSKA,
    title: `${M_CHERKASY} — ${M_KYIV} ${ST_M_KHARKIVSKA}`,
    imageSrc: "/Routes/cherkasy-kyiv-kharkivska.jpg",
    imageAlt: `Рейс ${CHERKASY}-${KYIV} ${ST_M_KHARKIVSKA}`,
  },
  {
    id: "2",
    searchFrom: CHERKASY,
    searchTo: KYIV_CHERNIHIVSKA,
    title: `${M_CHERKASY} — ${M_KYIV} ${ST_M_CHERNIHIVSKA}`,
    imageSrc: "/Routes/cherkasy-kyiv-chernihivska.png",
    imageAlt: `Рейс ${CHERKASY}-${KYIV} ${ST_M_CHERNIHIVSKA}`,
  },
  {
    id: "3",
    searchFrom: KYIV_KHARKIVSKA,
    searchTo: CHERKASY,
    title: `${M_KYIV} ${ST_M_KHARKIVSKA} — ${M_CHERKASY}`,
    imageSrc: "/Routes/kyiv-kharkivska-cherkasy.png",
    imageAlt: `Рейс ${KYIV} ${ST_M_KHARKIVSKA}-${CHERKASY}`,
  },
  {
    id: "4",
    searchFrom: KYIV_CHERNIHIVSKA,
    searchTo: CHERKASY,
    title: `${M_KYIV} ${ST_M_CHERNIHIVSKA} — ${M_CHERKASY}`,
    imageSrc: "/Routes/kyiv-chernihivska-cherkasy.jpg",
    imageAlt: `Рейс ${KYIV} ${ST_M_CHERNIHIVSKA}-${CHERKASY}`,
  },
  {
    id: "5",
    searchFrom: CHERKASY,
    searchTo: KHARKIV,
    title: `${M_CHERKASY} — ${M_KHARKIV}`,
    imageSrc: "/Routes/cherkasy-kharkiv.png",
    imageAlt: `Рейс ${CHERKASY}-${KHARKIV}`,
  },
  {
    id: "6",
    searchFrom: CHERKASY,
    searchTo: POLTAVA,
    title: `${M_CHERKASY} — ${M_POLTAVA}`,
    imageSrc: "/Routes/cherkasy-poltava.png",
    imageAlt: `Рейс ${CHERKASY}-${POLTAVA}`,
  },
  {
    id: "7",
    searchFrom: CHERKASY,
    searchTo: KREMENCHUK,
    title: `${M_CHERKASY} — ${M_KREMENCHUK}`,
    imageSrc: "/Routes/cherkasy-kremenchuk.jpg",
    imageAlt: `Рейс ${CHERKASY}-${KREMENCHUK}`,
  },
  {
    id: "8",
    searchFrom: PEREIASLAV,
    searchTo: KYIV,
    title: `${M_PEREIASLAV} — ${M_KYIV}`,
    imageSrc: "/Routes/pereiaslav-kyiv.png",
    imageAlt: `Рейс ${PEREIASLAV}-${KYIV}`,
  },
];

export function mapTripToPopularRoute(trip: Trip, fallbackRoute?: PopularRoute): PopularRoute {
  const title = `${trip.from} — ${trip.to}`;
  const imageSrc = trip.imageSrc ?? "/BookingHero/main_photo_bus.png";

  return {
    id: trip.id,
    searchFrom: trip.from,
    searchTo: trip.to,
    title: fallbackRoute?.title ?? title,
    imageSrc: fallbackRoute?.imageSrc ?? imageSrc,
    imageAlt: fallbackRoute?.imageAlt ?? `Рейс ${title}`,
  };
}
