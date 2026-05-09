"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

import Button from "@/src/shared/ui/Button/Button";
import BreadcrumbChips from "@/src/shared/ui/BreadcrumbChips/BreadcrumbChips";
import { useI18n } from "@/src/shared/i18n/I18nProvider";
import ProfileTabsBar from "@/src/widgets/profile-tabs-bar";
import { getArchivedTickets } from "../api/archive-tickets";
import type { ArchivedTicket } from "../model/archive-tickets";
import styles from "./profile-archive-page.module.css";

export default function ProfileArchivePage() {
  const { t } = useI18n();
  const [tickets, setTickets] = useState<ArchivedTicket[]>([]);

  useEffect(() => {
    void getArchivedTickets().then((response) => {
      setTickets(response.tickets);
    });
  }, []);

  return (
    <main className={styles.page}>
      <div className={styles.container}>
        <BreadcrumbChips
          ariaLabel={t("profile.breadcrumbsAria")}
          items={[
            { label: t("menu.home"), href: "/#home" },
            { label: t("profile.title"), href: "/profile" },
            { label: t("profile.tabs.archive"), current: true },
          ]}
        />

        <ProfileTabsBar
          ariaLabel={t("profile.tabsAria")}
          showExitButton
          items={[
            { label: t("profile.tabs.tickets"), href: "/profile/tickets" },
            { label: t("profile.tabs.archive"), active: true },
            { label: t("profile.tabs.profile"), href: "/profile" },
          ]}
        />

        <section className={styles.card} aria-labelledby="archive-title">
          <h1 id="archive-title" className={styles.srOnly}>
            {t("profile.tabs.archive")}
          </h1>

          <div className={styles.blocks}>
            {tickets.map((ticket) => (
              <section key={ticket.code} className={styles.archiveBlock} aria-label={ticket.code}>
                <div className={styles.dateRow}>
                  <span className={styles.dateLabel}>{ticket.date}</span>
                </div>

                <div className={styles.ticketRow}>
                  <div className={styles.ticketCardRoute}>
                    <div className={styles.ticketTitleRow}>
                      <h2 className={styles.ticketTitle}>
                        Бронювання {ticket.code} - {ticket.price}
                      </h2>
                      <span
                        className={`${styles.ticketBadge} ${
                          ticket.statusTone === "success" ? styles.ticketBadgeSuccess : styles.ticketBadgeMuted
                        }`.trim()}
                      >
                        {ticket.status}
                      </span>
                      <span className={styles.ticketMetaDate}>{ticket.metaDate}</span>
                    </div>

                    <div className={styles.routeBody}>
                      <div className={styles.timeColumn}>
                        <span>{ticket.routeFrom.time}</span>
                        <span>{ticket.routeTo.time}</span>
                      </div>

                      <div className={styles.routeLine} aria-hidden="true">
                        <span className={styles.routeCircle} />
                        <span className={styles.routeDots} />
                        <span className={styles.routeCircleFilled} />
                      </div>

                      <div className={styles.routeStations}>
                        <div className={styles.stationBlock}>
                          <div className={styles.stationCity}>{ticket.routeFrom.city}</div>
                          <div className={styles.stationName}>{ticket.routeFrom.station}</div>
                        </div>
                        <div className={styles.stationBlock}>
                          <div className={styles.stationCity}>{ticket.routeTo.city}</div>
                          <div className={styles.stationName}>{ticket.routeTo.station}</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className={styles.ticketCardPrice}>
                    <div className={styles.passengerRow}>
                      <div className={styles.passengerItem}>
                        <Image
                          src="/icons/account/archive/clarity_avatar-line.svg"
                          alt=""
                          width={24}
                          height={24}
                          className={styles.passengerIcon}
                          aria-hidden="true"
                        />
                        <span className={styles.passengerName}>{ticket.passengerName}</span>
                      </div>

                      <div className={styles.passengerItem}>
                        <Image
                          src="/icons/account/archive/phone.svg"
                          alt=""
                          width={24}
                          height={24}
                          className={styles.passengerIcon}
                          aria-hidden="true"
                        />
                        <span className={styles.passengerPhone}>{ticket.passengerPhone}</span>
                      </div>

                      <div className={styles.passengerItem}>
                        <Image
                          src="/icons/account/archive/ticket-outline.svg"
                          alt=""
                          width={24}
                          height={24}
                          className={styles.passengerIcon}
                          aria-hidden="true"
                        />
                        <span className={styles.passengerSeat}>{ticket.seatCount}</span>
                      </div>
                    </div>

                    <div className={styles.priceValue}>{ticket.price}</div>

                    <div className={styles.actions}>
                      <Button text={t("profile.archive.pay")} variant="primary" />
                      <Button text={t("profile.archive.cancel")} variant="secondary" />
                    </div>
                  </div>
                </div>
              </section>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
