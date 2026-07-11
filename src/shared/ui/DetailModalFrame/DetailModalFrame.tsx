"use client";

import type { ReactNode } from "react";
import ModalFrame from "@/src/shared/ui/ModalFrame/ModalFrame";
import { useLockBodyScroll } from "@/src/shared/ui/ModalFrame/useLockBodyScroll";

type Props = {
  onClose: () => void;
  ariaLabelledBy: string;
  surfaceClassName?: string;
  onEscapeKeyDown?: (event: KeyboardEvent) => void;
  children: ReactNode;
};

export default function DetailModalFrame({
  onClose,
  ariaLabelledBy,
  surfaceClassName,
  onEscapeKeyDown,
  children,
}: Props) {
  useLockBodyScroll();

  return (
    <ModalFrame
      onClose={onClose}
      ariaLabelledBy={ariaLabelledBy}
      usePortal
      surfaceClassName={surfaceClassName}
      onEscapeKeyDown={onEscapeKeyDown}
    >
      {children}
    </ModalFrame>
  );
}
