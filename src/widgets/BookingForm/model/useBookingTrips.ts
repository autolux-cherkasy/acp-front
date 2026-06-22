"use client";

import {
  getDates,
  getRoutes,
  getTrips,
  RouteSegment,
  TripDate,
  TripSearchParams,
  type Trip,
} from "@/src/entities/trip";

import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { buildRouteValue, formatISODate, parseRouteValue } from "../lib/bookingForm.utils";

type UseBookingTripsParams = {
  selectedRoute: string;
  selectedDate: Date | null;
};

const TRIPS_KEY = "trips";
const ROUTES_KEY = "routes";
const DATES_KEY = "dates";

export function useBookingTrips({ selectedRoute, selectedDate }: UseBookingTripsParams) {
  const { from: fromStopId, to: toStopId } = parseRouteValue(selectedRoute);
  const params = useMemo<TripSearchParams>(
    () => ({
      fromStopId: fromStopId,
      toStopId: toStopId,
      date: selectedDate ? formatISODate(selectedDate) : undefined,
    }),
    [selectedRoute, selectedDate],
  );
  const {
    data: tripsData,
    isLoading: isTripsLoading,
    isError: isTripsError,
  } = useQuery<Trip[]>({
    queryKey: [TRIPS_KEY, params],
    queryFn: () => getTrips(params),
    staleTime: 1000 * 60,
    enabled: !!selectedRoute && !!selectedDate,
  });

  const { data: routesData, isLoading: isRoutesLoading } = useQuery<RouteSegment[]>({
    queryKey: [ROUTES_KEY],
    queryFn: getRoutes,
    staleTime: 1000 * 60 * 5,
  });

  const {
    data: datesData,
    isLoading: isDatesLoading,
    isError: isDatesError,
  } = useQuery<TripDate[]>({
    queryKey: [DATES_KEY, { fromStopId, toStopId }],
    queryFn: () => getDates({ fromStopId, toStopId }),
    staleTime: 1000 * 60 * 5,
    enabled: !!selectedRoute,
  });

  return {
    routeOptions: (routesData ?? []).map((route) => ({
      value: buildRouteValue(route.fromStopId, route.toStopId),
      from: route.from,
      to: route.to,
      label: `${route.from} — ${route.to}`,
    })),
    trips: tripsData ?? [],
    dates: datesData ?? [],
    fromStopId,
    toStopId,
    isDatesLoading,
    isTripsLoading,
    isRoutesLoading,
    isTripsError,
    isDatesError,
  };
}
