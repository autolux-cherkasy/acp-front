"use client";

import Image from "next/image";

import {
  BookingSummaryCard,
  useCancelBookingMutation,
  useMyActiveBookingsQuery,
} from "@/src/entities/booking";
import { useI18n } from "@/src/shared/i18n/I18nProvider";
import LocaleLink from "@/src/shared/i18n/Link";
import { useDisclosure } from "@/src/shared/lib/useDisclosure";
import { useServerToast } from "@/src/shared/lib/toast";
import ConfirmDeleteModal from "@/src/shared/ui/ConfirmDeleteModal/ConfirmDeleteModal";
import SurfacePanel from "@/src/shared/ui/SurfacePanel/SurfacePanel";
import { toArchivedTicket } from "../../profile-archive/model/archive-tickets";
import ProfileWrapper from "../../profile/ui/ProfileWrapper";
import archiveStyles from "../../profile-archive/ui/profile-archive-page.module.css";
import styles from "./profile-tickets-page.module.css";

export default function ProfileTicketsPage() {
  const { t, locale } = useI18n();
  const ticketsQuery = useMyActiveBookingsQuery();
  const cancelMutation = useCancelBookingMutation();
  const { notifyError, notifySuccess } = useServerToast();
  const confirmCancel = useDisclosure<{ id: string; code: string }>();

  const tickets = (ticketsQuery.data ?? []).map((booking) =>
    toArchivedTicket(booking, locale),
  );

  const handleCancel = async (id: string) => {
    try {
      await cancelMutation.mutateAsync(id);
      notifySuccess(undefined, t("profile.tickets.toast.cancelSuccess"));
    } catch (error) {
      notifyError(error, t("profile.tickets.toast.cancelError"));
    }
  };

  const showEmpty =
    ticketsQuery.isSuccess && tickets.length === 0 && !ticketsQuery.isPending;

  return (
    <ProfileWrapper mode="tickets" className={archiveStyles.wrapperContent}>
      <section
        className={showEmpty ? styles.emptyState : archiveStyles.card}
        aria-labelledby="tickets-title"
      >
        <h1 id="tickets-title" className={styles.srOnly}>
          {t("profile.tickets.title")}
        </h1>

        {ticketsQuery.isPending ? (
          <p className={archiveStyles.notice}>{t("common.loading")}</p>
        ) : null}

        {ticketsQuery.isError ? (
          <div className={`${archiveStyles.notice} ${archiveStyles.noticeError}`} role="alert">
            <span>{t("profile.tickets.loadError")}</span>
            <button
              type="button"
              className={archiveStyles.noticeAction}
              onClick={() => void ticketsQuery.refetch()}
            >
              {t("profile.page.actions.retry")}
            </button>
          </div>
        ) : null}

        {showEmpty ? (
          <SurfacePanel className={styles.emptyCard}>
            <div className={styles.emptyContentWrapper}>
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
        ) : null}

        {ticketsQuery.isSuccess && tickets.length > 0 ? (
          <div className={archiveStyles.blocks}>
            {tickets.map((ticket) => {
              const isUnpaid = ticket.status === "booked";
              const statusVariant = isUnpaid ? "warning" : "success";

              return (
                <BookingSummaryCard
                  key={ticket.id}
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
                  onCancel={() => confirmCancel.open({ id: ticket.id, code: ticket.code })}
                  isCancelling={
                    cancelMutation.isPending && cancelMutation.variables === ticket.id
                  }
                  cancelDisabled={!isUnpaid}
                />
              );
            })}
          </div>
        ) : null}
      </section>

      {confirmCancel.isOpen && confirmCancel.data ? (
        <ConfirmDeleteModal
          subject={`№ ${confirmCancel.data.code}`}
          question={t("profile.tickets.confirmCancel.question")}
          confirmLabel={t("profile.tickets.confirmCancel.confirm")}
          onCancel={confirmCancel.close}
          onConfirm={() => {
            const { id } = confirmCancel.data!;
            confirmCancel.close();
            void handleCancel(id);
          }}
        />
      ) : null}
    </ProfileWrapper>
  );
}
