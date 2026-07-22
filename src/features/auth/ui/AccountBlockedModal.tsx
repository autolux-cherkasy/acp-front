"use client";

import { useI18n } from "@/src/shared/i18n/I18nProvider";
import ModalCloseButton from "@/src/shared/ui/ModalCloseButton/ModalCloseButton";
import ModalFrame, { useModalClose } from "@/src/shared/ui/ModalFrame/ModalFrame";
import styles from "./AccountBlockedModal.module.css";

function AccountBlockedModalBody() {
  const { t } = useI18n();
  const requestClose = useModalClose();

  return (
    <div className={styles.body}>
      <ModalCloseButton
        onClose={requestClose}
        ariaLabel={t("common.close")}
        className={styles.closeButton}
      />
      <h2 className={styles.title}>{t("accountBlockedModal.title")}</h2>
      <p className={styles.description}>{t("accountBlockedModal.description")}</p>
    </div>
  );
}

type Props = {
  onClose: () => void;
};

export default function AccountBlockedModal({ onClose }: Props) {
  return (
    <ModalFrame onClose={onClose} surfaceClassName={styles.surface}>
      <AccountBlockedModalBody />
    </ModalFrame>
  );
}
