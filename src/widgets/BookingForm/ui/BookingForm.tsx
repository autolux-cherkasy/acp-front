"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { getTripAvailability } from "@/src/entities/trip";
import { useI18n, useLocalizedHref } from "@/src/shared/i18n/I18nProvider";
import styles from "./BookingForm.module.css";
import { EMPTY_TRIPS, type BookingFormProps } from "../model/types";
import { useBookingTrips } from "../model/useBookingTrips";
import BookingStatus from "./controls/BookingStatus";
import DateField from "./controls/DateField";
import PriceField from "./controls/PriceField";
import SelectField from "@/src/shared/ui/SelectField/SelectField";
import SeatsSelect from "./controls/SeatsSelect";
import TripTimeSelect from "./controls/TripTimeSelect";
import Button from "@/src/shared/ui/Button/Button";

export default function BookingForm({ initialTrips = EMPTY_TRIPS }: BookingFormProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const resolveHref = useLocalizedHref();
  const { lang, t, raw } = useI18n();
  const timeLocale = lang === "en" ? "en-GB" : "uk-UA";
  const preselectedRouteValue = searchParams.get("route")?.trim() ?? "";

  const [date, setDate] = useState<Date | null>(null);
  const [selectedRouteValue, setSelectedRouteValue] = useState(preselectedRouteValue);
  const [seatsValue, setSeatsValue] = useState("1");
  const [isCheckingAvailability, setIsCheckingAvailability] = useState(false);
  const [isPendingNavigation, startNavigation] = useTransition();

  const seats = useMemo(() => {
    const parsedSeats = Number(seatsValue);
    return Number.isFinite(parsedSeats) && parsedSeats > 0 ? parsedSeats : 1;
  }, [seatsValue]);

  const months = raw("bookingForm.calendar.months") as string[];
  const weekdays = raw("bookingForm.calendar.weekdays") as string[];
  const {
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
  } = useBookingTrips({
    initialTrips,
    selectedRouteValue,
    date,
    seats,
    t,
  });
  const priceFormatter = useMemo(
    () =>
      new Intl.NumberFormat(lang === "en" ? "en-US" : "uk-UA", {
        maximumFractionDigits: 0,
      }),
    [lang],
  );
  const priceText = selectedTrip?.price != null ? priceFormatter.format(selectedTrip.price) : "";
  const isBusy = isBootstrapping || isSearchingTrips || isCheckingAvailability || isPendingNavigation;

  useEffect(() => {
    if (!preselectedRouteValue) {
      return;
    }

    setSelectedRouteValue((currentValue) => (
      currentValue === preselectedRouteValue ? currentValue : preselectedRouteValue
    ));
    setDate(null);
    setSeatsValue("1");
  }, [preselectedRouteValue]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!selectedTrip) {
      setStatusMessage(t("bookingForm.status.selectTrip"));
      setIsError(true);
      return;
    }

    setIsCheckingAvailability(true);
    setStatusMessage("");
    setIsError(false);

    try {
      const availability = await getTripAvailability(selectedTrip.id, seats);

      const hasEnoughSeats =
        availability.canReserve ??
        (availability.availableSeats == null || availability.availableSeats >= seats);

      if (!hasEnoughSeats) {
        setStatusMessage(t("bookingForm.status.seatsUnavailable"));
        setIsError(true);
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

        if (selectedTrip.departureTime) {
          searchParams.set("departureTime", selectedTrip.departureTime);
        }

        if (selectedTrip.arrivalTime) {
          searchParams.set("arrivalTime", selectedTrip.arrivalTime);
        }

        if (selectedTrip.price != null) {
          searchParams.set("price", String(selectedTrip.price));
        }

        router.push(resolveHref(`/tickets/${selectedTrip.slug ?? selectedTrip.id}?${searchParams}`));
      });
    } catch (error) {
      setStatusMessage(
        error instanceof Error && error.message
          ? error.message
          : t("bookingForm.status.availabilityError"),
      );
      setIsError(true);
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
            value={selectedRouteValue}
            options={routeOptions}
            placeholder={t("bookingForm.route.placeholder")}
            disabled={isBootstrapping || routeOptions.length === 0}
            onChange={setSelectedRouteValue}
          />

          <DateField
            value={date}
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
            disabled={!selectedRouteValue || isSearchingTrips || timeOptions.length === 0}
          />

          <div className={styles.row2}>
            <SeatsSelect
              value={seatsValue}
              placeholder={t("bookingForm.qty.placeholder")}
              onChange={setSeatsValue}
            />

            <PriceField
              placeholder={t("bookingForm.price.placeholder")}
              value={priceText}
            />
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
            disabled={isBusy || !selectedTrip}
            onClick={() => {}}
          />
        </div>
      </form>
    </div>
  );
}
