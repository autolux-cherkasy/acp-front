"use client";

import type { ReactNode } from "react";
import Portal from "@/src/shared/ui/Portal/Portal";
import ModalCloseButton from "@/src/shared/ui/ModalCloseButton/ModalCloseButton";
import { useI18n } from "@/src/shared/i18n/I18nProvider";
import styles from "./ModalFrame.module.css";

type Props = {
  children: ReactNode;
  onClose?: () => void;
  ariaLabelledBy?: string;
  title?: ReactNode;
  variant?: "route" | "dialog";
  usePortal?: boolean;
  backdropClassName?: string;
  surfaceClassName?: string;
  surfaceOverflow?: "hidden" | "visible";
};

function joinClassNames(...classNames: Array<string | undefined | false>) {
  return classNames.filter(Boolean).join(" ");
}

export default function ModalFrame({
  children,
  onClose,
  ariaLabelledBy,
  title,
  variant = "dialog",
  usePortal = false,
  backdropClassName,
  surfaceClassName,
  surfaceOverflow = "hidden",
}: Props) {
  const { t } = useI18n();

  const content = (
    <div
      className={joinClassNames(
        styles.backdrop,
        variant === "route" ? styles.routeBackdrop : styles.dialogBackdrop,
        backdropClassName,
      )}
      onPointerDown={(event) => {
        if (onClose && event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <div
        className={joinClassNames(
          variant === "route" ? styles.routeSurface : styles.dialogSurface,
          surfaceOverflow === "visible" ? styles.surfaceOverflowVisible : undefined,
          surfaceClassName,
        )}
        onPointerDown={(event) => event.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby={ariaLabelledBy}
      >
        {title && (
          <div className={styles.header}>
            <h2 className={styles.title} id={ariaLabelledBy}>
              {title}
            </h2>
            <ModalCloseButton onClose={onClose} ariaLabel={t("common.close")} />
          </div>
        )}
        {children}
      </div>
    </div>
  );

  if (usePortal) {
    return <Portal>{content}</Portal>;
  }

  return content;
}
