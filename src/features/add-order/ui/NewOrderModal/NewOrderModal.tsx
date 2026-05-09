"use client";

import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import type { TicketStatus } from "@/src/entities/ticket";
import { useI18n } from "@/src/shared/i18n/I18nProvider";
import Button from "@/src/shared/ui/Button/Button";
import ModalCloseButton from "@/src/shared/ui/ModalCloseButton/ModalCloseButton";
import Portal from "@/src/shared/ui/Portal/Portal";
import TextField from "@/src/shared/ui/TextField/TextField";
import styles from "./NewOrderModal.module.css";

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
};

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className={styles.field}>
      <label className={styles.label}>{label}</label>
      {children}
    </div>
  );
}

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

  const bookingNumberStr = String(nextBookingNumber).padStart(6, "0");

  function setField(field: keyof FormState, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  return (
    <Portal>
      <div className={styles.overlay} onClick={onClose}>
        <div
          className={styles.modal}
          onClick={(event) => event.stopPropagation()}
          role="dialog"
          aria-modal="true"
          aria-labelledby="new-order-title"
        >
          <div className={styles.header}>
            <h2 className={styles.title} id="new-order-title">
              {t("dispatcherArea.tickets.modal.newOrderTitle")} №{" "}
              {bookingNumberStr}
            </h2>
            <ModalCloseButton onClose={onClose} ariaLabel={t("common.close")} />
          </div>

          <div className={styles.body}>
            <Field label={t("profile.fields.name")}>
              <TextField
                placeholder={t("ticketBooking.form.namePlaceholder")}
                value={form.passengerName}
                onChange={(event) =>
                  setField("passengerName", event.target.value)
                }
              />
            </Field>

            <Field label={t("profile.fields.phone")}>
              <TextField
                placeholder={t("profile.placeholders.phone")}
                value={form.passengerPhone}
                onChange={(event) =>
                  setField("passengerPhone", event.target.value)
                }
              />
            </Field>

            <Field
              label={t("dispatcherArea.analytics.popularRoutes.columns.route")}
            >
              <TextField
                placeholder={t("dispatcherArea.tickets.modal.routePlaceholder")}
                value={form.route}
                onChange={(event) => setField("route", event.target.value)}
              />
            </Field>

            <div className={styles.row}>
              <Field label={t("bookingForm.date.placeholder")}>
                <TextField
                  placeholder={t(
                    "dispatcherArea.tickets.modal.datePlaceholder",
                  )}
                  value={form.date}
                  onChange={(event) => setField("date", event.target.value)}
                  trailingAdornment="/icons/calendar.svg"
                />
              </Field>
              <Field label={t("dispatcherArea.tickets.modal.departureTime")}>
                <TextField
                  placeholder="00:00"
                  value={form.departureTime}
                  onChange={(event) =>
                    setField("departureTime", event.target.value)
                  }
                  trailingAdornment="/icons/Footer/clock.svg"
                />
              </Field>
            </div>

            <div className={styles.row}>
              <Field label={t("dispatcherArea.tickets.modal.ticketCount")}>
                <TextField
                  type="number"
                  min={0}
                  value={form.ticketCount}
                  onChange={(event) =>
                    setField("ticketCount", event.target.value)
                  }
                  trailingAdornment="/icons/account/archive/ticket-outline.svg"
                />
              </Field>
              <Field label={t("bookingForm.price.placeholder")}>
                <TextField
                  type="number"
                  min={0}
                  value={form.totalPrice}
                  onChange={(event) =>
                    setField("totalPrice", event.target.value)
                  }
                  trailingAdornment="/icons/currency-hryvnia.svg"
                />
              </Field>
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
        </div>
      </div>
    </Portal>
  );
}
