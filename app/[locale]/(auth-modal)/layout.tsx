"use client";

import { useRouter } from "next/navigation";
import { closeAuthRoute } from "@/src/features/auth/model/auth-flow";
import ModalFrame from "@/src/shared/ui/ModalFrame/ModalFrame";

export default function AuthModalLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const close = () => {
    closeAuthRoute(router, { preferBack: true });
  };

  return (
    <ModalFrame onClose={close} variant="route" surfaceOverflow="visible">
        {children}
    </ModalFrame>
  );
}
