"use client";

import { DashboardDateText, SharedLabel } from "@/src/shared";
import { useClickOutside } from "@/src/shared/lib/useClickOutside";
import Button from "@/src/shared/ui/Button/Button";
import MiniCalendar from "@/src/widgets/MiniCalendar/MiniCalendar";
import { useState } from "react";
import styles from "./admin-routes-page.module.css";

type DashboardPageHeaderProps = {
  title: string;
  subtitle?: string;
  onBack?: () => void;
  action?: {
    text: string;
    onClick: () => void;
  };
  onCalendarChange?: (date: Date) => void;
};

export default function DashboardPageHeader({
  title,
  subtitle,
  onBack,
  action,
  onCalendarChange,
}: DashboardPageHeaderProps) {
  const [chosenDate, setChosendate] = useState(new Date());
  const {
    isOpen: isCalendarOpen,
    setIsOpen: setIsCalendarOpen,
    fieldRef: wrapperRef,
  } = useClickOutside();

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
          <DashboardDateText chosenDate={chosenDate} />
        </div>
        {
          <div ref={wrapperRef} className={styles.calendarWrap}>
            <button
              className={styles.calendarButton}
              onClick={() => setIsCalendarOpen((prev) => !prev)}
              aria-label="Open calendar"
              aria-expanded={isCalendarOpen}
              type="button"
              disabled={!onCalendarChange}
            >
              <span className={styles.calendarIcon} aria-hidden="true" />
            </button>
            {isCalendarOpen && onCalendarChange && (
              <div className={styles.calendarPopover}>
                <MiniCalendar
                  value={chosenDate ?? new Date()}
                  onChange={(date) => {
                    onCalendarChange(date);
                    setChosendate(date);
                    setIsCalendarOpen(false);
                  }}
                  onClose={() => setIsCalendarOpen(false)}
                  maxDate={new Date()}
                />
              </div>
            )}
          </div>
        }
      </div>
    </div>
  );
}
