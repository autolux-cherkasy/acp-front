"use client";

import { useRef, useState } from "react";
import { DashboardDateText, SharedLabel } from "@/src/shared";
import Button from "@/src/shared/ui/Button/Button";
import MiniCalendar from "@/src/widgets/MiniCalendar/MiniCalendar";
import styles from "./admin-routes-page.module.css";

type DashboardPageHeaderProps = {
  title: string;
  subtitle?: string;
  onBack?: () => void;
  action?: {
    text: string;
    onClick: () => void;
  };
  calendarValue?: Date | null;
  onCalendarChange?: (date: Date) => void;
};

export default function DashboardPageHeader({
  title,
  subtitle,
  onBack,
  action,
  calendarValue,
  onCalendarChange,
}: DashboardPageHeaderProps) {
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

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
            <Button
              text={action.text}
              onClick={action.onClick}
              variant="secondary"
              fullWidth={false}
            />
          </div>
        )}
        <div className={styles.dateContainer}>
          <DashboardDateText />
        </div>
        {onCalendarChange && (
          <div ref={wrapperRef} className={styles.calendarWrap}>
            <button
              className={styles.calendarButton}
              onClick={() => setIsCalendarOpen((prev) => !prev)}
              aria-label="Open calendar"
              aria-expanded={isCalendarOpen}
              type="button"
            >
              <span className={styles.calendarIcon} aria-hidden="true" />
            </button>
            {isCalendarOpen && (
              <div className={styles.calendarPopover}>
                <MiniCalendar
                  value={calendarValue ?? new Date()}
                  onChange={(date) => {
                    onCalendarChange(date);
                    setIsCalendarOpen(false);
                  }}
                  onClose={() => setIsCalendarOpen(false)}
                />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
