"use client";

import { useEffect } from "react";
import AdminModalHeader from "@/src/shared/ui/AdminModalHeader/AdminModalHeader";
import Button from "@/src/shared/ui/Button/Button";
import Icon from "@/src/shared/ui/Icon/Icon";
import ModalFrame from "@/src/shared/ui/ModalFrame/ModalFrame";
import ModalRow from "@/src/shared/ui/ModalRow/ModalRow";
import styles from "./BlockedUserModal.module.css";
import Loader from "@/src/shared/ui/Loader/Loader";
import {
  useUserWithUnpaidBookingsQuery,
  useBlockUserMutation,
} from "@/src/entities/dashboard/api/useAnalyticsQueries";

type Props = {
  userId: number | null;
  onClose: () => void;
  onUnblock?: () => void;
};

export default function BlockedUserModal({ userId, onClose, onUnblock }: Props) {
  const { data: userData, isPending } = useUserWithUnpaidBookingsQuery(userId);
  const blockMutation = useBlockUserMutation();

  useEffect(() => {
    document.body.style.overflow = "hidden";

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [onClose]);

  function handleUnblock() {
    if (userId === null) return;
    blockMutation.mutate(
      { userId, block: false },
      {
        onSuccess: () => {
          onUnblock?.();
          onClose();
        },
      },
    );
  }

  return (
    <ModalFrame
      onClose={onClose}
      ariaLabelledBy="blocked-user-title"
      usePortal
      surfaceClassName={styles.modalFrame}
    >
      <AdminModalHeader title="Дані заблокованого користувача" onClose={onClose} />

      <div className={styles.body}>
        {isPending ? (
          <div className={styles.loaderWrapper}>
            <Loader size={64} text="" />
          </div>
        ) : (
          <>
            <div className={styles.userSection}>
              <ModalRow icon={<Icon src="/icons/account/archive/clarity_avatar-line.svg" />}>
                {userData?.name ?? ""}
              </ModalRow>
              <ModalRow icon={<Icon src="/icons/account/archive/phone.svg" />}>
                {userData?.phone ?? ""}
              </ModalRow>
              <ModalRow icon={<Icon src="/icons/Footer/email.svg" />}>
                {userData?.email ?? ""}
              </ModalRow>
            </div>

            <div className={styles.ordersSection}>
              {(userData?.unpaidBookings ?? []).map((order) => (
                <div key={order.bookingNumber} className={styles.orderCard}>
                  <p className={styles.orderTitle}>Замовлення №{order.bookingNumber}</p>
                  <ModalRow icon={<Icon src="/icons/Footer/map-point.svg" />}>
                    {order.direction}
                  </ModalRow>
                  <ModalRow icon={<Icon src="/icons/calendar.svg" />}>
                    {order.date}
                  </ModalRow>
                  <div className={styles.orderInlineRow}>
                    <span className={styles.orderInlineItem}>
                      <span className={styles.orderInlineIcon}><Icon src="/icons/Footer/clock.svg" /></span>
                      <span>{order.time}</span>
                    </span>
                    <span className={styles.orderInlineSep} aria-hidden="true" />
                    <span className={styles.orderInlineItem}>
                      <span className={styles.orderInlineIcon}><Icon src="/icons/account/archive/ticket-outline.svg" /></span>
                      <span>{order.seatsCount}</span>
                    </span>
                    <span className={styles.orderInlineSep} aria-hidden="true" />
                    <span className={styles.orderInlineItem}>
                      <span className={styles.orderInlineIcon}><Icon src="/icons/currency-hryvnia.svg" /></span>
                      <span>{order.totalPrice}</span>
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        <div className={styles.actions}>
          <Button
            text="Розблокувати"
            variant="success"
            size="full"
            onClick={handleUnblock}
            disabled={blockMutation.isPending}
          />
          <Button text="Скасувати" variant="danger" size="full" onClick={onClose} />
        </div>
      </div>
    </ModalFrame>
  );
}
