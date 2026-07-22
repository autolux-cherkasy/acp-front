"use client";

import {
  BookingSummaryCard,
  useBookingHistoryQuery,
  useCancelHistoryBookingMutation,
} from "@/src/entities/booking";
import { useI18n } from "@/src/shared/i18n/I18nProvider";
import { useServerToast } from "@/src/shared/lib/toast";
import ProfileWrapper from "../../profile/ui/ProfileWrapper";
import { toArchivedTicket } from "../model/archive-tickets";
import styles from "./profile-archive-page.module.css";

export default function ProfileArchivePage() {
  const { t, locale } = useI18n();
  const historyQuery = useBookingHistoryQuery();
  const cancelMutation = useCancelHistoryBookingMutation();
  const { notifyError } = useServerToast();

  const tickets = (historyQuery.data ?? []).map((booking) => toArchivedTicket(booking, locale));

  const handleCancel = async (id: string) => {
    try {
      await cancelMutation.mutateAsync(id);
    } catch (error) {
      notifyError(error, t("profile.tickets.toast.cancelError"));
    }
  };

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
            const statusVariant = isUnpaid ? "warning" : ticket.status === "paid" ? "success" : "muted";

            return (
              <BookingSummaryCard
                key={ticket.code}
                referenceCode={ticket.code}
                price={ticket.price}
                dateLabel={ticket.date}
                metaDate={ticket.metaDate}
                statusLabel={t(`profile.archive.status.${ticket.status}`)}
                statusVariant={statusVariant}
                showUnpaidNotice={isUnpaid}
                unpaidNoticeLead={t("profile.archive.unpaidNoticeLead")}
                unpaidNoticeText={t("profile.archive.unpaidNoticeText")}
                routeFrom={ticket.routeFrom}
                routeTo={ticket.routeTo}
                passengerName={ticket.passengerName}
                passengerPhone={ticket.passengerPhone}
                seatCount={ticket.seatCount}
                bookingTitlePrefix={t("profile.archive.bookingTitlePrefix")}
                payLabel={t("profile.archive.pay")}
                cancelLabel={t("profile.archive.cancel")}
                onCancel={() => void handleCancel(ticket.id)}
                isCancelling={cancelMutation.isPending && cancelMutation.variables === ticket.id}
                cancelDisabled={isActionDisabled}
              />
            );
          })}
        </div>
      </section>
    </ProfileWrapper>
  );
}
