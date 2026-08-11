"use client";

import { useMemo, useState } from "react";
import styles from "./MiniCalendar.module.css";

export type DateRange = { from: Date; to: Date };

type BaseProps = {
  onClose: () => void;
  minDate?: Date;
  maxDate?: Date;
  availableDates?: string[];

  // NEW: локализация (опционально)
  months?: string[];
  weekdays?: string[];
};

type SingleProps = BaseProps & {
  mode?: "single";
  value: Date | null;
  onChange: (d: Date) => void;
};

type RangeProps = BaseProps & {
  mode: "range";
  value: DateRange | null;
  onChange: (range: DateRange) => void;
};

type Props = SingleProps | RangeProps;

const DEFAULT_MONTHS = [
  "Січень",
  "Лютий",
  "Березень",
  "Квітень",
  "Травень",
  "Червень",
  "Липень",
  "Серпень",
  "Вересень",
  "Жовтень",
  "Листопад",
  "Грудень",
];

const DEFAULT_WEEKDAYS = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Нд"];

function startOfMonth(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), 1);
}

function endOfMonth(d: Date) {
  return new Date(d.getFullYear(), d.getMonth() + 1, 0);
}

function startOfDay(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

function toDateKey(d: Date) {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

// Monday-first: 0..6 where 0 = Monday
function mondayIndex(jsDay: number) {
  return (jsDay + 6) % 7;
}

export default function MiniCalendar(props: Props) {
  const { onClose, minDate, maxDate, availableDates, months, weekdays } = props;

  const isRange = props.mode === "range";
  const selectedRange = props.mode === "range" ? props.value : null;
  const selectedDate = props.mode === "range" ? null : props.value;

  const [pendingStart, setPendingStart] = useState<Date | null>(null);

  const locMonths = months && months.length === 12 ? months : DEFAULT_MONTHS;
  const locWeekdays = weekdays && weekdays.length === 7 ? weekdays : DEFAULT_WEEKDAYS;

  const normalizedMinDate = useMemo(() => (minDate ? startOfDay(minDate) : null), [minDate]);
  const normalizedMaxDate = useMemo(() => (maxDate ? startOfDay(maxDate) : null), [maxDate]);
  const availableDateSet = useMemo(() => new Set(availableDates ?? []), [availableDates]);
  const [cursor, setCursor] = useState<Date>(
    () => selectedRange?.from ?? selectedDate ?? normalizedMinDate ?? new Date(),
  );

  const monthTitle = useMemo(() => locMonths[cursor.getMonth()], [cursor, locMonths]);
  const yearTitle = useMemo(() => String(cursor.getFullYear()), [cursor]);

  const days = useMemo(() => {
    const start = startOfMonth(cursor);
    const end = endOfMonth(cursor);

    const padStart = mondayIndex(start.getDay());
    const daysInCurrentMonth = end.getDate();
    const prevMonthEnd = endOfMonth(new Date(cursor.getFullYear(), cursor.getMonth() - 1, 1));

    const cells: Array<{
      date: Date;
      label: number;
      inCurrentMonth: boolean;
    }> = [];

    for (let i = padStart; i > 0; i--) {
      const day = prevMonthEnd.getDate() - i + 1;
      cells.push({
        date: new Date(cursor.getFullYear(), cursor.getMonth() - 1, day),
        label: day,
        inCurrentMonth: false,
      });
    }

    for (let day = 1; day <= daysInCurrentMonth; day++) {
      cells.push({
        date: new Date(cursor.getFullYear(), cursor.getMonth(), day),
        label: day,
        inCurrentMonth: true,
      });
    }

    const fillNext = 42 - cells.length;
    for (let day = 1; day <= fillNext; day++) {
      cells.push({
        date: new Date(cursor.getFullYear(), cursor.getMonth() + 1, day),
        label: day,
        inCurrentMonth: false,
      });
    }

    return cells;
  }, [cursor]);

  const isSameDay = (a: Date, b: Date) =>
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate();

  // Поки чекаємо на другий клік, підсвіченим лишається тільки перший день.
  const highlightStart = isRange ? (pendingStart ?? selectedRange?.from ?? null) : selectedDate;
  const highlightEnd = isRange ? (pendingStart ?? selectedRange?.to ?? null) : selectedDate;

  const canGoToPreviousMonth =
    normalizedMinDate == null ||
    cursor.getFullYear() > normalizedMinDate.getFullYear() ||
    (cursor.getFullYear() === normalizedMinDate.getFullYear() &&
      cursor.getMonth() > normalizedMinDate.getMonth());

  function handleSelect(date: Date) {
    if (props.mode !== "range") {
      props.onChange(date);
      onClose();
      return;
    }

    // Перший клік фіксує один день, другий добудовує межу з того боку, з якого
    // стоїть обрана дата. Наступний клік починає вибір спочатку.
    if (!pendingStart) {
      setPendingStart(date);
      props.onChange({ from: date, to: date });
      return;
    }

    const startsEarlier = startOfDay(date) < startOfDay(pendingStart);

    props.onChange({
      from: startsEarlier ? date : pendingStart,
      to: startsEarlier ? pendingStart : date,
    });
    setPendingStart(null);
    onClose();
  }

  return (
    <div className={styles.wrap} role="dialog" aria-label="Calendar">
      <div className={styles.top}>
        <button
          type="button"
          className={styles.navBtn}
          onClick={() => setCursor((prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1))}
          aria-label="Prev month"
          disabled={!canGoToPreviousMonth}
        >
          ‹
        </button>

        <div className={styles.title}>
          <span className={styles.titlePart}>{monthTitle}</span>
          <span className={styles.titlePart}>{yearTitle}</span>
        </div>

        <button
          type="button"
          className={styles.navBtn}
          onClick={() => setCursor((prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1))}
          aria-label="Next month"
        >
          ›
        </button>

        <button type="button" className={styles.closeBtn} onClick={onClose} aria-label="Close">
          ✕
        </button>
      </div>

      <div className={styles.weekdays}>
        {locWeekdays.map((w) => (
          <div key={w} className={styles.weekday}>
            {w}
          </div>
        ))}
      </div>

      <div className={styles.grid}>
        {days.map((cell, idx) => {
          const isWeekend = idx % 7 === 5 || idx % 7 === 6;
          const isDisabled =
            (normalizedMinDate != null && startOfDay(cell.date) < normalizedMinDate) ||
            (normalizedMaxDate != null && startOfDay(cell.date) > normalizedMaxDate);
          const isSelected =
            !isDisabled &&
            ((highlightStart != null && isSameDay(cell.date, highlightStart)) ||
              (highlightEnd != null && isSameDay(cell.date, highlightEnd)));
          const isInRange =
            !isDisabled &&
            !isSelected &&
            highlightStart != null &&
            highlightEnd != null &&
            startOfDay(cell.date) > startOfDay(highlightStart) &&
            startOfDay(cell.date) < startOfDay(highlightEnd);
          const isAvailable = !isDisabled && availableDateSet.has(toDateKey(cell.date));

          return (
            <button
              key={idx}
              type="button"
              className={[
                styles.cell,
                !cell.inCurrentMonth ? styles.cellMuted : "",
                isWeekend ? styles.cellWeekend : "",
                isDisabled ? styles.cellDisabled : "",
                isAvailable ? styles.cellAvailable : "",
                isInRange ? styles.inRange : "",
                isSelected ? styles.selected : "",
              ].join(" ")}
              onClick={() => {
                if (isDisabled) {
                  return;
                }

                handleSelect(cell.date);
              }}
              disabled={isDisabled}
            >
              {cell.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
