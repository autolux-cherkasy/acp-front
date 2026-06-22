import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { getTripById, TripStop } from "@/src/entities/trip";
import TicketBookingScreen from "@/src/pages-layer/ticket-booking/ui/TicketBookingPage";
import { hasLocale } from "@/src/shared/i18n/config";
import { createPageMetadata, getSeoCopy, getTicketBookingSeo } from "@/src/shared/seo/metadata";

type PageProps = {
  params: Promise<{ locale: string; slug: string }>;
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

type TicketSelection = {
  tripId: string | null;
  seats: number;
  from: string | null;
  to: string | null;
  date: string | null;
  departureTime: string | null;
  arrivalTime: string | null;
  price: number | null;
  fromStopId: string | null;
  toStopId: string | null;
};

function getSingleValue(value: string | string[] | undefined) {
  return Array.isArray(value) ? (value[0] ?? null) : (value ?? null);
}

function parseSelection(
  searchParams?: Record<string, string | string[] | undefined>,
): TicketSelection {
  const seatsValue = Number(getSingleValue(searchParams?.seats));
  const priceValue = Number(getSingleValue(searchParams?.price));

  return {
    tripId: getSingleValue(searchParams?.tripId),
    seats: Number.isFinite(seatsValue) && seatsValue > 0 ? seatsValue : 1,
    from: getSingleValue(searchParams?.from),
    to: getSingleValue(searchParams?.to),
    date: getSingleValue(searchParams?.date),
    departureTime: getSingleValue(searchParams?.departureTime),
    arrivalTime: getSingleValue(searchParams?.arrivalTime),
    price: Number.isFinite(priceValue) ? priceValue : null,
    fromStopId: getSingleValue(searchParams?.fromStopId),
    toStopId: getSingleValue(searchParams?.toStopId),
  };
}

async function resolveRoute(slug: string, tripId: string | null) {
  try {
    const trip = await getTripById(tripId ?? slug);
    return trip;
  } catch {
    return null;
  }
}

export async function generateMetadata({ params, searchParams }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const selection = parseSelection(await searchParams);
  const trip = await resolveRoute(slug, selection.tripId);

  if (!trip) {
    const seo = getSeoCopy("uk");

    return createPageMetadata({
      locale: "uk",
      pathname: `/tickets/${slug}`,
      title: seo.notFound.title,
      description: seo.notFound.description,
      keywords: seo.notFound.keywords,
      noIndex: true,
    });
  }

  const routeSeo = getTicketBookingSeo(`${trip?.from} - ${trip?.to}`);

  return createPageMetadata({
    locale: "uk",
    pathname: `/tickets/${slug}`,
    title: routeSeo.title,
    description: routeSeo.description,
    keywords: routeSeo.keywords,
  });
}

export default async function TicketBookingRoutePage({ params, searchParams }: PageProps) {
  const { locale, slug } = await params;

  if (!hasLocale(locale)) {
    notFound();
  }

  const selection = parseSelection(await searchParams);
  const trip = await resolveRoute(slug, selection.tripId);
  if (!trip) notFound();

  const boardingStop: TripStop | undefined = trip.stops.find((s) => s.id === selection.fromStopId);
  const alightingStop: TripStop | undefined = trip.stops.find((s) => s.id === selection.toStopId);

  return (
    <TicketBookingScreen
      trip={trip}
      initialSeats={selection.seats}
      boardingStop={boardingStop}
      alightingStop={alightingStop}
      departureTime={selection.departureTime}
      arrivalTime={selection.arrivalTime}
    />
  );
}
