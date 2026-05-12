"use client";

import Image from "next/image";

import { useI18n } from "@/src/shared/i18n/I18nProvider";
import LocaleLink from "@/src/shared/i18n/Link";
import SurfacePanel from "@/src/shared/ui/SurfacePanel/SurfacePanel";
import ProfileWrapper from "../../profile/ui/ProfileWrapper";
import styles from "./profile-tickets-page.module.css";

export default function ProfileTicketsPage() {
  const { t } = useI18n();

  return (
    <ProfileWrapper mode="tickets">
      <section className={styles.emptyState} aria-labelledby="tickets-title">
        <h1 id="tickets-title" className={styles.srOnly}>
          {t("profile.tickets.title")}
        </h1>

        <SurfacePanel className={styles.emptyCard}>
          <div className={styles.emptyContentWrapper}>
            {/* Блок з ілюстрацією */}
            <div className={styles.illustrationBox}>
              <Image
                src="/icons/account/tickets/fontisto_bus-ticket.svg"
                alt=""
                width={301}
                height={301}
                className={styles.ticketBack}
              />
              <Image
                src="/icons/account/tickets/fontisto_bus-ticket.svg"
                alt=""
                width={301}
                height={301}
                className={styles.ticketFront}
              />
            </div>

            {/* Блок з текстом та кнопкою */}
            <div className={styles.textAndActionBlock}>
              <h2 className={styles.emptyStateText}>
                {t("profile.tickets.empty.title")}
              </h2>
              <LocaleLink href="/#routes" className={styles.searchButton}>
                {t("profile.tickets.empty.action")}
              </LocaleLink>
            </div>
          </div>
        </SurfacePanel>
      </section>
    </ProfileWrapper>
  );
}
