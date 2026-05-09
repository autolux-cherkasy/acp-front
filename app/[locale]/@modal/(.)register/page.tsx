"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import RegisterPage from "@/src/pages-layer/auth/register/ui/RegisterPage";
import { closeAuthRoute } from "@/src/features/auth/model/auth-flow";
import ModalFrame from "@/src/shared/ui/ModalFrame/ModalFrame";

export default function RegisterModalRoute() {
  const router = useRouter();
  const [isDismissed, setIsDismissed] = useState(false);

  const close = useCallback(() => {
    setIsDismissed(true);
    closeAuthRoute(router, { preferBack: true });
  }, [router]);

  useEffect(() => {
    if (isDismissed) {
      document.body.style.overflow = "";
      return;
    }

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };

    // зберігаємо позицію скролу
    const scrollY = window.scrollY;
    sessionStorage.setItem("scroll:position", scrollY.toString());

    // Блокуємо фон сторінки, але не скрол усередині модалки
    document.body.style.overflow = "hidden";

    window.addEventListener("keydown", onKeyDown);

    return () => {
      // Восстановлюємо скролл
      const savedScrollY = sessionStorage.getItem("scroll:position");
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKeyDown);
      
      // Повертаємо до збереженої позиції після видалення стилів
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
        <RegisterPage onClose={close} />
    </ModalFrame>
  );
}
