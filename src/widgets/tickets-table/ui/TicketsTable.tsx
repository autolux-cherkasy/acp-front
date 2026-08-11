"use client";

import { hasLiveTimer, TicketStatusBadge } from "@/src/entities/ticket";
import type { Ticket } from "@/src/entities/ticket";
import { TicketTimer } from "@/src/features/ticket-timer";
import { useI18n } from "@/src/shared/i18n/I18nProvider";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import styles from "./TicketsTable.module.css";

type Props = {
  tickets: Ticket[];
  isLoading?: boolean;
  onDetails: (ticketId: string) => void;
  /** Таймер брони дійшов до межі — замовлення пора скасувати. */
  onTimerExpire: (ticketId: string) => void;
};

const COLUMN_COUNT = 8;
const SKELETON_ROW_COUNT = 8;

export default function TicketsTable({
  tickets,
  isLoading = false,
  onDetails,
  onTimerExpire,
}: Props) {
  const { locale, t } = useI18n();

  return (
    <div className={styles.wrapper}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th className={styles.th} style={{ width: 48 }}>
              {t("dispatcherArea.routes.table.columns.number")}
            </th>
            <th className={styles.th}>{t("dispatcherArea.tickets.table.columns.data")}</th>
            <th className={styles.th}>
                {t("dispatcherArea.tickets.table.columns.trip")}
            </th>
            <th className={styles.th}>{t("bookingForm.date.placeholder")}</th>
            <th className={styles.th}>{t("dispatcherArea.sidebar.menu.tickets")}</th>
            <th className={styles.th}>{t("dispatcherArea.routes.table.columns.status")}</th>
            <th className={styles.th}>{t("dispatcherArea.tickets.table.columns.timer")}</th>
            <th className={styles.th}>{t("dispatcherArea.tickets.table.columns.actions")}</th>
          </tr>
        </thead>
        <tbody>
          {isLoading ? (
            Array.from({ length: SKELETON_ROW_COUNT }).map((_, rowIndex) => (
              <tr key={rowIndex} className={styles.tr}>
                {Array.from({ length: COLUMN_COUNT }).map((__, cellIndex) => (
                  <td key={cellIndex} className={styles.td}>
                    <Skeleton height={18} />
                    {cellIndex === 1 && <Skeleton height={14} width="70%" />}
                  </td>
                ))}
              </tr>
            ))
          ) : tickets.length === 0 ? (
            <tr className={styles.tr}>
              <td className={`${styles.td} ${styles.empty}`} colSpan={COLUMN_COUNT}>
                {t("dispatcherArea.tickets.table.empty")}
              </td>
            </tr>
          ) : (
            tickets.map((ticket, index) => (
              <TicketRow
                key={ticket.id}
                ticket={ticket}
                rowNumber={index + 1}
                locale={locale}
                onDetails={onDetails}
                onTimerExpire={onTimerExpire}
              />
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

type TicketRowProps = {
  ticket: Ticket;
  rowNumber: number;
  locale: string;
  onDetails: (ticketId: string) => void;
  onTimerExpire: (ticketId: string) => void;
};

function TicketRow({ ticket, rowNumber, locale, onDetails, onTimerExpire }: TicketRowProps) {
  const { t } = useI18n();
  const routeLine = ticket.routeStop
    ? `${ticket.routeFrom}-${ticket.routeTo}`
    : `${ticket.routeFrom} - ${ticket.routeTo}`;

  return (
    <tr className={styles.tr}>
      <td className={styles.td}>
        <span className={styles.rowNumber}>{rowNumber}</span>
      </td>

      <td className={styles.td}>
        <div className={styles.bookingNumber}>№ {ticket.bookingNumber}</div>
        <div className={styles.passengerName}>{ticket.passengerName}</div>
        <div className={styles.passengerPhone}>{ticket.passengerPhone}</div>
      </td>

      <td className={styles.td}>
        <div className={styles.route}>{routeLine}</div>
        {ticket.routeStop && <div>({ticket.routeStop})</div>}
      </td>

      <td className={styles.td}>
        <div className={styles.date}>{ticket.departureDate}</div>
        <div className={styles.time}>{ticket.departureTime}</div>
      </td>

      <td className={styles.td}>
        <div className={styles.ticketCount}>{ticket.ticketCount}</div>
        <div className={styles.price}>{ticket.totalPrice.toLocaleString(locale)} ₴</div>
      </td>

      <td className={styles.td}>
        <TicketStatusBadge status={ticket.status} />
      </td>

      <td className={styles.td}>
        {/* Для статусів без живої брони таймер не має що рахувати — там прочерк. */}
        <TicketTimer
          initialSeconds={hasLiveTimer(ticket.status) ? ticket.timerSeconds : null}
          onExpire={() => onTimerExpire(ticket.id)}
        />
      </td>

      <td className={styles.td}>
        <button type="button" className={styles.detailsButton} onClick={() => onDetails(ticket.id)}>
          {t("dispatcherArea.tickets.actions.details")}
        </button>
      </td>
    </tr>
  );
}
