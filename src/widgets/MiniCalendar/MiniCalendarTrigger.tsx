import React from "react";
import MiniCalendar from "./MiniCalendar";
import { useClickOutside } from "@/src/shared/lib/useClickOutside";
import styles from "./MiniCalendar.module.css";

type MiniCalendarTriggerProps = {
  onCalendarChange?: (date: Date) => void;
  chosenDate?: Date;
  setChosenDate?: (date: Date) => void;
};
const MiniCalendarTrigger = ({
  onCalendarChange,
  chosenDate,
  setChosenDate,
}: MiniCalendarTriggerProps) => {
  const {
    isOpen: isCalendarOpen,
    setIsOpen: setIsCalendarOpen,
    fieldRef: wrapperRef,
  } = useClickOutside();
  return (
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
      {isCalendarOpen && onCalendarChange && setChosenDate && (
        <div className={styles.calendarPopover}>
          <MiniCalendar
            value={chosenDate ?? new Date()}
            onChange={(date) => {
              onCalendarChange(date);
              setChosenDate(date);
              setIsCalendarOpen(false);
            }}
            onClose={() => setIsCalendarOpen(false)}
          />
        </div>
      )}
    </div>
  );
};

export default MiniCalendarTrigger;
