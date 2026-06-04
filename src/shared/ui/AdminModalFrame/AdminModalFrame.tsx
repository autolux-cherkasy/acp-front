"use client";

import type { ReactNode } from "react";
import { useEffect } from "react";
import { useI18n } from "@/src/shared/i18n/I18nProvider";
import AdminModalHeader from "@/src/shared/ui/AdminModalHeader/AdminModalHeader";
import Button from "@/src/shared/ui/Button/Button";
import ModalFrame from "@/src/shared/ui/ModalFrame/ModalFrame";
import styles from "./AdminModalFrame.module.css";

type AdminModalFrameProps = {
  mode: "create" | "edit";
  title: string;
  onClose: () => void;
  onSubmit: () => void;
  onDelete?: () => void;
  children: ReactNode;
};

export default function AdminModalFrame({
  mode,
  title,
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
      <AdminModalHeader title={title} onClose={onClose} />

      <div className={styles.body}>{children}</div>

      <div className={[styles.footer, styles[mode]].join(" ")}>
        {mode === "edit" && (
          <Button
            text={t("common.actions.delete")}
            variant="danger"
            onClick={onDelete}
          />
        )}
        <Button
          text={t("common.actions.cancel")}
          variant="outlined"
          onClick={onClose}
        />
        <Button
          text={mode === "create" ? t("common.actions.add") : t("common.actions.save")}
          variant="success"
          onClick={onSubmit}
        />
      </div>
    </ModalFrame>
  );
}
