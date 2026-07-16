"use client";

import {useEffect, useMemo} from "react";
import { useForm } from "react-hook-form";
import MiniCalendar from "@/src/widgets/MiniCalendar/MiniCalendar";
import { useClickOutside } from "@/src/shared/lib/useClickOutside";
import {createAdminBooking, updateAdminBooking} from "@/src/entities/ticket";
import type { TicketStatus } from "@/src/entities/ticket";
import { useI18n } from "@/src/shared/i18n/I18nProvider";
import Button from "@/src/shared/ui/Button/Button";
import ModalFrame from "@/src/shared/ui/ModalFrame/ModalFrame";
import InputWithLabel from "@/src/shared/ui/InputWithLabel/InputWithLabel";
import styles from "./NewOrderModal.module.css";
import AdminModalHeader from "@/src/shared/ui/AdminModalHeader/AdminModalHeader";
import {useQuery,useQueryClient} from "@tanstack/react-query";
import {getAdminRoutes, getAdminTrips} from "@/src/entities/ticket/model/api";
import SelectWithLabel from "@/src/shared/ui/SelectField/SelectWithLabel";

type Props = {
  onClose: () => void;
  nextBookingNumber: number;
  routeInfo?: EditOrderInfo;
};

type FormState = {
  routeId: string;
  tripId: string;
  boardingStopId: string;
  alightingStopId: string;
  passengerName: string;
  passengerPhone: string;
  route: string;
  date: string;
  departureTime: string;
  ticketCount: string;
  totalPrice: string;
  status: TicketStatus;
  bookingId?: string;
  bookingNumber?: string;
};

type EditOrderInfo = {
  bookingId: string;
  bookingNumber: string;
  passengerName: string;
  passengerPhone: string;
  route: string;
  date: string;
  departureTime: string;
  ticketCount: string;
  totalPrice: string;
  status: TicketStatus;
};

