"use client";

import type { ReactNode } from "react";
import { useRouter } from "next/navigation";

import { closeAuthRoute } from "@/src/features/auth/model/auth-flow";
import { useI18n } from "@/src/shared/i18n/I18nProvider";
import AuthShell from "@/src/shared/ui/AuthShell/AuthShell";
import styles from "./password-recovery-shell.module.css";

type PasswordRecoveryShellProps = {
  title: string;
  subtitle: string;
  titleId: string;
  onClose?: () => void;
  shellClassName?: string;
  contentClassName?: string;
  asideClassName?: string;
  cardClassName?: string;
  children: ReactNode;
};

export default function PasswordRecoveryShell({
  title,
  subtitle,
  titleId,
  onClose,
  shellClassName,
  contentClassName,
  asideClassName,
  cardClassName,
  children,
}: PasswordRecoveryShellProps) {
  const router = useRouter();
  const { t } = useI18n();

  const promoItems = [
    t("auth.common.promo.one"),
    t("auth.common.promo.two"),
    t("auth.common.promo.three"),
  ];

  const handleCloseAuthFlow = () => {
    if (onClose) {
      onClose();
      return;
    }

    closeAuthRoute(router);
  };

  return (
    <AuthShell
      logoAlt={t("header.logoAlt")}
      closeLabel={t("common.close")}
      brandDescription={t("auth.common.brandDesc")}
      promoItems={promoItems}
      backgroundImage="/(auth)/forgot-pass/forgot-bus.jpg"
      onClose={handleCloseAuthFlow}
      variant="recovery"
      compact={Boolean(shellClassName || contentClassName || asideClassName || cardClassName)}
      shellClassName={shellClassName}
      contentClassName={contentClassName}
      asideClassName={asideClassName}
      promoClassName={styles.infoBlock}
      cardClassName={cardClassName}
    >
        <section aria-labelledby={titleId} className={styles.shellSection}>
          <h1 id={titleId} className={styles.title}>
            {title}
          </h1>
          <p className={styles.subtitle}>{subtitle}</p>
          {children}
        </section>
    </AuthShell>
  );
}
