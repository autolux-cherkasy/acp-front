"use client";

import type { ReactNode } from "react";
import { useEffect } from "react";
import type { Ticket } from "@/src/entities/ticket";
import { useCountdown } from "@/src/features/ticket-timer";
import { useI18n } from "@/src/shared/i18n/I18nProvider";
import Button from "@/src/shared/ui/Button/Button";
import Icon from "@/src/shared/ui/Icon/Icon";
import ModalFrame from "@/src/shared/ui/ModalFrame/ModalFrame";
import ModalCloseButton from "@/src/shared/ui/ModalCloseButton/ModalCloseButton";
import styles from "./OrderDetailsModal.module.css";

type Props = {
  ticket: Ticket;
  onClose: () => void;
  onEdit?: () => void;
};

function formatSeconds(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const remainder = seconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(remainder).padStart(2, "0")}`;
}

function Row({ icon, children }: { icon: ReactNode; children: ReactNode }) {
  return (
    <div className={styles.row}>
      <span className={styles.rowIcon}>{icon}</span>
      <span className={styles.rowValue}>{children}</span>
    </div>
  );
}

export default function OrderDetailsModal({ ticket, onClose, onEdit }: Props) {
  const { t } = useI18n();
  const remainingSeconds = useCountdown(ticket.timerSeconds);

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

  const bookingNumberStr = ticket.bookingNumber
    .replace("BR-", "")
    .padStart(6, "0");
  const route = `${ticket.routeFrom} - ${ticket.routeTo}`;
  const statusLabel =
    ticket.status === "booked"
      ? t("dispatcherArea.tickets.statuses.booked")
      : t("dispatcherArea.tickets.statuses.paid");

  return (
    <ModalFrame
      onClose={onClose}
      ariaLabelledBy="order-details-title"
      usePortal
      surfaceClassName={styles.modalFrame}
    >
          <div className={styles.header}>
            <h2 className={styles.title} id="order-details-title">
              {t("dispatcherArea.tickets.modal.orderDetailsTitle")} №
              {bookingNumberStr}
            </h2>
            <ModalCloseButton onClose={onClose} ariaLabel={t("common.close")} />
          </div>

          <div className={styles.body}>
            <Row
              icon={
                <Icon src="/icons/account/archive/clarity_avatar-line.svg" />
              }
            >
              {ticket.passengerName}
            </Row>
            <Row icon={<Icon src="/icons/account/archive/phone.svg" />}>
              {ticket.passengerPhone}
            </Row>
            <Row icon={<Icon src="/icons/Footer/map-point.svg" />}>{route}</Row>
            <Row icon={<Icon src="/icons/calendar.svg" />}>
              {ticket.departureDate}
            </Row>
            <Row icon={<Icon src="/icons/Footer/clock.svg" />}>
              {ticket.departureTime}
            </Row>
            <Row
              icon={<Icon src="/icons/account/archive/ticket-outline.svg" />}
            >
              {ticket.ticketCount}
            </Row>
            <Row icon={<Icon src="/icons/currency-hryvnia.svg" />}>
              {ticket.totalPrice}
            </Row>

            <div className={styles.metaRow}>
              <span className={styles.metaLabel}>
                {t("dispatcherArea.routes.table.columns.status")}:
              </span>
              <span className={styles.metaValue}>{statusLabel}</span>
            </div>

            <div className={styles.metaRow}>
              <span className={styles.metaLabel}>
                {t("dispatcherArea.tickets.timer.untilBookingEnd")}:
              </span>
              <span className={styles.metaValue}>
                {remainingSeconds !== null
                  ? `${formatSeconds(remainingSeconds)} ${t("dispatcherArea.tickets.timer.minutes")}`
                  : "—"}
              </span>
            </div>

            <div className={styles.actions}>
              <Button
                text={t("dispatcherArea.tickets.actions.buy")}
                variant="success"
                onClick={() => {}}
              />
              <Button
                text={t("ticketBooking.form.reserve")}
                variant="yellow"
                onClick={() => {}}
              />
              <Button
                text={t("dispatcherArea.routes.table.statuses.edit")}
                variant="outlined"
                onClick={() => {
                  onEdit?.();
                  onClose();
                }}
              />
              <Button
                text={t("dispatcherArea.tickets.actions.cancel")}
                variant="danger"
                onClick={onClose}
              />
            </div>
          </div>
    </ModalFrame>
  );
}
