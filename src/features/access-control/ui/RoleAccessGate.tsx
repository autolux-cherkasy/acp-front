"use client";

import type { UserRole } from "@/src/entities/user";
import { useAuthSession } from "@/src/features/auth/model/session";
import {
  AUTH_FALLBACK_PATH,
  buildAuthModalHref,
  consumeLogoutRedirectBypass,
  normalizeInternalHref,
} from "@/src/features/auth/model/auth-flow";
import { useI18n, useLocalizedHref } from "@/src/shared/i18n/I18nProvider";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useEffect, useMemo } from "react";

import { getRoleLandingPath, hasRequiredRole } from "../model/roles";
import styles from "./RoleAccessGate.module.css";

type RoleAccessGateProps = {
  allowedRoles: readonly UserRole[];
  children: React.ReactNode;
};

export default function RoleAccessGate({
  allowedRoles,
  children,
}: RoleAccessGateProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const resolveHref = useLocalizedHref();
  const { t } = useI18n();
  const { isAuthenticated, isLoading, role } = useAuthSession();
  const currentSearch = useMemo(() => searchParams.toString(), [searchParams]);

  useEffect(() => {
    if (isLoading) return;

    if (!isAuthenticated) {
      if (consumeLogoutRedirectBypass()) {
        router.replace(resolveHref(AUTH_FALLBACK_PATH));
        return;
      }

      const intendedDestination = normalizeInternalHref(
        `${pathname}${currentSearch ? `?${currentSearch}` : ""}`,
      );
      const redirectHref = buildAuthModalHref(resolveHref(AUTH_FALLBACK_PATH), {
        view: "login",
        next: intendedDestination,
      });

      router.replace(redirectHref);
      return;
    }

    if (!hasRequiredRole(role, allowedRoles)) {
      router.replace(resolveHref(getRoleLandingPath(role)));
    }
  }, [
    allowedRoles,
    currentSearch,
    isAuthenticated,
    isLoading,
    pathname,
    resolveHref,
    role,
    router,
  ]);

  if (isLoading) {
    return (
      <section className={styles.state}>
        <div className={styles.card}>
          <h1 className={styles.title}>{t("accessControl.loadingTitle")}</h1>
          <p className={styles.description}>{t("accessControl.loadingDescription")}</p>
        </div>
      </section>
    );
  }

  if (!isAuthenticated) {
    return (
      <section className={styles.state}>
        <div className={styles.card}>
          <h1 className={styles.title}>{t("accessControl.loginRequiredTitle")}</h1>
          <p className={styles.description}>{t("accessControl.loginRequiredDescription")}</p>
        </div>
      </section>
    );
  }

  if (!hasRequiredRole(role, allowedRoles)) {
    return (
      <section className={styles.state}>
        <div className={styles.card}>
          <h1 className={styles.title}>{t("accessControl.forbiddenTitle")}</h1>
          <p className={styles.description}>{t("accessControl.forbiddenDescription")}</p>
        </div>
      </section>
    );
  }

  return <>{children}</>;
}
