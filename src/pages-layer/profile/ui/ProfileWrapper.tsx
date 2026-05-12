"use client";
import BreadcrumbChips from "@/src/shared/ui/BreadcrumbChips/BreadcrumbChips";
import styles from "./profile-page.module.css";
import { useI18n } from "@/src/shared";
import { ProfileTabsBar } from "@/src/widgets";
import { ReactNode } from "react";

type ProfileWrapperProps = {
  children: ReactNode;
  mode: "archive" | "tickets" | "profile";
  className?: string;
};
const ProfileWrapper = ({ children, mode, className }: ProfileWrapperProps) => {
  const { t } = useI18n();

  const breadcrumbCurrentLabel =
    mode === "tickets"
      ? t("profile.tickets.title")
      : mode === "archive"
        ? t("profile.tabs.archive")
        : t("profile.title");

  return (
    <main className={styles.page}>
      <div className={styles.container}>
        <BreadcrumbChips
          ariaLabel={t("profile.breadcrumbsAria")}
          items={[
            { label: t("menu.home"), href: "/#home" },
            { label: t("profile.cabinet"), current: true },
            ...(mode === "profile"
              ? [{ label: t("profile.title"), current: true }]
              : [{ label: breadcrumbCurrentLabel, current: true }]),
          ]}
        />
      </div>

      <ProfileTabsBar
        ariaLabel={t("profile.tabsAria")}
        className={styles.tabsBar}
        showExitButton
        items={[
          {
            label: t("profile.tabs.tickets"),
            href: mode === "tickets" ? undefined : "/profile/tickets",
            active: mode === "tickets",
          },
          {
            label: t("profile.tabs.archive"),
            href: mode === "archive" ? undefined : "/profile/archive",
            active: mode === "archive",
          },
          {
            label: t("profile.tabs.profile"),
            href: mode === "profile" ? undefined : "/profile",
            active: mode === "profile",
          },
        ]}
      />
      <div className={[styles.container, className].filter(Boolean).join(" ")}>
        {children}
      </div>
    </main>
  );
};

export default ProfileWrapper;
