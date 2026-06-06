"use client";

import { useEffect, useMemo, useState } from "react";

import { getTrips, type Trip } from "@/src/entities/trip";

import {
  buildRouteOptions,
  formatISODate,
  parseRouteValue,
  sortTripsByTime,
} from "../lib/bookingForm.utils";
import type { BookingTranslateFn } from "./types";

type UseBookingTripsParams = {
  initialTrips: Trip[];
  selectedRouteValue: string;
  date: Date | null;
  seats: number;
  t: BookingTranslateFn;
};

function normalizeTripDateKey(trip: Trip) {
  if (trip.date) {
    return trip.date;
  }

  if (trip.departureTime) {
    const directMatch = trip.departureTime.match(/^(\d{4}-\d{2}-\d{2})/);
    if (directMatch) {
      return directMatch[1];
    }

    const parsedDate = new Date(trip.departureTime);
    if (!Number.isNaN(parsedDate.getTime())) {
      const year = parsedDate.getFullYear();
      const month = String(parsedDate.getMonth() + 1).padStart(2, "0");
      const day = String(parsedDate.getDate()).padStart(2, "0");

      return `${year}-${month}-${day}`;
    }
  }

  return null;
}

function buildAvailableDateKeys(trips: Trip[]) {
  return [...new Set(
    trips
      .map(normalizeTripDateKey)
      .filter((dateKey): dateKey is string => Boolean(dateKey)),
  )].sort();
}

export function useBookingTrips({
  initialTrips,
  selectedRouteValue,
  date,
  seats,
  t,
}: UseBookingTripsParams) {
  const [allTrips, setAllTrips] = useState<Trip[]>(initialTrips);
  const [matchingTrips, setMatchingTrips] = useState<Trip[]>([]);
  const [selectedTripId, setSelectedTripId] = useState("");
  const [statusMessage, setStatusMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [isBootstrapping, setIsBootstrapping] = useState(initialTrips.length === 0);
  const [isSearchingTrips, setIsSearchingTrips] = useState(false);
  const [availableDateKeys, setAvailableDateKeys] = useState<string[]>([]);

  const routeOptions = useMemo(() => buildRouteOptions(allTrips), [allTrips]);
  const selectedRouteOption = useMemo(
    () => routeOptions.find((routeOption) => routeOption.value === selectedRouteValue) ?? null,
    [routeOptions, selectedRouteValue],
  );
  const timeOptions = useMemo(() => sortTripsByTime(matchingTrips), [matchingTrips]);
  const selectedTrip = useMemo(
    () => timeOptions.find((trip) => trip.id === selectedTripId) ?? null,
    [selectedTripId, timeOptions],
  );

  useEffect(() => {
    if (initialTrips.length > 0) {
      const set = () => {
        setAllTrips(initialTrips);
        setIsBootstrapping(false);
      };
      set();
      return;
    }

    let isCancelled = false;

    const loadTrips = async () => {
      setIsBootstrapping(true);
      setStatusMessage("");
      setIsError(false);

      try {
        const trips = await getTrips();

        if (isCancelled) {
          return;
        }

        setAllTrips(trips);

        if (trips.length === 0) {
          setStatusMessage(t("bookingForm.status.empty"));
        }
      } catch (error) {
        if (isCancelled) {
          return;
        }

        setStatusMessage(
          error instanceof Error && error.message
            ? error.message
            : t("bookingForm.status.loadError"),
        );
        setIsError(true);
      } finally {
        if (!isCancelled) {
          setIsBootstrapping(false);
        }
      }
    };

    void loadTrips();

    return () => {
      isCancelled = true;
    };
  }, [initialTrips, t]);

  useEffect(() => {
    if (!selectedRouteValue) {
      const set = () => {
        setAvailableDateKeys([]);
      };
      set();
      return;
    }

    let isCancelled = false;
    const { from, to } = parseRouteValue(selectedRouteValue);

    const loadAvailableDates = async () => {
      try {
        const trips = await getTrips({
          from,
          to,
          seats,
        });

        if (isCancelled) {
          return;
        }

        setAvailableDateKeys(buildAvailableDateKeys(trips));
      } catch {
        if (!isCancelled) {
          setAvailableDateKeys([]);
        }
      }
    };

    void loadAvailableDates();

    return () => {
      isCancelled = true;
    };
  }, [seats, selectedRouteValue]);

  useEffect(() => {
    if (!selectedRouteValue) {
      const set = () => {
        setMatchingTrips([]);
        setSelectedTripId("");
        if (!isBootstrapping && routeOptions.length > 0) {
          setStatusMessage("");
          setIsError(false);
        }
      };
      set();
      return;
    }

    let isCancelled = false;
    const { from, to } = parseRouteValue(selectedRouteValue);
    const selectedDateKey = date ? formatISODate(date) : null;

    const loadMatchingTrips = async () => {
      setIsSearchingTrips(true);
      setStatusMessage("");
      setIsError(false);

      try {
        const trips = await getTrips({
          from,
          to,
          date: selectedDateKey ?? undefined,
          seats,
        });

        if (isCancelled) {
          return;
        }

        const sortedTrips = sortTripsByTime(trips);
        setMatchingTrips(sortedTrips);
        setSelectedTripId((currentTripId) => (
          sortedTrips.some((trip) => trip.id === currentTripId)
            ? currentTripId
            : (sortedTrips[0]?.id ?? "")
        ));

        if (sortedTrips.length === 0) {
          setStatusMessage(t("bookingForm.status.noTrips"));
        }
      } catch (error) {
        if (isCancelled) {
          return;
        }

        setMatchingTrips([]);
        setSelectedTripId("");
        setStatusMessage(
          error instanceof Error && error.message
            ? error.message
            : t("bookingForm.status.searchError"),
        );
        setIsError(true);
      } finally {
        if (!isCancelled) {
          setIsSearchingTrips(false);
        }
      }
    };

    void loadMatchingTrips();

    return () => {
      isCancelled = true;
    };
  }, [date, isBootstrapping, routeOptions.length, seats, selectedRouteValue, t]);

  return {
    routeOptions,
    selectedRouteOption,
    timeOptions,
    selectedTrip,
    selectedTripId,
    setSelectedTripId,
    statusMessage,
    setStatusMessage,
    isError,
    setIsError,
    isBootstrapping,
    isSearchingTrips,
    availableDateKeys,
  };
}
