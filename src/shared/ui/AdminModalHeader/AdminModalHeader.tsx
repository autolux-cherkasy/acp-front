"use client";
import { useI18n } from "../../i18n";
import ModalCloseButton from "../ModalCloseButton/ModalCloseButton";
import styles from "./AdminModalHeader.module.css";

const AdminModalHeader = ({ title, onClose }: { title: string; onClose: () => void }) => {
  const { t } = useI18n();
  return (
    <div className={styles.header}>
      <h2 className={styles.title} id="new-order-title">
        {title}
      </h2>
      <div className={styles.closeButton}>
        <ModalCloseButton onClose={onClose} ariaLabel={t("common.close")} />
      </div>
    </div>
  );
};

export default AdminModalHeader;
