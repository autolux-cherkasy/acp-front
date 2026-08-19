"use client";

import { DashboardDateText, SharedLabel } from "@/src/shared";
import Button from "@/src/shared/ui/Button/Button";
import MiniCalendarTrigger from "@/src/widgets/MiniCalendar/MiniCalendarTrigger";
import type { DateRange } from "@/src/widgets/MiniCalendar/MiniCalendar";
import styles from "./admin-routes-page.module.css";

type DashboardPageHeaderProps = {
  title: string;
  subtitle?: string;
  onBack?: () => void;
  action?: {
    text: string;
    onClick: () => void;
  };
  /** Разом із onRangeChange вмикає календар діапазону в шапці. */
  range?: DateRange;
  onRangeChange?: (range: DateRange) => void;
};

function isSameDay(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

export default function DashboardPageHeader({
  title,
  subtitle,
  onBack,
  action,
  range,
  onRangeChange,
}: DashboardPageHeaderProps) {
  const hasCalendar = Boolean(range && onRangeChange);
  const isSingleDay = range ? isSameDay(range.from, range.to) : true;

  return (
    <div className={styles.headerContainer}>
      <div className={styles.leftCont}>
        {onBack && (
          <div className={styles.iconContainer} onClick={onBack} role="button" aria-label="Go back">
            <div className={styles.icon} />
          </div>
        )}
        <div className={styles.titleContainer}>
          <SharedLabel variant="dashboardHeaderTitle">{title}</SharedLabel>
          {subtitle && <SharedLabel variant="dashboardHeaderSubtitle">{subtitle}</SharedLabel>}
        </div>
      </div>

      <div className={styles.rightCont}>
        {action && (
          <div className={styles.buttonWrapper}>
            <Button text={action.text} onClick={action.onClick} variant="secondary" size="md" />
          </div>
        )}
        <div className={styles.dateContainer}>
          <DashboardDateText chosenDate={range?.from} />
          {range && !isSingleDay && (
            <>
              <span className={styles.rangeSeparator} aria-hidden="true">
                –
              </span>
              <DashboardDateText chosenDate={range.to} />
            </>
          )}
          {hasCalendar && range && onRangeChange && (
            <MiniCalendarTrigger mode="range" range={range} onRangeChange={onRangeChange} />
          )}
        </div>
      </div>
    </div>
  );
}
