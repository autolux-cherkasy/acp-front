"use client";

import { useI18n } from "@/src/shared/i18n/I18nProvider";
import { useCountdown } from "../../model/useCountdown";
import styles from "./TicketTimer.module.css";

const URGENT_THRESHOLD_SECONDS = 360;

type Props = {
  initialSeconds: number | null;
};

// Залишок нормалізує useCountdown, тож тут завжди не більше за 10:00.
function formatTime(totalSeconds: number): string {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;

    return [minutes, seconds].map((value) => String(value).padStart(2, "0")).join(":");
}

export default function TicketTimer({ initialSeconds }: Props) {
  const { t } = useI18n();
  const seconds = useCountdown(initialSeconds);

  if (seconds === null) {
    return (
      <span className={styles.none} aria-label={t("dispatcherArea.tickets.timer.noneAria")}>
        —
      </span>
    );
  }

  const isUrgent = seconds <= URGENT_THRESHOLD_SECONDS;

  return (
    <div className={[styles.cell, isUrgent ? styles.urgentCell : styles.normalCell].join(" ")}>
      <span
        className={[styles.timer, isUrgent ? styles.urgent : styles.normal].join(" ")}
        role="timer"
        aria-live="off"
      >
        {formatTime(seconds)}
      </span>
    </div>
  );
}
