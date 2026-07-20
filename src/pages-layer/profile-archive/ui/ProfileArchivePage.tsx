"use client";

import Image from "next/image";

import { useBookingHistoryQuery } from "@/src/entities/booking";
import { useI18n } from "@/src/shared/i18n/I18nProvider";
import Button from "@/src/shared/ui/Button/Button";
import ProfileWrapper from "../../profile/ui/ProfileWrapper";
import { toArchivedTicket } from "../model/archive-tickets";
import styles from "./profile-archive-page.module.css";

export default function ProfileArchivePage() {
  const { t, locale } = useI18n();
  const historyQuery = useBookingHistoryQuery();

  const tickets = (historyQuery.data ?? []).map((booking) => toArchivedTicket(booking, locale));

  return (
    <ProfileWrapper mode="archive" className={styles.wrapperContent}>
      <section className={styles.card} aria-labelledby="archive-title">
        <h1 id="archive-title" className={styles.srOnly}>
          {t("profile.tabs.archive")}
        </h1>

        {historyQuery.isPending ? (
          <p className={styles.notice}>{t("common.loading")}</p>
        ) : null}

        {historyQuery.isError ? (
          <div className={`${styles.notice} ${styles.noticeError}`} role="alert">
            <span>{t("profile.archive.loadError")}</span>
            <button
              type="button"
              className={styles.noticeAction}
              onClick={() => void historyQuery.refetch()}
            >
              {t("profile.page.actions.retry")}
            </button>
          </div>
        ) : null}

        {historyQuery.isSuccess && tickets.length === 0 ? (
          <p className={styles.notice}>{t("profile.tickets.empty.title")}</p>
        ) : null}

        <div className={styles.blocks}>
          {tickets.map((ticket) => {
            const isUnpaid = ticket.status === "booked";
            const isActionDisabled =
              ticket.status === "paid" ||
              ticket.status === "cancelled" ||
              ticket.status === "expired";
            const statusLabel = t(`profile.archive.status.${ticket.status}`);
            const badgeClassName = isUnpaid
              ? styles.ticketBadgeWarning
              : ticket.status === "paid"
                ? styles.ticketBadgeSuccess
                : styles.ticketBadgeMuted;

            return (
              <section
                key={ticket.code}
                className={styles.archiveBlock}
                aria-label={ticket.code}
              >
                <div className={styles.dateRow}>
                  <span className={styles.dateLabel}>{ticket.date}</span>
                </div>

                <div className={styles.ticketRow}>
                  <div className={styles.ticketCardRoute}>
                    <div className={styles.ticketTitleRow}>
                      <h2 className={styles.ticketTitle}>
                        {t("profile.archive.bookingTitlePrefix")} {ticket.code}{" "}
                        - {ticket.price}
                      </h2>
                      <div className={styles.badgeRow}>
                        <span
                          className={`${styles.ticketBadge} ${badgeClassName}`.trim()}
                        >
                          {statusLabel}
                        </span>
                        <span className={styles.ticketMetaDate}>
                          {ticket.metaDate}
                        </span>
                      </div>
                    </div>

                    {isUnpaid ? (
                      <p className={styles.unpaidNotice}>
                        <span className={styles.unpaidNoticeLead}>
                          {t("profile.archive.unpaidNoticeLead")}
                        </span>{" "}
                        <span>{t("profile.archive.unpaidNoticeText")}</span>
                      </p>
                    ) : null}

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
                          <div className={styles.stationCity}>
                            {ticket.routeFrom.name}
                          </div>
                        </div>
                        <div className={styles.stationBlock}>
                          <div className={styles.stationCity}>
                            {ticket.routeTo.name}
                          </div>
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
                        <span className={styles.passengerName}>
                          {ticket.passengerName}
                        </span>
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
                        <span className={styles.passengerPhone}>
                          {ticket.passengerPhone}
                        </span>
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
                        <span className={styles.passengerSeat}>
                          {ticket.seatCount}
                        </span>
                      </div>
                    </div>

                    <div className={styles.priceValue}>{ticket.price}</div>

                    <div className={styles.actions}>
                      <Button
                        text={t("profile.archive.pay")}
                        variant="primary"
                        size="full"
                        disabled={isActionDisabled}
                        onClick={() => {}}
                      />
                      <Button
                        text={t("profile.archive.cancel")}
                        variant="secondary"
                        size="full"
                        disabled={isActionDisabled}
                        onClick={() => {}}
                      />
                    </div>
                  </div>
                </div>
              </section>
            );
          })}
        </div>
      </section>
    </ProfileWrapper>
  );
}
