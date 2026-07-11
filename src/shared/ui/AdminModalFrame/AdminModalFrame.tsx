"use client";

import { useI18n } from "@/src/shared/i18n/I18nProvider";
import Button from "@/src/shared/ui/Button/Button";
import ModalCloseButton from "@/src/shared/ui/ModalCloseButton/ModalCloseButton";
import ModalFrame, { useModalClose } from "@/src/shared/ui/ModalFrame/ModalFrame";
import type { CSSProperties, ReactNode } from "react";
import styles from "./AdminModalFrame.module.css";

type AdminModalFrameProps = {
  mode: "create" | "edit";
  title: string;
  icon?: string;
  onClose: () => void;
  onSubmit: () => void;
  onDelete?: () => void;
  children: ReactNode;
};

export default function AdminModalFrame({
  mode,
  title,
  icon,
  onClose,
  onSubmit,
  onDelete,
  children,
}: AdminModalFrameProps) {
  return (
    <ModalFrame
      onClose={onClose}
      ariaLabelledBy="admin-modal-title"
      usePortal
      surfaceClassName={styles.surface}
    >
      <AdminModalFrameBody mode={mode} title={title} icon={icon} onSubmit={onSubmit} onDelete={onDelete}>
        {children}
      </AdminModalFrameBody>
    </ModalFrame>
  );
}

function AdminModalFrameBody({
  mode,
  title,
  icon,
  onSubmit,
  onDelete,
  children,
}: Omit<AdminModalFrameProps, "onClose">) {
  const { t } = useI18n();
  const requestClose = useModalClose();

  return (
    <>
      <ModalCloseButton
        className={styles.closeButton}
        onClose={requestClose}
        ariaLabel={t("common.close")}
      />

      <div className={styles.titleRow}>
        {icon && (
          <span
            aria-hidden="true"
            className={styles.titleIcon}
            style={{ "--title-icon-url": `url(${icon})` } as CSSProperties}
          />
        )}
        <h2 id="admin-modal-title" className={styles.title}>
          {title}
        </h2>
      </div>

      <div className={styles.body}>{children}</div>

      <div className={[styles.footer, styles[mode]].join(" ")}>
        {mode === "edit" && (
          <Button text={t("common.actions.delete")} variant="danger" size="full" onClick={onDelete} />
        )}
        <Button text={t("common.actions.cancel")} variant="outlined" size="full" onClick={requestClose} />
        <Button
          text={mode === "create" ? t("common.actions.add") : t("common.actions.save")}
          variant="success"
          size="full"
          onClick={onSubmit}
        />
      </div>
    </>
  );
}
