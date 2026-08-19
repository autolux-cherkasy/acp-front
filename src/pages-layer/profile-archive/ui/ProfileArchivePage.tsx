"use client";

import {
  BookingSummaryCard,
  useBookingHistoryQuery,
  useCancelHistoryBookingMutation,
} from "@/src/entities/booking";
import { useI18n } from "@/src/shared/i18n/I18nProvider";
import { useDisclosure } from "@/src/shared/lib/useDisclosure";
import ConfirmDeleteModal from "@/src/shared/ui/ConfirmDeleteModal/ConfirmDeleteModal";
import ProfileWrapper from "../../profile/ui/ProfileWrapper";
import { toArchivedTicket } from "../model/archive-tickets";
import styles from "./profile-archive-page.module.css";

export default function ProfileArchivePage() {
  const { t, locale } = useI18n();
  const historyQuery = useBookingHistoryQuery();
  const cancelMutation = useCancelHistoryBookingMutation();
  const confirmCancel = useDisclosure<{ id: string; code: string; instanceKey: number }>();

  const tickets = (historyQuery.data ?? []).map((booking) => toArchivedTicket(booking, locale));

  const handleCancel = (id: string) => {
    // Toasts come from useCancelHistoryBookingMutation optimistic handlers.
    void cancelMutation.mutateAsync(id);
  };

  return (
    <ProfileWrapper mode="archive" className={styles.wrapperContent}>
      <section className={styles.card} aria-labelledby="archive-title">
        <h1 id="archive-title" className={styles.srOnly}>
          {t("profile.tabs.archive")}
        </h1>

        {historyQuery.isPending ? <p className={styles.notice}>{t("common.loading")}</p> : null}

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
            const statusVariant = isUnpaid
              ? "warning"
              : ticket.status === "paid"
                ? "success"
                : "muted";

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
                onCancel={() =>
                  confirmCancel.open({
                    id: ticket.id,
                    code: ticket.code,
                    instanceKey: Date.now(),
                  })
                }
                isCancelling={cancelMutation.isPending && cancelMutation.variables === ticket.id}
                cancelDisabled={isActionDisabled}
              />
            );
          })}
        </div>
      </section>

      {confirmCancel.isOpen && confirmCancel.data ? (
        <ConfirmDeleteModal
          key={confirmCancel.data.instanceKey}
          subject={`№ ${confirmCancel.data.code}`}
          question={t("profile.tickets.confirmCancel.question")}
          confirmLabel={t("profile.tickets.confirmCancel.confirm")}
          onCancel={confirmCancel.close}
          onConfirm={() => {
            const bookingId = confirmCancel.data!.id;
            confirmCancel.close();
            void handleCancel(bookingId);
          }}
        />
      ) : null}
    </ProfileWrapper>
  );
}
