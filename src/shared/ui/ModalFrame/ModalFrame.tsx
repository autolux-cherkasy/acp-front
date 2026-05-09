"use client";

import type { ReactNode } from "react";
import Portal from "@/src/shared/ui/Portal/Portal";
import styles from "./ModalFrame.module.css";

type Props = {
  children: ReactNode;
  onClose?: () => void;
  ariaLabelledBy?: string;
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
  variant = "dialog",
  usePortal = false,
  backdropClassName,
  surfaceClassName,
  surfaceOverflow = "hidden",
}: Props) {
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
        {children}
      </div>
    </div>
  );

  if (usePortal) {
    return <Portal>{content}</Portal>;
  }

  return content;
}
