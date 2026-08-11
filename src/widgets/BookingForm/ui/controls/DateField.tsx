"use client";

import Image from "next/image";
import { useMemo } from "react";

import { useClickOutside } from "@/src/shared/lib/useClickOutside";
import { formatDDMMYYYY } from "@/src/entities/trip";
import MiniCalendar from "../../../MiniCalendar/MiniCalendar";
import styles from "../BookingForm.module.css";

type DateFieldProps = {
  value: Date | null;
  onChange: (date: Date) => void;
  placeholder: string;
  months: string[];
  weekdays: string[];
  availableDateKeys?: string[];
  disabled: boolean;
};

export default function DateField({
  value,
  onChange,
  placeholder,
  months,
  weekdays,
  availableDateKeys,
  disabled,
}: DateFieldProps) {
  const { isOpen, setIsOpen, fieldRef } = useClickOutside();
  const minDate = useMemo(() => {
    const today = new Date();
    return new Date(today.getFullYear(), today.getMonth(), today.getDate());
  }, []);
  const dateText = useMemo(() => (value ? formatDDMMYYYY(value) : ""), [value]);

  return (
    <div className={styles.dateWrap} ref={fieldRef}>
      <button
        type="button"
        disabled={disabled}
        className={styles.controlWithIconBtn}
        onClick={() => setIsOpen((currentValue) => !currentValue)}
        aria-haspopup="dialog"
        aria-expanded={isOpen}
      >
        <span className={styles.dateValue}>{dateText || placeholder}</span>

        <span
          className={`${styles.iconRight} ${styles.calendarIcon} ${
            isOpen ? styles.calendarIconActive : ""
          }`}
          aria-hidden="true"
        >
          <Image src="/icons/calendar.svg" alt="" aria-hidden="true" width={24} height={24} />
        </span>
      </button>

      {isOpen ? (
        <div className={styles.calendarPopover}>
          <MiniCalendar
            value={value}
            onChange={onChange}
            onClose={() => setIsOpen(false)}
            minDate={minDate}
            months={months}
            weekdays={weekdays}
            availableDates={availableDateKeys}
          />
        </div>
      ) : null}
    </div>
  );
}
