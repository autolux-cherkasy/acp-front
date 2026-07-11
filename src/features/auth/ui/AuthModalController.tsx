"use client";

import dynamic from "next/dynamic";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useMemo } from "react";

import {
  closeAuthModal,
  getAuthModalState,
  type AuthView,
} from "@/src/features/auth/model/auth-flow";
import { useLocalizedHref } from "@/src/shared/i18n/I18nProvider";
import ModalFrame, { useModalClose } from "@/src/shared/ui/ModalFrame/ModalFrame";
import { useLockBodyScroll } from "@/src/shared/ui/ModalFrame/useLockBodyScroll";

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

function AuthModalBody({ view }: { view: AuthView }) {
  const requestClose = useModalClose();
  return renderAuthView(view, requestClose);
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

  useLockBodyScroll(!!authState);

  if (!authState) {
    return null;
  }

  return (
    <ModalFrame onClose={handleClose} variant="route">
      <AuthModalBody view={authState.view} />
    </ModalFrame>
  );
}
