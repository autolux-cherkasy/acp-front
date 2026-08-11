"use client";

import { useEffect, useMemo, useState, type RefObject } from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import MiniCalendar from "@/src/widgets/MiniCalendar/MiniCalendar";
import { useClickOutside } from "@/src/shared/lib/useClickOutside";
import { createAdminBooking, updateAdminBooking } from "@/src/entities/ticket";
import type { ApiBookingStatus, TicketStatus, UpdateAdminBookingPayload } from "@/src/entities/ticket";
import {
  buildRouteValue,
  formatDDMMYYYY,
  formatTripTime,
  sortTripsByTime,
  useTripSelection,
} from "@/src/entities/trip";
import { useI18n } from "@/src/shared/i18n/I18nProvider";
import { formatCurrency } from "@/src/shared/lib/formatters";
import { useServerToast } from "@/src/shared/lib/toast";
import Button from "@/src/shared/ui/Button/Button";
import DetailModalFrame from "@/src/shared/ui/DetailModalFrame/DetailModalFrame";
import { useModalClose } from "@/src/shared/ui/ModalFrame/ModalFrame";
import InputWithLabel from "@/src/shared/ui/InputWithLabel/InputWithLabel";
import SelectWithLabel from "@/src/shared/ui/SelectWithLabel/SelectWithLabel";
import styles from "./NewOrderModal.module.css";
import AdminModalHeader from "@/src/shared/ui/AdminModalHeader/AdminModalHeader";

const PHONE_PATTERN = /^\+380\d{9}$/;
// Radix Popover portals to document.body, so its menu needs a z-index above
// the modal surface's (10000, see ModalFrame.module.css) to render on top of it —
// same value other admin modals use (e.g. HandleRoutesModal, BusModal).
const MODAL_SELECT_MENU_Z_INDEX = 10001;

type RouteInfo = {
  id: string;
  bookingNumber: string;
  passengerName: string;
  passengerPhone: string;
  tripId: string;
  boardingStopId: string;
  alightingStopId: string;
  date: string;
  ticketCount: string;
  totalPrice: string;
  status: TicketStatus;
};

type Props = {
  onClose: () => void;
  nextBookingNumber: number;
  routeInfo?: RouteInfo;
};

type FormState = {
  passengerName: string;
  passengerPhone: string;
  ticketCount: string;
  status: TicketStatus;
};

function parseDisplayDate(value: string | undefined): Date | null {
  if (!value) return null;
  const parts = value.split(".");
  if (parts.length !== 3) return null;
  const [d, m, y] = parts.map(Number);
  if (!d || !m || !y || isNaN(d) || isNaN(m) || isNaN(y)) return null;
  const date = new Date(y, m - 1, d);
  return isNaN(date.getTime()) ? null : date;
}

export default function NewOrderModal({ onClose, nextBookingNumber, routeInfo }: Props) {
  const {
    isOpen: showCalendar,
    setIsOpen: setShowCalendar,
    fieldRef: calendarRef,
  } = useClickOutside();

  return (
    <DetailModalFrame
      onClose={onClose}
      ariaLabelledBy="new-order-title"
      surfaceClassName={styles.modalFrame}
      onEscapeKeyDown={(event) => {
        if (showCalendar) event.preventDefault();
      }}
    >
      <NewOrderModalBody
        nextBookingNumber={nextBookingNumber}
        routeInfo={routeInfo}
        onClose={onClose}
        showCalendar={showCalendar}
        setShowCalendar={setShowCalendar}
        calendarRef={calendarRef}
      />
    </DetailModalFrame>
  );
}

type NewOrderModalBodyProps = Props & {
  showCalendar: boolean;
  setShowCalendar: (updater: boolean | ((prev: boolean) => boolean)) => void;
  calendarRef: RefObject<HTMLDivElement | null>;
};

