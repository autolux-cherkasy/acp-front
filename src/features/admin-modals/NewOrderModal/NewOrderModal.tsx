"use client";

import { useMemo, type RefObject } from "react";
import { useForm } from "react-hook-form";
import MiniCalendar from "@/src/widgets/MiniCalendar/MiniCalendar";
import { useClickOutside } from "@/src/shared/lib/useClickOutside";
import { createAdminBooking } from "@/src/entities/ticket";
import type { TicketStatus } from "@/src/entities/ticket";
import { useI18n } from "@/src/shared/i18n/I18nProvider";
import Button from "@/src/shared/ui/Button/Button";
import DetailModalFrame from "@/src/shared/ui/DetailModalFrame/DetailModalFrame";
import { useModalClose } from "@/src/shared/ui/ModalFrame/ModalFrame";
import InputWithLabel from "@/src/shared/ui/InputWithLabel/InputWithLabel";
import styles from "./NewOrderModal.module.css";
import AdminModalHeader from "@/src/shared/ui/AdminModalHeader/AdminModalHeader";

type Props = {
  onClose: () => void;
  nextBookingNumber: number;
  routeInfo?: FormState;
};

type FormState = {
  passengerName: string;
  passengerPhone: string;
  route: string;
  date: string;
  departureTime: string;
  ticketCount: string;
  totalPrice: string;
  status: TicketStatus;
  bookingNumber?: string;
};

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
        showCalendar={showCalendar}
        setShowCalendar={setShowCalendar}
        calendarRef={calendarRef}
      />
    </DetailModalFrame>
  );
}

type NewOrderModalBodyProps = Omit<Props, "onClose"> & {
  showCalendar: boolean;
  setShowCalendar: (updater: boolean | ((prev: boolean) => boolean)) => void;
  calendarRef: RefObject<HTMLDivElement | null>;
};

function NewOrderModalBody({
  nextBookingNumber,
  routeInfo,
  showCalendar,
  setShowCalendar,
  calendarRef,
}: NewOrderModalBodyProps) {
  const { t } = useI18n();
  const requestClose = useModalClose();

  const { register, setValue, watch, handleSubmit} = useForm<FormState>({
    defaultValues: {
      passengerName: routeInfo?.passengerName ?? "",
      passengerPhone: routeInfo?.passengerPhone ?? "",
      route: routeInfo?.route ?? "",
      date: routeInfo?.date ?? "",
      departureTime: routeInfo?.departureTime ?? "",
      ticketCount: routeInfo?.ticketCount ?? "0",
      totalPrice: routeInfo?.totalPrice ?? "0",
      status: routeInfo?.status ?? "reserved",
    },
  });
  const status = watch("status");
  const dateValue = watch("date");

  const parsedDate = useMemo(() => {
    if (!dateValue) return null;
    const parts = dateValue.split(".");
    if (parts.length !== 3) return null;
    const [d, m, y] = parts.map(Number);
    if (!d || !m || !y || isNaN(d) || isNaN(m) || isNaN(y)) return null;
    const date = new Date(y, m - 1, d);
    return isNaN(date.getTime()) ? null : date;
  }, [dateValue]);

  const isEditMode = routeInfo !== undefined;
  const bookingNumberStr = routeInfo?.bookingNumber ?? String(nextBookingNumber).padStart(6, "0");
  const modalTitle = isEditMode
    ? t("dispatcherArea.tickets.modal.editOrderTitle")
    : t("dispatcherArea.tickets.modal.newOrderTitle");

  async function onSubmit(data: FormState) {
    console.log("submit data:", data);

    // Тут поки не вистачає tripId / boardingStopId / alightingStopId
    // createAdminBooking({
    //   customerData: {
    //     name: data.passengerName,
    //     phone: data.passengerPhone,
    //   },
    //   tripId: "...",
    //   boardingStopId: "...",
    //   alightingStopId: "...",
    //   ticketsCount: Number(data.ticketCount),
    // });
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

        <InputWithLabel
          label={t("dispatcherArea.analytics.popularRoutes.columns.route")}
          placeholder={t("dispatcherArea.tickets.modal.routePlaceholder")}
          {...register("route")}
        />

        <div className={styles.row}>
          <div className={styles.calendarAnchor} ref={calendarRef}>
            <InputWithLabel
              label={t("bookingForm.date.placeholder")}
              placeholder={t("dispatcherArea.tickets.modal.datePlaceholder")}
              trailingAdornment="/icons/calendar.svg"
              onTrailingAdornmentClick={() => setShowCalendar((v) => !v)}
              {...register("date")}
            />
            {showCalendar && (
              <div className={styles.calendarDropdown}>
                <MiniCalendar
                  value={parsedDate}
                  onChange={(d) => {
                    const day = String(d.getDate()).padStart(2, "0");
                    const month = String(d.getMonth() + 1).padStart(2, "0");
                    setValue("date", `${day}.${month}.${d.getFullYear()}`);
                  }}
                  onClose={() => setShowCalendar(false)}
                />
              </div>
            )}
          </div>
          <InputWithLabel
            label={t("dispatcherArea.tickets.modal.departureTime")}
            placeholder="00:00"
            trailingAdornment="/icons/Footer/clock.svg"
            {...register("departureTime")}
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
            type="number"
            min={0}
            trailingAdornment="/icons/currency-hryvnia.svg"
            {...register("totalPrice")}
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
    </>
  );
}
