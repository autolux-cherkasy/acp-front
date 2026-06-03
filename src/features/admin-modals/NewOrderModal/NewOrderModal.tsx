"use client";

import { useEffect, useState } from "react";
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


export default function NewOrderModal({
  onClose,
  nextBookingNumber,
  routeInfo,
}: Props) {
  const { t } = useI18n();

  useEffect(() => {
    document.body.style.overflow = "hidden";

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [onClose]);

  const [form, setForm] = useState<FormState>({
    passengerName: routeInfo?.passengerName ?? "",
    passengerPhone: routeInfo?.passengerPhone ?? "",
    route: routeInfo?.route ?? "",
    date: routeInfo?.date ?? "",
    departureTime: routeInfo?.departureTime ?? "",
    ticketCount: routeInfo?.ticketCount ?? "0",
    totalPrice: routeInfo?.totalPrice ?? "0",
    status: routeInfo?.status ?? "booked",
  });

  const isEditMode = routeInfo !== undefined;
  const bookingNumberStr = routeInfo?.bookingNumber ?? String(nextBookingNumber).padStart(6, "0");
  const modalTitle = isEditMode
    ? t("dispatcherArea.tickets.modal.editOrderTitle")
    : t("dispatcherArea.tickets.modal.newOrderTitle");

  function setField(field: keyof FormState, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  return (
    <ModalFrame
      onClose={onClose}
      ariaLabelledBy="new-order-title"
      usePortal
      surfaceClassName={styles.modalFrame}
    >
      <AdminModalHeader
        title={`${modalTitle} № ${bookingNumberStr}`}
        onClose={onClose}
      />

          <div className={styles.body}>
            <InputWithLabel
              label={t("profile.fields.name")}
              placeholder={t("ticketBooking.form.namePlaceholder")}
              value={form.passengerName}
              onChange={(event) => setField("passengerName", event.target.value)}
            />

            <InputWithLabel
              label={t("profile.fields.phone")}
              placeholder={t("profile.placeholders.phone")}
              value={form.passengerPhone}
              onChange={(event) => setField("passengerPhone", event.target.value)}
            />

            <InputWithLabel
              label={t("dispatcherArea.analytics.popularRoutes.columns.route")}
              placeholder={t("dispatcherArea.tickets.modal.routePlaceholder")}
              value={form.route}
              onChange={(event) => setField("route", event.target.value)}
            />

            <div className={styles.row}>
              <InputWithLabel
                label={t("bookingForm.date.placeholder")}
                placeholder={t("dispatcherArea.tickets.modal.datePlaceholder")}
                value={form.date}
                onChange={(event) => setField("date", event.target.value)}
                trailingAdornment="/icons/calendar.svg"
              />
              <InputWithLabel
                label={t("dispatcherArea.tickets.modal.departureTime")}
                placeholder="00:00"
                value={form.departureTime}
                onChange={(event) => setField("departureTime", event.target.value)}
                trailingAdornment="/icons/Footer/clock.svg"
              />
            </div>

            <div className={styles.row}>
              <InputWithLabel
                label={t("dispatcherArea.tickets.modal.ticketCount")}
                type="number"
                min={0}
                value={form.ticketCount}
                onChange={(event) => setField("ticketCount", event.target.value)}
                trailingAdornment="/icons/account/archive/ticket-outline.svg"
              />
              <InputWithLabel
                label={t("bookingForm.price.placeholder")}
                type="number"
                min={0}
                value={form.totalPrice}
                onChange={(event) => setField("totalPrice", event.target.value)}
                trailingAdornment="/icons/currency-hryvnia.svg"
              />
            </div>

            <div className={styles.statusRow}>
              <Button
                text={t("dispatcherArea.tickets.statuses.bookedShort")}
                variant={form.status === "booked" ? "yellow" : "outlined"}
                onClick={() => setField("status", "booked")}
              />
              <Button
                text={t("dispatcherArea.tickets.statuses.paid")}
                variant={form.status === "paid" ? "success" : "outlined"}
                onClick={() => setField("status", "paid")}
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
