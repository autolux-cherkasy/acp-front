"use client";

import AdminModalHeader from "@/src/shared/ui/AdminModalHeader/AdminModalHeader";
import Button from "@/src/shared/ui/Button/Button";
import Icon from "@/src/shared/ui/Icon/Icon";
import DetailModalFrame from "@/src/shared/ui/DetailModalFrame/DetailModalFrame";
import { useModalClose } from "@/src/shared/ui/ModalFrame/ModalFrame";
import ModalRow from "@/src/shared/ui/ModalRow/ModalRow";
import styles from "./BlockedUserModal.module.css";
import Loader from "@/src/shared/ui/Loader/Loader";
import { useI18n } from "@/src/shared/i18n/I18nProvider";
import {
  useUserWithUnpaidBookingsQuery,
  useBlockUserMutation,
} from "@/src/entities/dashboard/api/useAnalyticsQueries";

type Props = {
  userId: number | null;
  onClose: () => void;
  action?: () => void;
  isBlocked: boolean;
};

export default function BlockedUserModal({ userId, onClose, action, isBlocked }: Props) {
  return (
    <DetailModalFrame
      onClose={onClose}
      ariaLabelledBy="blocked-user-title"
      surfaceClassName={styles.modalFrame}
    >
      <BlockedUserModalBody userId={userId} action={action} isBlocked={isBlocked} />
    </DetailModalFrame>
  );
}

function BlockedUserModalBody({ userId, action, isBlocked }: Omit<Props, "onClose">) {
  const { t } = useI18n();
  const { data: userData, isPending } = useUserWithUnpaidBookingsQuery(userId);
  const blockMutation = useBlockUserMutation();
  const requestClose = useModalClose();

  function handleAction() {
    if (userId === null) return;
    blockMutation.mutate(
      { userId, block: !isBlocked },
      {
        onSuccess: () => {
          action?.();
          requestClose();
        },
      },
    );
  }

  return (
    <>
      <AdminModalHeader title="Дані заблокованого користувача" onClose={requestClose} />

      <div className={styles.body}>
        {isPending ? (
          <div className={styles.loaderWrapper}>
            <Loader size={64} text="" />
          </div>
        ) : (
          <>
            <div className={styles.userSection}>
              <ModalRow icon={<Icon src="/icons/account/archive/clarity_avatar-line.svg" />}>
                {userData?.name || t("common.notSpecified")}
              </ModalRow>
              <ModalRow icon={<Icon src="/icons/account/archive/phone.svg" />}>
                {userData?.phone || t("common.notSpecified")}
              </ModalRow>
              <ModalRow icon={<Icon src="/icons/Footer/email.svg" />}>
                {userData?.email || t("common.notSpecified")}
              </ModalRow>
            </div>

            <div className={styles.ordersSection}>
              {(userData?.unpaidBookings ?? []).map((order) => (
                <div key={order.bookingNumber} className={styles.orderCard}>
                  <p className={styles.orderTitle}>Замовлення №{order.bookingNumber}</p>
                  <ModalRow icon={<Icon src="/icons/Footer/map-point.svg" />}>
                    {order.direction}
                  </ModalRow>
                  <ModalRow icon={<Icon src="/icons/calendar.svg" />}>{order.date}</ModalRow>
                  <div className={styles.orderInlineRow}>
                    <span className={styles.orderInlineItem}>
                      <span className={styles.orderInlineIcon}>
                        <Icon src="/icons/Footer/clock.svg" />
                      </span>
                      <span>{order.time}</span>
                    </span>
                    <span className={styles.orderInlineSep} aria-hidden="true" />
                    <span className={styles.orderInlineItem}>
                      <span className={styles.orderInlineIcon}>
                        <Icon src="/icons/account/archive/ticket-outline.svg" />
                      </span>
                      <span>{order.seatsCount}</span>
                    </span>
                    <span className={styles.orderInlineSep} aria-hidden="true" />
                    <span className={styles.orderInlineItem}>
                      <span className={styles.orderInlineIcon}>
                        <Icon src="/icons/currency-hryvnia.svg" />
                      </span>
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
            text={isBlocked ? "Розблокувати" : "Заблокувати"}
            variant={isBlocked ? "success" : "danger"}
            size="full"
            onClick={handleAction}
            disabled={blockMutation.isPending}
          />
          <Button text="Скасувати" variant="outlined" size="full" onClick={requestClose} />
        </div>
      </div>
    </>
  );
}
