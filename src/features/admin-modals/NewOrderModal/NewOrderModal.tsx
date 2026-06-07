"use client";

import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import MiniCalendar from "@/src/widgets/MiniCalendar/MiniCalendar";
import { useClickOutside } from "@/src/shared/lib/useClickOutside";
import type { TicketStatus } from "@/src/entities/ticket";
import { useI18n } from "@/src/shared/i18n/I18nProvider";
import Button from "@/src/shared/ui/Button/Button";
import ModalFrame from "@/src/shared/ui/ModalFrame/ModalFrame";
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
  const { t } = useI18n();
  const {
    isOpen: showCalendar,
    setIsOpen: setShowCalendar,
    fieldRef: calendarRef,
  } = useClickOutside();

  useEffect(() => {
    document.body.style.overflow = "hidden";

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !showCalendar) {
        onClose();
      }
    };

    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [onClose, showCalendar]);

  const { register, setValue, watch } = useForm<FormState>({
    defaultValues: {
      passengerName: routeInfo?.passengerName ?? "",
      passengerPhone: routeInfo?.passengerPhone ?? "",
      route: routeInfo?.route ?? "",
      date: routeInfo?.date ?? "",
      departureTime: routeInfo?.departureTime ?? "",
      ticketCount: routeInfo?.ticketCount ?? "0",
      totalPrice: routeInfo?.totalPrice ?? "0",
      status: routeInfo?.status ?? "booked",
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
            variant={status === "booked" ? "yellow" : "outlined"}
            onClick={() => setValue("status", "booked")}
          />
          <Button
            text={t("dispatcherArea.tickets.statuses.paid")}
            variant={status === "paid" ? "success" : "outlined"}
            onClick={() => setValue("status", "paid")}
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
          onClick={onClose}
        />
      </div>
    </ModalFrame>
  );
}
