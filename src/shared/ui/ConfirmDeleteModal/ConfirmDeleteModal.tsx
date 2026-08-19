"use client";

import { useI18n } from "@/src/shared/i18n/I18nProvider";
import Button from "@/src/shared/ui/Button/Button";
import Icon from "@/src/shared/ui/Icon/Icon";
import ModalCloseButton from "@/src/shared/ui/ModalCloseButton/ModalCloseButton";
import ModalFrame, { useModalClose } from "@/src/shared/ui/ModalFrame/ModalFrame";
import { useRef } from "react";
import styles from "./ConfirmDeleteModal.module.css";

type ConfirmDeleteModalProps = {
  subject: string;
  /** Overrides default "Are you sure you want to delete …" prefix. */
  question?: string;
  /** Overrides default delete button label. */
  confirmLabel?: string;
  onCancel: () => void;
  onConfirm: () => void;
};

export default function ConfirmDeleteModal({
  subject,
  question,
  confirmLabel,
  onCancel,
  onConfirm,
}: ConfirmDeleteModalProps) {
  // Both buttons play the same exit animation; this decides which callback runs once it ends.
  const isConfirmedRef = useRef(false);

  return (
    <ModalFrame
      onClose={() => (isConfirmedRef.current ? onConfirm() : onCancel())}
      ariaLabelledBy="confirm-delete-title"
      backdropClassName={styles.backdrop}
      surfaceClassName={styles.surface}
    >
      <ConfirmDeleteModalBody
        subject={subject}
        question={question}
        confirmLabel={confirmLabel}
        onConfirm={() => {
          isConfirmedRef.current = true;
        }}
      />
    </ModalFrame>
  );
}

function ConfirmDeleteModalBody({
  subject,
  question,
  confirmLabel,
  onConfirm,
}: {
  subject: string;
  question?: string;
  confirmLabel?: string;
  onConfirm: () => void;
}) {
  const { t } = useI18n();
  const requestClose = useModalClose();
  const questionPrefix = question ?? t("common.confirmDelete.question");

  return (
    <>
      <div className={styles.card}>
        <span className={styles.infoIcon}>
          <Icon src="/icons/si_info-line.svg" size={24} />
        </span>

        <p id="confirm-delete-title" className={styles.question}>
          {`${questionPrefix} ${subject}?`}
        </p>

        <ModalCloseButton
          className={styles.closeButton}
          onClose={requestClose}
          ariaLabel={t("common.close")}
        />
      </div>

      <div className={styles.actions}>
        <Button
          text={t("common.confirmDelete.back")}
          variant="outlined"
          size="full"
          onClick={requestClose}
        />
        <Button
          text={confirmLabel ?? t("common.actions.delete")}
          variant="danger"
          size="full"
          onClick={() => {
            onConfirm();
            requestClose();
          }}
        />
      </div>
    </>
  );
}