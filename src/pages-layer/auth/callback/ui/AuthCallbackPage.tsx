"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

import { exchangeOAuthCode } from "@/src/features/auth/api/auth";
import { getPostAuthDestination } from "@/src/features/auth/model/auth-flow";
import { useAuthSession } from "@/src/features/auth/model/session";
import { setCsrfToken } from "@/src/shared/api/session";
import { useI18n, useLocalizedHref } from "@/src/shared/i18n/I18nProvider";
import Loader from "@/src/shared/ui/Loader/Loader";

export default function AuthCallbackPage() {
  const router = useRouter();
  const resolveHref = useLocalizedHref();
  const { t } = useI18n();
  const { refreshSession } = useAuthSession();
  const ran = useRef(false);

  useEffect(() => {
    if (ran.current) return;
    ran.current = true;

    const code = new URLSearchParams(window.location.hash.replace(/^#/, "")).get(
      "code",
    );

    window.history.replaceState(
      null,
      "",
      `${window.location.pathname}${window.location.search}`,
    );

    const fail = () => {
      router.replace(resolveHref("/home?auth=login&error=oauth"));
    };

    if (!code) {
      fail();
      return;
    }

    void (async () => {
      try {
        const data = await exchangeOAuthCode(code);
        if (data.csrf_token) setCsrfToken(data.csrf_token);
        const profile = await refreshSession();
        router.replace(
          resolveHref(getPostAuthDestination({ role: profile?.role })),
        );
      } catch {
        fail();
      }
    })();
  }, [refreshSession, resolveHref, router]);

  return <Loader text={t("googleAuth.submitting")} />;
}
