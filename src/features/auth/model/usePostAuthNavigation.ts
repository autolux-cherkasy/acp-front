"use client";

import {
  AUTH_NEXT_QUERY_PARAM,
  getPostAuthDestination,
  normalizeInternalHref,
} from "@/src/features/auth/model/auth-flow";
import { useLocalizedHref } from "@/src/shared/i18n/I18nProvider";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";

import { useAuthSession } from "./session";

export function usePostAuthNavigation() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const resolveHref = useLocalizedHref();
  const { refreshSession } = useAuthSession();

  return useCallback(async () => {
    const profile = await refreshSession();
    const next = normalizeInternalHref(searchParams.get(AUTH_NEXT_QUERY_PARAM));
    const destination = getPostAuthDestination({ next, role: profile?.role });

    router.replace(resolveHref(destination));
  }, [refreshSession, resolveHref, router, searchParams]);
}
