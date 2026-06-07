"use client";

import { DashboardDateText, SharedLabel } from "@/src/shared";
import Button from "@/src/shared/ui/Button/Button";
import MiniCalendarTrigger from "@/src/widgets/MiniCalendar/MiniCalendarTrigger";
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
  const [chosenDate, setChosenDate] = useState(new Date());

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
        <MiniCalendarTrigger
          chosenDate={chosenDate}
          setChosenDate={setChosenDate}
          onCalendarChange={onCalendarChange}
        />
      </div>
    </div>
  );
}
