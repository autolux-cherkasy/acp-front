import React from "react";
import MiniCalendar, { type DateRange } from "./MiniCalendar";
import { useClickOutside } from "@/src/shared/lib/useClickOutside";
import styles from "./MiniCalendar.module.css";

type SingleTriggerProps = {
  mode?: "single";
  onCalendarChange?: (date: Date) => void;
  chosenDate?: Date;
  setChosenDate?: (date: Date) => void;
};

type RangeTriggerProps = {
  mode: "range";
  range: DateRange;
  onRangeChange: (range: DateRange) => void;
};

type MiniCalendarTriggerProps = SingleTriggerProps | RangeTriggerProps;

const MiniCalendarTrigger = (props: MiniCalendarTriggerProps) => {
  const {
    isOpen: isCalendarOpen,
    setIsOpen: setIsCalendarOpen,
    fieldRef: wrapperRef,
  } = useClickOutside();

  const isRange = props.mode === "range";
  const canOpen = isRange || Boolean(props.onCalendarChange && props.setChosenDate);

  return (
    <div ref={wrapperRef} className={styles.calendarWrap}>
      <button
        className={styles.calendarButton}
        onClick={() => setIsCalendarOpen((prev) => !prev)}
        aria-label="Open calendar"
        aria-expanded={isCalendarOpen}
        type="button"
        disabled={!canOpen}
      >
        <span className={styles.calendarIcon} aria-hidden="true" />
      </button>
      {isCalendarOpen && canOpen && (
        <div className={styles.calendarPopover}>
          {props.mode === "range" ? (
            <MiniCalendar
              mode="range"
              value={props.range}
              onChange={props.onRangeChange}
              onClose={() => setIsCalendarOpen(false)}
            />
          ) : (
            <MiniCalendar
              value={props.chosenDate ?? new Date()}
              onChange={(date) => {
                props.onCalendarChange?.(date);
                props.setChosenDate?.(date);
              }}
              onClose={() => setIsCalendarOpen(false)}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default MiniCalendarTrigger;
