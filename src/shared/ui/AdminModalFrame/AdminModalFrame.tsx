"use client";

import type { CSSProperties, ReactNode } from "react";
import { useEffect } from "react";
import { useI18n } from "@/src/shared/i18n/I18nProvider";
import Button from "@/src/shared/ui/Button/Button";
import ModalCloseButton from "@/src/shared/ui/ModalCloseButton/ModalCloseButton";
import ModalFrame from "@/src/shared/ui/ModalFrame/ModalFrame";
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
  const { t } = useI18n();

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
      ariaLabelledBy="admin-modal-title"
      usePortal
      surfaceClassName={styles.surface}
    >
      <ModalCloseButton
        className={styles.closeButton}
        onClose={onClose}
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
          <Button text={t("common.actions.delete")} variant="danger" onClick={onDelete} />
        )}
        <Button text={t("common.actions.cancel")} variant="outlined" onClick={onClose} />
        <Button
          text={mode === "create" ? t("common.actions.add") : t("common.actions.save")}
          variant="success"
          onClick={onSubmit}
        />
      </div>
    </ModalFrame>
  );
}