function getLocalDateKey(value: string | Date): string {
  const date = value instanceof Date ? value : new Date(value);

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

export default function NewOrderModal({ onClose, nextBookingNumber, routeInfo }: Props) {
  const { t } = useI18n();
  const queryClient = useQueryClient();
  const {
    isOpen: showCalendar,
    setIsOpen: setShowCalendar,
    fieldRef: calendarRef,
  } = useClickOutside()

  const { data: routes = [] } = useQuery({
    queryKey: ["admin-routes"],
    queryFn: getAdminRoutes,
  })

  const { data: tripsResponse } = useQuery({
    queryKey: ["admin-trips"],
    queryFn: () =>
        getAdminTrips({
          page: 1,
          limit: 1000,
          sortBy: "departureTime",
          sortOrder: "asc",
          status: "SCHEDULED",
        }),
  })

  useEffect(() => {
    document.body.style.overflow = "hidden";

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !showCalendar) {
        onClose();
      }
    }

    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    }
  }, [onClose, showCalendar])

  const { register, setValue, watch, handleSubmit, control } = useForm<FormState>({
    defaultValues: {
      passengerName: routeInfo?.passengerName ?? "",
      passengerPhone: routeInfo?.passengerPhone ?? "",
      route: routeInfo?.route ?? "",
      date: routeInfo?.date ?? "",
      departureTime: routeInfo?.departureTime ?? "",
      ticketCount: routeInfo?.ticketCount ?? "1",
      totalPrice: routeInfo?.totalPrice ?? "0",
      status: routeInfo?.status ?? "reserved",
      bookingId: routeInfo?.bookingId,
      bookingNumber: routeInfo?.bookingNumber,
      routeId: "",
      tripId: "",
      boardingStopId: "",
      alightingStopId: "",
    },
  })

  const status = watch("status");
  const dateValue = watch("date");
  const selectedRouteId = watch("routeId");
  const selectedTripId = watch("tripId");

  const selectedRoute =
      routes.find((route) => route.id === selectedRouteId) ?? null;

  const orderedRouteStops = useMemo(() => {
    return [...(selectedRoute?.stops ?? [])].sort(
        (a, b) => a.stopOrder - b.stopOrder,
    );
  }, [selectedRoute]);

  const boardingStop = orderedRouteStops[0] ?? null;

  const alightingStop =
      orderedRouteStops[orderedRouteStops.length - 1] ?? null;

  const trips = useMemo(
      () => tripsResponse?.trips ?? [],
      [tripsResponse],
  );

  const selectedDateForApi = useMemo(() => {
    if (!dateValue) return "";

    const [day, month, year] = dateValue.split(".");

    if (!day || !month || !year) return "";

    return `${year}-${month}-${day}`;
  }, [dateValue]);

  const futureRouteTrips = useMemo(() => {
    if (!selectedRouteId) return [];

    const now = Date.now();

    return trips.filter(
        (trip) =>
            trip.routeId === selectedRouteId &&
            new Date(trip.departureTime).getTime() > now &&
            !trip.isFull,
    );
  }, [trips, selectedRouteId]);

  const availableDateKeys = useMemo(
      () =>
          new Set(
              futureRouteTrips.map((trip) =>
                  getLocalDateKey(trip.departureTime),
              ),
          ),
      [futureRouteTrips],
  );

  const availableTrips = useMemo(() => {
    if (!selectedDateForApi) return [];

    return futureRouteTrips.filter(
        (trip) =>
            getLocalDateKey(trip.departureTime) === selectedDateForApi,
    );
  }, [futureRouteTrips, selectedDateForApi]);

  const selectedTrip =
      availableTrips.find((trip) => trip.id === selectedTripId) ?? null;

  const parsedDate = useMemo(() => {
    if (!dateValue) return null
    const parts = dateValue.split(".")
    if (parts.length !== 3) return null
    const [d, m, y] = parts.map(Number)
    if (!d || !m || !y || isNaN(d) || isNaN(m) || isNaN(y)) return null
    const date = new Date(y, m - 1, d)
    return isNaN(date.getTime()) ? null : date
  }, [dateValue])

  const isEditMode = routeInfo !== undefined

  const bookingNumberStr = routeInfo?.bookingNumber ?? String(nextBookingNumber).padStart(6, "0")
  const modalTitle = isEditMode
    ? t("dispatcherArea.tickets.modal.editOrderTitle")
    : t("dispatcherArea.tickets.modal.newOrderTitle")

  async function onSubmit(data: FormState) {
    if (!data.tripId) {
      console.warn("Рейс не вибрано");
      return;
    }

    if (!boardingStop || !alightingStop) {
      console.warn(
          "Для маршруту не знайдено початкову або кінцеву зупинку",
      );
      return;
    }

    const ticketsCount = Number(data.ticketCount);

    if (!ticketsCount || ticketsCount < 1) {
      console.warn("Кількість квитків повинна бути більшою за 0");
      return;
    }

    if (
        !selectedTrip ||
        new Date(selectedTrip.departureTime).getTime() <= Date.now()
    ) {
      console.warn("Неможливо створити замовлення на минулий рейс");
      return;
    }

    const createdBooking = await createAdminBooking({
      customerData: {
        name: data.passengerName.trim(),
        phone: data.passengerPhone.trim(),
      },
      tripId: data.tripId,
      boardingStopId: boardingStop.id,
      alightingStopId: alightingStop.id,
      ticketsCount,
    });

    if (data.status === "completed") {
      await updateAdminBooking(createdBooking.id, {
        status: "CONFIRMED",
        tickets: [
          {
            ticketId: "base",
            ticketsCount,
            unitPrice: createdBooking.totalPrice / ticketsCount,
          },
        ],
        customerData: {
          name: createdBooking.passengerName,
          phone: createdBooking.passengerPhone,
        },
        totalPrice: createdBooking.totalPrice,
      });
    }

    await queryClient.invalidateQueries({
      queryKey: ["admin-bookings"],
    });

    onClose();
  }

  useEffect(() => {
    if (isEditMode) return;

    setValue("date", "");
    setValue("tripId", "");
  }, [selectedRouteId, isEditMode, setValue]);

  const ticketCount = Number(watch("ticketCount") || 0);

  const ticketPrice =
      selectedTrip?.price ??
      alightingStop?.priceFromOrigin ??
      0;

  const totalPrice = ticketPrice * ticketCount;

  useEffect(() => {
    if (isEditMode) return;

    setValue("date", "");
  }, [selectedRouteId, isEditMode, setValue]);

  useEffect(() => {
    setValue("tripId", "");
  }, [dateValue, setValue]);


  return (
    <ModalFrame
      onClose={onClose}
      ariaLabelledBy="new-order-title"
      usePortal
      surfaceClassName={styles.modalFrame}
    >
      <AdminModalHeader title={`${modalTitle} № ${bookingNumberStr}`} onClose={onClose} />

      <div className={styles.body}>
        <InputWithLabel
          label={t("profile.fields.name")}
          placeholder={t("ticketBooking.form.namePlaceholder")}
          {...register("passengerName")}
        />

        <InputWithLabel
          label={t("profile.fields.phone")}
          placeholder={t("profile.placeholders.phone")}
          {...register("passengerPhone")}
        />

        <SelectWithLabel
            control={control}
            name="routeId"
            label="Рейс"
            placeholder="Оберіть рейс"
            options={routes.map((route) => ({
              value: route.id,
              label: route.name,
            }))}
            menuZIndex={10000}
        />

        <div className={styles.row}>
          <div className={styles.calendarAnchor} ref={calendarRef}>
            <InputWithLabel
                label={t("bookingForm.date.placeholder")}
                placeholder={t("dispatcherArea.tickets.modal.datePlaceholder")}
                trailingAdornment="/icons/calendar.svg"
                onTrailingAdornmentClick={() => {
                  if (selectedRoute) {
                    setShowCalendar((value) => !value);
                  }
                }}
                {...register("date")}
            />
            {showCalendar && (
              <div className={styles.calendarDropdown}>
                <MiniCalendar
                    value={parsedDate}
                    minDate={new Date()}
                    availableDates={Array.from(availableDateKeys)}
                    onChange={(date: Date) => {
                      const day = String(date.getDate()).padStart(2, "0");
                      const month = String(date.getMonth() + 1).padStart(2, "0");

                      setValue(
                          "date",
                          `${day}.${month}.${date.getFullYear()}`,
                      );
                    }}
                    onClose={() => setShowCalendar(false)}
                />
              </div>
            )}
          </div>
          <SelectWithLabel
              control={control}
              name="tripId"
              label="Час відправлення"
              placeholder="Оберіть час"
              disabled={
                  !selectedDateForApi ||
                  availableTrips.length === 0
              }
              options={availableTrips.map((trip) => ({
                value: trip.id,
                label: new Date(trip.departureTime).toLocaleTimeString("uk-UA", {
                  hour: "2-digit",
                  minute: "2-digit",
                }),
              }))}
              menuZIndex={10000}
          />
        </div>

        <div className={styles.row}>
          <InputWithLabel
            label={t("dispatcherArea.tickets.modal.ticketCount")}
            type="number"
            min={0}
            trailingAdornment="/icons/account/archive/ticket-outline.svg"
            {...register("ticketCount")}
          />
          <InputWithLabel
              label={t("bookingForm.price.placeholder")}
              value={String(totalPrice)}
              readOnly
              min={0}
              trailingAdornment="/icons/currency-hryvnia.svg"
          />
        </div>

        <div className={styles.statusRow}>
          <Button
            text={t("dispatcherArea.tickets.statuses.bookedShort")}
            variant={status === "reserved" ? "yellow" : "outlined"}
            size="full"
            onClick={() => setValue("status", "reserved")}
          />
          <Button
            text={t("dispatcherArea.tickets.statuses.paid")}
            variant={status === "completed" ? "success" : "outlined"}
            size="full"
            onClick={() => setValue("status", "completed")}
          />
        </div>

        <p className={styles.timer}>
          {t("dispatcherArea.tickets.timer.untilBookingEnd")}: 00:00{" "}
          {t("dispatcherArea.tickets.timer.minutes")}
        </p>
        <hr className={styles.divider} />
      </div>

      <div className={styles.footer}>
        <Button
          text={t("dispatcherArea.tickets.actions.saveChanges")}
          variant="secondary"
          size="full"
          onClick={handleSubmit(onSubmit)}
        />
      </div>
    </ModalFrame>
  );
}
