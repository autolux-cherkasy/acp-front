"use client";

import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";

import { getDates, getRoutes, getTrips } from "../api/trips";
import type { RouteSegment, Trip, TripDate, TripSearchParams } from "../model/types";
import { formatDateForApi } from "@/src/shared/lib/formatters";
import { buildRouteValue, parseRouteValue } from "./tripSelection.utils";

type UseTripSelectionParams = {
  selectedRoute: string;
  selectedDate: Date | null;
};

type UseRouteDatesParams = {
  fromStopId: string;
  toStopId: string;
};

const TRIPS_KEY = "trips";
const ROUTES_KEY = "routes";
const DATES_KEY = "dates";

/** Пари «зупинка — зупинка», за якими взагалі можна їхати. Спільний кеш на застосунок. */
export function useRouteSegments() {
  const { data, isLoading } = useQuery<RouteSegment[]>({
    queryKey: [ROUTES_KEY],
    queryFn: getRoutes,
    staleTime: 1000 * 60 * 5,
  });

  return { segments: data ?? [], isLoading };
}

/** Доби, на які для відрізка є рейси. Без пари id запит не має сенсу. */
export function useRouteDates({ fromStopId, toStopId }: UseRouteDatesParams) {
  const { data, isLoading, isError } = useQuery<TripDate[]>({
    queryKey: [DATES_KEY, { fromStopId, toStopId }],
    queryFn: () => getDates({ fromStopId, toStopId }),
    staleTime: 1000 * 60 * 5,
    enabled: !!fromStopId && !!toStopId,
  });

  return { dates: data ?? [], isLoading, isError };
}

export function useTripSelection({ selectedRoute, selectedDate }: UseTripSelectionParams) {
  const { from: fromStopId, to: toStopId } = parseRouteValue(selectedRoute);
  const params = useMemo<TripSearchParams>(
    () => ({
      fromStopId: fromStopId,
      toStopId: toStopId,
      date: selectedDate ? formatDateForApi(selectedDate) : undefined,
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

  const { segments, isLoading: isRoutesLoading } = useRouteSegments();

  const {
    dates,
    isLoading: isDatesLoading,
    isError: isDatesError,
  } = useRouteDates({ fromStopId, toStopId });

  return {
    routeOptions: segments.map((route) => ({
      value: buildRouteValue(route.fromStopId, route.toStopId),
      from: route.from,
      to: route.to,
      label: `${route.from} — ${route.to}`,
    })),
    trips: tripsData ?? [],
    dates,
    fromStopId,
    toStopId,
    isDatesLoading,
    isTripsLoading,
    isRoutesLoading,
    isTripsError,
    isDatesError,
  };
}