function NewOrderModalBody({
  nextBookingNumber,
  routeInfo,
  onClose,
  showCalendar,
  setShowCalendar,
  calendarRef,
}: NewOrderModalBodyProps) {
  const { t, lang } = useI18n();
  const requestClose = useModalClose();
  const queryClient = useQueryClient();
  const { notifySuccess, notifyError } = useServerToast();
  const locale = lang === "en" ? "en-GB" : "uk-UA";
  const isEditMode = routeInfo !== undefined;

  const { register, setValue, watch, handleSubmit } = useForm<FormState>({
    defaultValues: {
      passengerName: routeInfo?.passengerName ?? "",
      passengerPhone: routeInfo?.passengerPhone ?? "",
      ticketCount: routeInfo?.ticketCount ?? "1",
      status: routeInfo?.status ?? "reserved",
    },
  });
  const status = watch("status");
  const ticketCountValue = watch("ticketCount");

  const [selectedRoute, setSelectedRoute] = useState(() =>
    routeInfo ? buildRouteValue(routeInfo.boardingStopId, routeInfo.alightingStopId) : "",
  );
  const [selectedDate, setSelectedDate] = useState<Date | null>(() =>
    parseDisplayDate(routeInfo?.date),
  );
  const [selectedTripId, setSelectedTripId] = useState(() => routeInfo?.tripId ?? "");
  const [formError, setFormError] = useState<string | null>(null);

  const {
    routeOptions,
    trips,
    dates,
    fromStopId,
    toStopId,
    isRoutesLoading,
    isTripsLoading,
  } = useTripSelection({ selectedRoute, selectedDate });

  const timeOptions = useMemo(() => sortTripsByTime(trips), [trips]);
  const selectedTrip = useMemo(
    () => timeOptions.find((trip) => trip.id === selectedTripId) ?? null,
    [timeOptions, selectedTripId],
  );
  const timeSelectOptions = useMemo(
    () => timeOptions.map((trip) => ({ value: trip.id, label: formatTripTime(trip, locale) })),
    [timeOptions, locale],
  );
  const availableDateKeys = useMemo(() => dates.map((d) => d.date), [dates]);

  useEffect(() => {
    if (!selectedTripId || !selectedRoute || !selectedDate || isTripsLoading) return;
    if (!trips.some((trip) => trip.id === selectedTripId)) {
      setSelectedTripId("");
    }
  }, [trips, selectedTripId, selectedRoute, selectedDate, isTripsLoading]);

  const priceValue = useMemo(() => {
    const count = Number(ticketCountValue);
    if (selectedTrip && Number.isFinite(count) && count > 0) {
      return selectedTrip.price * count;
    }
    return routeInfo ? Number(routeInfo.totalPrice) : 0;
  }, [selectedTrip, ticketCountValue, routeInfo]);

  const dateValue = selectedDate ? formatDDMMYYYY(selectedDate) : "";

  const bookingNumberStr = routeInfo?.bookingNumber ?? String(nextBookingNumber).padStart(6, "0");
  const modalTitle = isEditMode
    ? t("dispatcherArea.tickets.modal.editOrderTitle")
    : t("dispatcherArea.tickets.modal.newOrderTitle");

  const createMutation = useMutation({
    mutationFn: createAdminBooking,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["admin-bookings"] });
      notifySuccess(undefined, t("dispatcherArea.tickets.modal.toast.createSuccess"));
      onClose();
    },
    onError: (error) => notifyError(error, t("dispatcherArea.tickets.modal.toast.submitError")),
  });

  const updateMutation = useMutation({
    mutationFn: (payload: UpdateAdminBookingPayload) =>
      updateAdminBooking(routeInfo!.id, payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["admin-bookings"] });
      notifySuccess(undefined, t("dispatcherArea.tickets.modal.toast.updateSuccess"));
      onClose();
    },
    onError: (error) => notifyError(error, t("dispatcherArea.tickets.modal.toast.submitError")),
  });

  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  async function onSubmit(data: FormState) {
    setFormError(null);

    if (!data.passengerName.trim()) {
      setFormError(t("dispatcherArea.tickets.modal.errors.nameRequired"));
      return;
    }

    if (!PHONE_PATTERN.test(data.passengerPhone.trim())) {
      setFormError(t("dispatcherArea.tickets.modal.errors.phoneInvalid"));
      return;
    }

    const ticketsCount = Number(data.ticketCount);
    if (!Number.isInteger(ticketsCount) || ticketsCount < 1) {
      setFormError(t("dispatcherArea.tickets.modal.errors.seatsInvalid"));
      return;
    }

    if (!selectedTrip) {
      setFormError(t("dispatcherArea.tickets.modal.errors.tripRequired"));
      return;
    }

    if (selectedTrip.availableSeats != null && ticketsCount > selectedTrip.availableSeats) {
      setFormError(t("dispatcherArea.tickets.modal.errors.seatsExceedsAvailable"));
      return;
    }

    const customerData = {
      name: data.passengerName.trim(),
      phone: data.passengerPhone.trim(),
    };

    if (isEditMode && routeInfo) {
      const apiStatus: ApiBookingStatus = data.status === "completed" ? "BUYOUT" : "ACTIVE";
      const tripOrStopsChanged =
        selectedTrip.id !== routeInfo.tripId ||
        fromStopId !== routeInfo.boardingStopId ||
        toStopId !== routeInfo.alightingStopId;

      updateMutation.mutate({
        status: apiStatus,
        ticketsCount,
        customerData,
        ...(tripOrStopsChanged && {
          tripId: selectedTrip.id,
          boardingStopId: fromStopId,
          alightingStopId: toStopId,
        }),
      });
    } else {
      createMutation.mutate({
        customerData,
        tripId: selectedTrip.id,
        boardingStopId: fromStopId,
        alightingStopId: toStopId,
        ticketsCount,
      });
    }
  }

  return (
    <>
      <AdminModalHeader title={`${modalTitle} № ${bookingNumberStr}`} onClose={requestClose} />

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
          label={t("dispatcherArea.analytics.popularRoutes.columns.route")}
          value={selectedRoute}
          options={routeOptions}
          onChange={setSelectedRoute}
          placeholder={t("dispatcherArea.tickets.modal.routeSelectPlaceholder")}
          disabled={isRoutesLoading}
          menuZIndex={MODAL_SELECT_MENU_Z_INDEX}
        />

        <div className={styles.row}>
          <div className={styles.calendarAnchor} ref={calendarRef}>
            <InputWithLabel
              label={t("bookingForm.date.placeholder")}
              placeholder={t("dispatcherArea.tickets.modal.datePlaceholder")}
              trailingAdornment="/icons/calendar.svg"
              onTrailingAdornmentClick={() => setShowCalendar((v) => !v)}
              value={dateValue}
              readOnly
              disabled={!selectedRoute}
            />
            {showCalendar && (
              <div className={styles.calendarDropdown}>
                <MiniCalendar
                  value={selectedDate}
                  onChange={(d) => {
                    setSelectedDate(d);
                    setShowCalendar(false);
                  }}
                  onClose={() => setShowCalendar(false)}
                  availableDates={availableDateKeys}
                />
              </div>
            )}
          </div>

          <SelectWithLabel
            label={t("dispatcherArea.tickets.modal.departureTime")}
            value={selectedTripId}
            options={timeSelectOptions}
            onChange={setSelectedTripId}
            placeholder="00:00"
            disabled={!selectedRoute || !selectedDate || isTripsLoading}
            menuZIndex={MODAL_SELECT_MENU_Z_INDEX}
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
            type="text"
            trailingAdornment="/icons/currency-hryvnia.svg"
            value={formatCurrency(priceValue)}
            readOnly
            disabled
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

        {formError && <p className={styles.errorText}>{formError}</p>}

        <p className={styles.timer}>
          {t("dispatcherArea.tickets.timer.untilBookingEnd")}: 00:00{" "}
          {t("dispatcherArea.tickets.timer.minutes")}
        </p>
        <hr className={styles.divider} />
      </div>

      <div className={styles.footer}>
        <Button
          text={
            isSubmitting
              ? t("dispatcherArea.tickets.actions.saving")
              : t("dispatcherArea.tickets.actions.saveChanges")
          }
          variant="secondary"
          size="full"
          disabled={isSubmitting}
          onClick={handleSubmit(onSubmit)}
        />
      </div>
    </>
  );
}
