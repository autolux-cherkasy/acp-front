"use client";

import { useAuthSession } from "@/src/features/auth/model/session";
import { useI18n, useLocalizedHref } from "@/src/shared/i18n/I18nProvider";
import Loader from "@/src/shared/ui/Loader/Loader";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

import { useDataSectionAccess } from "../model/dataAccess";
import { getRoleLandingPath } from "../model/roles";

import styles from "./RoleAccessGate.module.css";

type DataAccessGateProps = {
  children: React.ReactNode;
};


export default function DataAccessGate({ children }: DataAccessGateProps) {
  const router = useRouter();
  const resolveHref = useLocalizedHref();
  const { t } = useI18n();
  const { role } = useAuthSession();
  const isAllowed = useDataSectionAccess();

  useEffect(() => {
    if (isAllowed === false) {
      router.replace(resolveHref(getRoleLandingPath(role)));
    }
  }, [isAllowed, resolveHref, role, router]);

  if (isAllowed === undefined) {
    return (
      <section className={styles.state}>
        <Loader text={t("common.loading")} />
      </section>
    );
  }

  if (!isAllowed) {
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
