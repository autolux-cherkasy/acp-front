"use client";

import dynamic from "next/dynamic";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo } from "react";

import {
  closeAuthModal,
  getAuthModalState,
  type AuthView,
} from "@/src/features/auth/model/auth-flow";
import { useLocalizedHref } from "@/src/shared/i18n/I18nProvider";
import ModalFrame from "@/src/shared/ui/ModalFrame/ModalFrame";

const LoginPage = dynamic(
  () => import("@/src/pages-layer/auth/login/ui/LoginPage"),
  {
    ssr: false,
    loading: () => <AuthModalFallback />,
  },
);

const RegisterPage = dynamic(
  () => import("@/src/pages-layer/auth/register/ui/RegisterPage"),
  {
    ssr: false,
    loading: () => <AuthModalFallback />,
  },
);

const ForgotPasswordPage = dynamic(
  () => import("@/src/pages-layer/auth/forgot-password/ui/ForgotPasswordPage"),
  {
    ssr: false,
    loading: () => <AuthModalFallback />,
  },
);

function AuthModalFallback() {
  return <div style={{ minHeight: 320 }} aria-hidden="true" />;
}

function renderAuthView(view: AuthView, onClose: () => void) {
  switch (view) {
    case "register":
      return <RegisterPage onClose={onClose} />;
    case "forgot-password":
      return <ForgotPasswordPage onClose={onClose} />;
    case "login":
    default:
      return <LoginPage onClose={onClose} />;
  }
}

export default function AuthModalController() {
  const router = useRouter();
  const resolveHref = useLocalizedHref();
  const searchParams = useSearchParams();
  const authState = useMemo(
    () => getAuthModalState(searchParams),
    [searchParams],
  );

  const handleClose = useCallback(() => {
    closeAuthModal(router, resolveHref);
  }, [resolveHref, router]);

  useEffect(() => {
    if (!authState) {
      return;
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        handleClose();
      }
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [authState, handleClose]);

  if (!authState) {
    return null;
  }

  return (
    <ModalFrame onClose={handleClose} variant="route">
      {renderAuthView(authState.view, handleClose)}
    </ModalFrame>
  );
}
