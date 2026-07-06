"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState, useTransition } from "react";

import { getTripAvailability } from "@/src/entities/trip";
import { useI18n, useLocalizedHref } from "@/src/shared/i18n/I18nProvider";
import { useBookingStore } from "@/src/shared/store/BookingStore";
import Button from "@/src/shared/ui/Button/Button";
import SelectField from "@/src/shared/ui/SelectField/SelectField";
import { sortTripsByTime } from "../lib/bookingForm.utils";
import { useBookingTrips } from "../model/useBookingTrips";
import styles from "./BookingForm.module.css";
import BookingStatus from "./controls/BookingStatus";
import DateField from "./controls/DateField";
import PriceField from "./controls/PriceField";
import SeatsSelect from "./controls/SeatsSelect";
import TripTimeSelect from "./controls/TripTimeSelect";

export default function BookingForm() {
  const router = useRouter();
  const resolveHref = useLocalizedHref();
  const { lang, t, raw } = useI18n();
  const timeLocale = lang === "en" ? "en-GB" : "uk-UA";

  const [selectedDate, setDate] = useState<Date | null>(null);
  const [selectedRoute, setSelectedRoute] = useState("");
  const [selectedTripId, setSelectedTripId] = useState<string>("");
  const [seatsValue, setSeatsValue] = useState("1");
  const [isCheckingAvailability, setIsCheckingAvailability] = useState(false);
  const [isPendingNavigation, startNavigation] = useTransition();
  const [submitError, setSubmitError] = useState<string | null>(null);
  const selectedPopularRoute = useBookingStore((s) => s.selectedRoute);
  const clearPopularRoute = useBookingStore((s) => s.setSelectedRoute);

  const seats = useMemo(() => {
    const parsedSeats = Number(seatsValue);
    return Number.isFinite(parsedSeats) && parsedSeats > 0 ? parsedSeats : 1;
  }, [seatsValue]);

  const months = raw("bookingForm.calendar.months") as string[];
  const weekdays = raw("bookingForm.calendar.weekdays") as string[];
  const {
    routeOptions,
    trips,
    dates,
    isDatesLoading,
    isTripsLoading,
    isRoutesLoading,
    isTripsError,
    isDatesError,
    fromStopId,
    toStopId,
  } = useBookingTrips({
    selectedRoute,
    selectedDate,
  });
  const availableDateKeys = useMemo(() => dates.map((d) => d.date), [dates]);
  const timeOptions = useMemo(() => sortTripsByTime(trips), [trips]);
  const selectedTrip = useMemo(
    () => timeOptions.find((trip) => trip.id === selectedTripId) ?? null,
    [timeOptions, selectedTripId],
  );

  useEffect(() => {
    if (!selectedTrip) return;
    router.prefetch(resolveHref(`/tickets/${selectedTrip.slug ?? selectedTrip.id}`));
  }, [router, resolveHref, selectedTrip]);

  const isBootstrapping = isRoutesLoading || isDatesLoading || isTripsLoading;
  const statusMessage =
    isTripsError || isDatesError ? t("bookingForm.status.loadError") : (submitError ?? "");
  const isError = isTripsError || isDatesError || !!submitError;
  const priceFormatter = useMemo(
    () =>
      new Intl.NumberFormat(lang === "en" ? "en-US" : "uk-UA", {
        maximumFractionDigits: 0,
      }),
    [lang],
  );
  const priceText =
    selectedTrip?.price != null ? priceFormatter.format(selectedTrip.price * seats) : "";
  const isBusy = isBootstrapping || isCheckingAvailability || isPendingNavigation;

  function normalize(name: string) {
    return name
      .toLowerCase()
      .replace(/^(ст\.м\.|м\.|с\.)/, "")
      .trim();
  }

  useEffect(() => {
    if (!selectedPopularRoute || routeOptions.length === 0) return;
    const [from, to] = selectedPopularRoute.split("__");
    const match = routeOptions.find(
      (route) => normalize(route.from) === normalize(from) && normalize(route.to) === normalize(to),
    );
    const set = (match: (typeof routeOptions)[number]) => {
      setSelectedRoute(match.value);
    };
    if (match) {
      clearPopularRoute("");
      set(match);
    } else {
      console.log(selectedPopularRoute);
      console.log("shit");
    }
  }, [selectedPopularRoute, routeOptions]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!selectedTrip) {
      setSubmitError(t("bookingForm.status.selectTrip"));
      return;
    }

    setIsCheckingAvailability(true);
    setSubmitError(null);

    try {
      const availability = await getTripAvailability(selectedTrip.id, seats);

      const hasEnoughSeats =
        availability.canReserve ??
        (availability.availableSeats == null || availability.availableSeats >= seats);

      if (!hasEnoughSeats) {
        setSubmitError(t("bookingForm.status.seatsUnavailable"));
        return;
      }

      startNavigation(() => {
        const searchParams = new URLSearchParams({
          tripId: selectedTrip.id,
          seats: String(seats),
          from: selectedTrip.from,
          to: selectedTrip.to,
        });

        if (selectedTrip.date) {
          searchParams.set("date", selectedTrip.date);
        }
        searchParams.set("fromStopId", fromStopId);
        searchParams.set("toStopId", toStopId);

        if (selectedTrip.departureTime) {
          searchParams.set("departureTime", selectedTrip.departureTime);
        }

        if (selectedTrip.arrivalTime) {
          searchParams.set("arrivalTime", selectedTrip.arrivalTime);
        }

        if (selectedTrip.price != null) {
          searchParams.set("price", String(selectedTrip.price));
        }

        router.push(
          resolveHref(`/tickets/${selectedTrip.slug ?? selectedTrip.id}?${searchParams}`),
        );
      });
    } catch (error) {
      setSubmitError(
        error instanceof Error && error.message
          ? error.message
          : t("bookingForm.status.availabilityError"),
      );
    } finally {
      setIsCheckingAvailability(false);
    }
  };

  return (
    <div className={styles.card}>
      <div className={styles.cardTitle}>{t("bookingForm.title")}</div>

      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.inputBlock}>
          <SelectField
            value={selectedRoute}
            options={routeOptions}
            placeholder={t("bookingForm.route.placeholder")}
            disabled={isBootstrapping || routeOptions.length === 0}
            onChange={setSelectedRoute}
          />

          <DateField
            value={selectedDate}
            onChange={setDate}
            placeholder={t("bookingForm.date.placeholder")}
            months={months}
            weekdays={weekdays}
            availableDateKeys={availableDateKeys}
          />

          <TripTimeSelect
            value={selectedTripId}
            onChange={setSelectedTripId}
            options={timeOptions}
            locale={timeLocale}
            placeholder={t("bookingForm.time.placeholder")}
            disabled={!selectedRoute || isTripsLoading || timeOptions.length === 0}
          />

          <div className={styles.row2}>
            <SeatsSelect
              availableSeats={
                trips.find((i) => i.id === selectedTripId)?.availableSeats ?? undefined
              }
              value={seatsValue}
              placeholder={t("bookingForm.qty.placeholder")}
              onChange={setSeatsValue}
            />

            <PriceField placeholder={t("bookingForm.price.placeholder")} value={priceText} />
          </div>
        </div>

        <BookingStatus
          statusMessage={statusMessage}
          isError={isError}
          isBootstrapping={isBootstrapping}
          loadingText={t("bookingForm.status.loading")}
        />

        <div className={styles.primaryBtnWrap}>
          <Button
            text={isBusy ? t("bookingForm.buttons.loading") : t("bookingForm.buttons.continue")}
            type="submit"
            size="full"
            disabled={isBusy || !selectedTrip}
            onClick={() => {}}
          />
        </div>
      </form>
    </div>
  );
}
