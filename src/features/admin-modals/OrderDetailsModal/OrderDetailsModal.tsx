"use client";

import type { Ticket } from "@/src/entities/ticket";
import { updateAdminBooking } from "@/src/entities/ticket";
import { useCountdown } from "@/src/features/ticket-timer";
import { useI18n } from "@/src/shared/i18n/I18nProvider";
import AdminModalHeader from "@/src/shared/ui/AdminModalHeader/AdminModalHeader";
import Button from "@/src/shared/ui/Button/Button";
import DetailModalFrame from "@/src/shared/ui/DetailModalFrame/DetailModalFrame";
import Icon from "@/src/shared/ui/Icon/Icon";
import ModalRow from "@/src/shared/ui/ModalRow/ModalRow";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import styles from "./OrderDetailsModal.module.css";
import ModalFrame from "@/src/shared/ui/ModalFrame/ModalFrame";

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

export default function OrderDetailsModal({ ticket, onClose, onEdit }: Props) {
  return (
    <DetailModalFrame
      onClose={onClose}
      ariaLabelledBy="order-details-title"
      surfaceClassName={styles.modalFrame}
    >
      <OrderDetailsModalBody ticket={ticket} onClose={onClose} onEdit={onEdit} />
    </DetailModalFrame>
  );
}

function OrderDetailsModalBody({
  ticket,
  onClose,
  onEdit,
}: {
  ticket: Ticket;
  onClose: () => void;
  onEdit?: () => void;
}) {
  const { t } = useI18n();
  const remainingSeconds = useCountdown(ticket.timerSeconds);
  const [isCancelConfirmOpen, setIsCancelConfirmOpen] = useState(false);

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

  const bookingNumberStr = ticket.bookingNumber;
  const route = `${ticket.routeFrom} - ${ticket.routeTo}`;
  const statusLabel = t(`dispatcherArea.tickets.statuses.${ticket.status}`);
  const queryClient = useQueryClient();

  async function handleStatusChange(status: "ACTIVE" | "COMPLETED" | "CANCELLED") {
    await updateAdminBooking(ticket.id, { status });

    await queryClient.invalidateQueries({
      queryKey: ["admin-bookings"],
    });

    onClose();
  }

  return (
    <>
      <ModalFrame
        onClose={onClose}
        ariaLabelledBy="order-details-title"
        usePortal
        surfaceClassName={styles.modalFrame}
      >
        <AdminModalHeader
          title={`${t("dispatcherArea.tickets.modal.orderDetailsTitle")} № ${bookingNumberStr}`}
          onClose={onClose}
        />

        <div className={styles.body}>
          <ModalRow icon={<Icon src="/icons/account/archive/clarity_avatar-line.svg" />}>
            {ticket.passengerName}
          </ModalRow>

          <ModalRow icon={<Icon src="/icons/account/archive/phone.svg" />}>
            {ticket.passengerPhone}
          </ModalRow>

          <ModalRow icon={<Icon src="/icons/Footer/map-point.svg" />}>{route}</ModalRow>
          <ModalRow icon={<Icon src="/icons/calendar.svg" />}>{ticket.departureDate}</ModalRow>
          <ModalRow icon={<Icon src="/icons/Footer/clock.svg" />}>{ticket.departureTime}</ModalRow>

          <ModalRow icon={<Icon src="/icons/account/archive/ticket-outline.svg" />}>
            {ticket.ticketCount}
          </ModalRow>

          <ModalRow icon={<Icon src="/icons/currency-hryvnia.svg" />}>{ticket.totalPrice}</ModalRow>

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
              size="full"
              onClick={() => handleStatusChange("COMPLETED")}
            />

            <Button
              text={t("ticketBooking.form.reserve")}
              variant="yellow"
              size="full"
              onClick={() => handleStatusChange("ACTIVE")}
            />

            <Button
              text={t("dispatcherArea.routes.table.statuses.edit")}
              variant="outlined"
              size="full"
              onClick={() => {
                onEdit?.();
                onClose();
              }}
            />

            <Button
              text={t("dispatcherArea.tickets.actions.cancel")}
              variant="danger"
              size="full"
              onClick={() => setIsCancelConfirmOpen(true)}
            />
          </div>
        </div>
      </ModalFrame>

      {isCancelConfirmOpen && (
        <ModalFrame
          onClose={() => setIsCancelConfirmOpen(false)}
          ariaLabelledBy="cancel-confirm-title"
          usePortal
          surfaceClassName={styles.confirmFrame}
        >
          <div className={styles.confirmBox}>
            <div className={styles.confirmMessage}>
              <Icon src="/icons/info.svg" />
              <p id="cancel-confirm-title">Ви впевнені, що хочете скасувати замовлення?</p>
              <button
                type="button"
                className={styles.confirmClose}
                onClick={() => setIsCancelConfirmOpen(false)}
              >
                ×
              </button>
            </div>

            <div className={styles.confirmActions}>
              <Button
                text="Повернутись"
                variant="outlined"
                size="full"
                onClick={() => setIsCancelConfirmOpen(false)}
              />

              <Button
                text={t("dispatcherArea.tickets.actions.cancel")}
                variant="danger"
                size="full"
                onClick={() => handleStatusChange("CANCELLED")}
              />
            </div>
          </div>
        </ModalFrame>
      )}
    </>
  );
}
