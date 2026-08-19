"use client";

import { useI18n } from "@/src/shared/i18n/I18nProvider";
import ModalCloseButton from "@/src/shared/ui/ModalCloseButton/ModalCloseButton";
import * as Dialog from "@radix-ui/react-dialog";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type AnimationEvent,
  type ReactNode,
} from "react";
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
  onEscapeKeyDown?: (event: KeyboardEvent) => void;
};

const ModalCloseContext = createContext<(() => void) | null>(null);

// Lets a modal's own close/cancel controls trigger the same animated exit as
// the backdrop click or Escape key, instead of unmounting the modal instantly.
export function useModalClose() {
  const requestClose = useContext(ModalCloseContext);

  if (!requestClose) {
    throw new Error("useModalClose must be used within a ModalFrame");
  }

  return requestClose;
}

function joinClassNames(...classNames: Array<string | undefined | false>) {
  return classNames.filter(Boolean).join(" ");
}

export default function ModalFrame({
  children,
  onClose,
  ariaLabelledBy,
  title,
  variant = "dialog",
  backdropClassName,
  surfaceClassName,
  surfaceOverflow = "hidden",
  onEscapeKeyDown,
}: Props) {
  const { t } = useI18n();
  const [isOpen, setIsOpen] = useState(true);
  const hasClosedRef = useRef(false);
  const onCloseRef = useRef(onClose);

  // Синхронізуємо в ефекті, а не під час рендеру: finishClose читає ref лише
  // з таймера чи animationend, тобто вже після коміту, тож свіжий onClose
  // там гарантовано є.
  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  const finishClose = useCallback(() => {
    if (hasClosedRef.current) return;
    hasClosedRef.current = true;
    onCloseRef.current?.();
  }, []);

  const requestClose = useCallback(() => {
    setIsOpen(false);
  }, []);

  // animationend may never fire (prefers-reduced-motion: animation: none).
  useEffect(() => {
    if (isOpen) return;

    const reducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reducedMotion) {
      finishClose();
      return;
    }

    const timeoutId = window.setTimeout(finishClose, 300);
    return () => window.clearTimeout(timeoutId);
  }, [isOpen, finishClose]);

  const handleBackdropAnimationEnd = (event: AnimationEvent<HTMLDivElement>) => {
    if (event.target !== event.currentTarget) return;
    if (isOpen) return;
    finishClose();
  };

  const content = (
    <Dialog.Root
      open={isOpen}
      onOpenChange={(nextOpen) => {
        if (!nextOpen) requestClose();
      }}
    >
      <Dialog.Portal>
        <Dialog.Overlay
          className={joinClassNames(
            styles.backdrop,
            variant === "route" ? styles.routeBackdrop : styles.dialogBackdrop,
            backdropClassName,
          )}
          onAnimationEnd={handleBackdropAnimationEnd}
        >
          <Dialog.Content
            className={joinClassNames(
              variant === "route" ? styles.routeSurface : styles.dialogSurface,
              surfaceOverflow === "visible" ? styles.surfaceOverflowVisible : undefined,
              surfaceClassName,
            )}
            onPointerDownOutside={(e) => {
              const target = e.target as Element;
              if (target.closest("[data-radix-popper-content-wrapper]")) return;
              requestClose();
            }}
            onEscapeKeyDown={onEscapeKeyDown}
            aria-labelledby={ariaLabelledBy}
          >
            {title && (
              <div className={styles.header}>
                <h2 className={styles.title} id={ariaLabelledBy}>
                  {title}
                </h2>
                <ModalCloseButton onClose={requestClose} ariaLabel={t("common.close")} />
              </div>
            )}
            <ModalCloseContext.Provider value={requestClose}>{children}</ModalCloseContext.Provider>
          </Dialog.Content>
        </Dialog.Overlay>
      </Dialog.Portal>
    </Dialog.Root>
  );

  return content;
}
