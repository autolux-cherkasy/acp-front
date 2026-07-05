"use client";

import { TicketStatusBadge } from "@/src/entities/ticket";
import type { Ticket } from "@/src/entities/ticket";
import { TicketTimer } from "@/src/features/ticket-timer";
import { useI18n } from "@/src/shared/i18n/I18nProvider";
import styles from "./TicketsTable.module.css";

type Props = {
  tickets: Ticket[];
  onDetails: (ticketId: string) => void;
};

export default function TicketsTable({ tickets, onDetails }: Props) {
  const { locale, t } = useI18n();

  if (tickets.length === 0) {
    return (
      <div className={styles.empty}>
        <p>{t("dispatcherArea.tickets.table.empty")}</p>
      </div>
    );
  }

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
          {tickets.map((ticket, index) => (
            <TicketRow
              key={ticket.id}
              ticket={ticket}
              rowNumber={index + 1}
              locale={locale}
              onDetails={onDetails}
            />
          ))}
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
};

function TicketRow({ ticket, rowNumber, locale, onDetails }: TicketRowProps) {
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
        <TicketTimer initialSeconds={ticket.timerSeconds} />
      </td>

      <td className={styles.td}>
        <button type="button" className={styles.detailsButton} onClick={() => onDetails(ticket.id)}>
          {t("dispatcherArea.tickets.actions.details")}
        </button>
      </td>
    </tr>
  );
}
