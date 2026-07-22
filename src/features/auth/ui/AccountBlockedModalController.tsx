"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";

import {
  ACCOUNT_BLOCKED_ERROR_PARAM,
  AUTH_ERROR_QUERY_PARAM,
  AUTH_QUERY_PARAM,
} from "@/src/features/auth/model/auth-flow";
import { useLockBodyScroll } from "@/src/shared/ui/ModalFrame/useLockBodyScroll";
import AccountBlockedModal from "./AccountBlockedModal";

export default function AccountBlockedModalController() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isOpen = searchParams.get(AUTH_ERROR_QUERY_PARAM) === ACCOUNT_BLOCKED_ERROR_PARAM;

  const handleClose = useCallback(() => {
    const nextParams = new URLSearchParams(searchParams.toString());
    nextParams.delete(AUTH_ERROR_QUERY_PARAM);
    nextParams.delete(AUTH_QUERY_PARAM);
    const query = nextParams.toString();
    router.replace(`${window.location.pathname}${query ? `?${query}` : ""}`, {
      scroll: false,
    });
  }, [router, searchParams]);

  useLockBodyScroll(isOpen);

  if (!isOpen) {
    return null;
  }

  return <AccountBlockedModal onClose={handleClose} />;
}
