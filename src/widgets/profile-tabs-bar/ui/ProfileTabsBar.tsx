"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import type { ReactNode } from "react";

import { AUTH_BACKGROUND_KEY } from "@/src/features/auth";
import { useLogoutMutation } from "@/src/features/auth/api/useAuthQueries";
import LocaleLink from "@/src/shared/i18n/Link";
import Chip from "@/src/shared/ui/Chip/Chip";
import { useI18n, useLocalizedHref } from "@/src/shared/i18n/I18nProvider";
import SlantedChip from "@/src/shared/ui/SlantedChip/SlantedChip";
import styles from "./ProfileTabsBar.module.css";

export type ProfileTabsBarItem = {
  label: ReactNode;
  href?: string;
  active?: boolean;
};

type ProfileTabsBarProps = {
  ariaLabel: string;
  items: ProfileTabsBarItem[];
  className?: string;
  showExitButton?: boolean;
};

export default function ProfileTabsBar({
  ariaLabel,
  items,
  className = "",
  showExitButton = false,
}: ProfileTabsBarProps) {
  const router = useRouter();
  const resolveHref = useLocalizedHref();
  const { t } = useI18n();
  const logoutMutation = useLogoutMutation();
  const classes = `${styles.tabsBar} ${className}`.trim();

  const handleLogout = async () => {
    try {
      logoutMutation.mutateAsync();
      router.replace(resolveHref("/"));
    } catch (error) {
      console.error("Logout request failed", error);
    } finally {
      if (typeof window !== "undefined") {
        window.sessionStorage.removeItem(AUTH_BACKGROUND_KEY);
      }
    }
  };

  return (
    <section className={classes} aria-label={ariaLabel}>
      <div className={styles.tabsInner}>
        <div className={styles.tabsNav}>
          <div className={styles.tabsRow}>
            {items.map((item, index) => {
              const chip = item.active ? (
                <SlantedChip
                  className={`${styles.tabChip} ${styles.tabChipActive}`.trim()}
                >
                  {item.label}
                </SlantedChip>
              ) : (
                <Chip
                  className={`${styles.tabChip} ${styles.tabChipMuted}`.trim()}
                >
                  {item.label}
                </Chip>
              );

              return (
                <div
                  key={`${String(item.label)}-${index}`}
                  className={styles.tabItem}
                >
                  {item.href && !item.active ? (
                    <LocaleLink href={item.href} className={styles.tabLink}>
                      {chip}
                    </LocaleLink>
                  ) : (
                    chip
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {showExitButton ? (
          <button
            type="button"
            className={styles.exitButton}
            aria-label={t("profile.logoutAria")}
            onClick={handleLogout}
          >
            <Image
              src="/icons/account/exit-icon-v2.svg"
              alt=""
              className={styles.exitIcon}
              width={24}
              height={24}
              aria-hidden="true"
              unoptimized
            />
          </button>
        ) : null}
      </div>
    </section>
  );
}
