"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import ForgotPasswordPage from "@/src/pages-layer/auth/forgot-password/ui/ForgotPasswordPage";
import { closeAuthRoute } from "@/src/features/auth/model/auth-flow";
import ModalFrame from "@/src/shared/ui/ModalFrame/ModalFrame";

export default function ForgotPasswordModalRoute() {
  const router = useRouter();
  const [isDismissed, setIsDismissed] = useState(false);

  const close = useCallback(() => {
    setIsDismissed(true);
    closeAuthRoute(router);
  }, [router]);

  useEffect(() => {
    if (isDismissed) {
      document.body.style.overflow = "";
      return;
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
    };

    const scrollY = window.scrollY;
    sessionStorage.setItem("scroll:position", scrollY.toString());

    document.body.style.overflow = "hidden";

    window.addEventListener("keydown", onKeyDown);

    return () => {
      const savedScrollY = sessionStorage.getItem("scroll:position");
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKeyDown);

      if (savedScrollY) {
        requestAnimationFrame(() => {
          window.scrollTo(0, parseInt(savedScrollY, 10));
          sessionStorage.removeItem("scroll:position");
        });
      }
    };
  }, [close, isDismissed]);

  if (isDismissed) {
    return null;
  }

  return (
    <ModalFrame onClose={close} variant="route">
        <ForgotPasswordPage onClose={close} />
    </ModalFrame>
  );
}
