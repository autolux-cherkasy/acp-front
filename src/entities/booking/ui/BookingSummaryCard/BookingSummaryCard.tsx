import Image from "next/image";

import Button from "@/src/shared/ui/Button/Button";
import styles from "./BookingSummaryCard.module.css";

export type BookingSummaryStatusVariant = "warning" | "success" | "muted";

const BADGE_CLASS_MAP: Record<BookingSummaryStatusVariant, string> = {
  warning: styles.ticketBadgeWarning,
  success: styles.ticketBadgeSuccess,
  muted: styles.ticketBadgeMuted,
};

export type BookingSummaryCardProps = {
  referenceCode: string;
  price: string;
  dateLabel?: string;
  metaDate: string;
  statusLabel: string;
  statusVariant: BookingSummaryStatusVariant;
  showUnpaidNotice?: boolean;
  unpaidNoticeLead?: string;
  unpaidNoticeText?: string;
  boardOnPayLabel?: string;
  routeFrom: { name: string; time: string };
  routeTo: { name: string; time: string };
  passengerName: string;
  passengerPhone: string;
  seatCount: number;
  bookingTitlePrefix: string;
  payLabel: string;
  cancelLabel: string;
  onCancel: () => void;
  isCancelling?: boolean;
  cancelDisabled?: boolean;
};

export default function BookingSummaryCard({
  referenceCode,
  price,
  dateLabel,
  metaDate,
  statusLabel,
  statusVariant,
  showUnpaidNotice,
  unpaidNoticeLead,
  unpaidNoticeText,
  boardOnPayLabel,
  routeFrom,
  routeTo,
  passengerName,
  passengerPhone,
  seatCount,
  bookingTitlePrefix,
  payLabel,
  cancelLabel,
  onCancel,
  isCancelling = false,
  cancelDisabled = false,
}: BookingSummaryCardProps) {
  return (
    <section className={styles.archiveBlock} aria-label={referenceCode}>
      {dateLabel ? (
        <div className={styles.dateRow}>
          <span className={styles.dateLabel}>{dateLabel}</span>
        </div>
      ) : null}

      <div className={styles.ticketRow}>
        <div className={styles.ticketCardRoute}>
          <div className={styles.ticketTitleRow}>
            <h2 className={styles.ticketTitle}>
              {bookingTitlePrefix} {referenceCode} - {price}
            </h2>
            <div className={styles.badgeRow}>
              <span className={`${styles.ticketBadge} ${BADGE_CLASS_MAP[statusVariant]}`.trim()}>
                {statusLabel}
              </span>
              {boardOnPayLabel ? (
                <span className={`${styles.ticketBadge} ${styles.ticketBadgeSuccess}`}>
                  {boardOnPayLabel}
                </span>
              ) : null}
              <span className={styles.ticketMetaDate}>{metaDate}</span>
            </div>
          </div>

          {showUnpaidNotice ? (
            <p className={styles.unpaidNotice}>
              <span className={styles.unpaidNoticeLead}>{unpaidNoticeLead}</span>{" "}
              <span>{unpaidNoticeText}</span>
            </p>
          ) : null}

          <div className={styles.routeBody}>
            <div className={styles.timeColumn}>
              <span>{routeFrom.time}</span>
              <span>{routeTo.time}</span>
            </div>

            <div className={styles.routeLine} aria-hidden="true">
              <span className={styles.routeCircle} />
              <span className={styles.routeDots} />
              <span className={styles.routeCircleFilled} />
            </div>

            <div className={styles.routeStations}>
              <div className={styles.stationBlock}>
                <div className={styles.stationCity}>{routeFrom.name}</div>
              </div>
              <div className={styles.stationBlock}>
                <div className={styles.stationCity}>{routeTo.name}</div>
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
              <span className={styles.passengerName}>{passengerName}</span>
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
              <span className={styles.passengerPhone}>{passengerPhone}</span>
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
              <span className={styles.passengerSeat}>{seatCount}</span>
            </div>
          </div>

          <div className={styles.priceValue}>{price}</div>

          <div className={styles.actions}>
            <Button text={payLabel} variant="primary" size="full" disabled onClick={() => {}} />
            <Button
              text={cancelLabel}
              variant="secondary"
              size="full"
              disabled={cancelDisabled || isCancelling}
              onClick={onCancel}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
