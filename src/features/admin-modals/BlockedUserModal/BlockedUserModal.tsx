"use client";

import { useEffect } from "react";
import AdminModalHeader from "@/src/shared/ui/AdminModalHeader/AdminModalHeader";
import Button from "@/src/shared/ui/Button/Button";
import Icon from "@/src/shared/ui/Icon/Icon";
import ModalFrame from "@/src/shared/ui/ModalFrame/ModalFrame";
import ModalRow from "@/src/shared/ui/ModalRow/ModalRow";
import styles from "./BlockedUserModal.module.css";

const MOCK_USER = {
  name: "Юнак Людмила",
  phone: "+380675494578",
  email: "yunak@gmail.com",
};

const MOCK_ORDERS = [
  {
    id: "000003",
    route: "м.Кременчук - м.Черкаси",
    date: "07/03/2026",
    time: "17:15",
    tickets: 1,
    price: 400,
  },
  {
    id: "000021",
    route: "м.Кременчук - м.Черкаси",
    date: "08/03/2026",
    time: "17:15",
    tickets: 1,
    price: 400,
  },
];

type Props = {
  userId: number | null;
  onClose: () => void;
  onUnblock?: () => void;
};

export default function BlockedUserModal({ userId, onClose, onUnblock }: Props) {
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

  return (
    <ModalFrame
      onClose={onClose}
      ariaLabelledBy="blocked-user-title"
      usePortal
      surfaceClassName={styles.modalFrame}
    >
      <AdminModalHeader title="Дані заблокованого користувача" onClose={onClose} />

      <div className={styles.body}>
        <div className={styles.userSection}>
          <ModalRow icon={<Icon src="/icons/account/archive/clarity_avatar-line.svg" />}>
            {MOCK_USER.name}
          </ModalRow>
          <ModalRow icon={<Icon src="/icons/account/archive/phone.svg" />}>
            {MOCK_USER.phone}
          </ModalRow>
          <ModalRow icon={<Icon src="/icons/Footer/email.svg" />}>
            {MOCK_USER.email}
          </ModalRow>
        </div>

        <div className={styles.ordersSection}>
          {MOCK_ORDERS.map((order) => (
            <div key={order.id} className={styles.orderCard}>
              <p className={styles.orderTitle}>Замовлення №{order.id}</p>
              <ModalRow icon={<Icon src="/icons/Footer/map-point.svg" />}>
                {order.route}
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
                  <span>{order.tickets}</span>
                </span>
                <span className={styles.orderInlineSep} aria-hidden="true" />
                <span className={styles.orderInlineItem}>
                  <span className={styles.orderInlineIcon}><Icon src="/icons/currency-hryvnia.svg" /></span>
                  <span>{order.price}</span>
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className={styles.actions}>
          <Button text="Розблокувати" variant="success" size="full" onClick={onUnblock} />
          <Button text="Скасувати" variant="danger" size="full" onClick={onClose} />
        </div>
      </div>
    </ModalFrame>
  );
}
