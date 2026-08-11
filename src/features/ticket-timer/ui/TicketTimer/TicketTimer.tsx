"use client";

import { useEffect, useRef } from "react";
import { useI18n } from "@/src/shared/i18n/I18nProvider";
import {
  CANCEL_FLOOR_SECONDS,
  COUNTDOWN_WINDOW_SECONDS,
  useCountdown,
} from "../../model/useCountdown";
import styles from "./TicketTimer.module.css";

const URGENT_THRESHOLD_SECONDS = 420;

type Props = {
  initialSeconds: number | null;
  onExpire?: () => void;
};

function formatTime(totalSeconds: number): string {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;

    return [minutes, seconds].map((value) => String(value).padStart(2, "0")).join(":");
}

export default function TicketTimer({ initialSeconds, onExpire }: Props) {
  const { t } = useI18n();
  const seconds = useCountdown(initialSeconds);
  const isExpired = seconds !== null && seconds <= CANCEL_FLOOR_SECONDS;

  const reportedFor = useRef<number | null | undefined>(undefined);

  useEffect(() => {
    if (!isExpired || reportedFor.current === initialSeconds) return;

    reportedFor.current = initialSeconds;
    onExpire?.();
  }, [isExpired, initialSeconds, onExpire]);

  if (seconds === null) {
    return (
      <span className={styles.none} aria-label={t("dispatcherArea.tickets.timer.noneAria")}>
        —
      </span>
    );
  }

  // Поза вікном таймер стоїть на 10:00, на межі — завмирає на 05:00.
  const displayed = Math.min(Math.max(seconds, CANCEL_FLOOR_SECONDS), COUNTDOWN_WINDOW_SECONDS);
  const isDormant = seconds > COUNTDOWN_WINDOW_SECONDS;
  const isUrgent = displayed <= URGENT_THRESHOLD_SECONDS;

  return (
    <div
      className={[
        styles.cell,
        isUrgent ? styles.urgentCell : styles.normalCell,
        isDormant ? styles.dormant : "",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <span
        className={[styles.timer, isUrgent ? styles.urgent : styles.normal].join(" ")}
        role="timer"
        aria-live="off"
      >
        {formatTime(displayed)}
      </span>
    </div>
  );
}
