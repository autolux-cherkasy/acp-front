"use client";

import { useMemo } from "react";
import { Control, Controller, FieldPath, FieldValues } from "react-hook-form";

import { useI18n } from "@/src/shared/i18n/I18nProvider";
import { formatDateForApi, formatDateOnly, parseDateOnly } from "@/src/shared/lib/formatters";
import { useClickOutside } from "@/src/shared/lib/useClickOutside";
import TextField from "@/src/shared/ui/TextField/TextField";
import inputStyles from "@/src/shared/ui/InputWithLabel/InputWithLabel.module.css";
import MiniCalendar from "./MiniCalendar";
import styles from "./DatePickerWithLabel.module.css";

type Props<T extends FieldValues> = {
  control: Control<T>;
  name: FieldPath<T>;
  label: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  minDate?: Date;
  maxDate?: Date;
  wrapperClassName?: string;
};

/**
 * Поле дати на MiniCalendar замість `input[type="date"]`: нативний пікер
 * малює місяць мовою браузера («11-Aug-2026»), а тут дата завжди
 * у форматі 11.08.2026. У формі значення лишається `YYYY-MM-DD`.
 */
export default function DatePickerWithLabel<T extends FieldValues>({
  control,
  name,
  label,
  placeholder,
  required = false,
  disabled = false,
  minDate,
  maxDate,
  wrapperClassName,
}: Props<T>) {
  const { raw } = useI18n();
  const { isOpen, setIsOpen, fieldRef } = useClickOutside();

  const months = useMemo(() => raw("bookingForm.calendar.months") as string[], [raw]);
  const weekdays = useMemo(() => raw("bookingForm.calendar.weekdays") as string[], [raw]);

  return (
    <div className={[inputStyles.field, wrapperClassName].filter(Boolean).join(" ")}>
      <label className={inputStyles.label}>{label}</label>

      <Controller
        control={control}
        name={name}
        rules={{ required }}
        render={({ field, fieldState }) => {
          const value = typeof field.value === "string" ? field.value : "";

          return (
            <div className={styles.anchor} ref={fieldRef}>
              <TextField
                readOnly
                value={formatDateOnly(value)}
                placeholder={placeholder}
                disabled={disabled}
                className={styles.trigger}
                aria-invalid={fieldState.invalid}
                aria-haspopup="dialog"
                aria-expanded={isOpen}
                trailingAdornment="/icons/calendar.svg"
                onTrailingAdornmentClick={() => setIsOpen((current) => !current)}
                onClick={() => !disabled && setIsOpen((current) => !current)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    setIsOpen((current) => !current);
                  }
                }}
                onBlur={field.onBlur}
              />

              {isOpen && (
                <div className={styles.popover}>
                  <MiniCalendar
                    value={parseDateOnly(value)}
                    onChange={(date) => field.onChange(formatDateForApi(date))}
                    onClose={() => setIsOpen(false)}
                    minDate={minDate}
                    maxDate={maxDate}
                    months={months}
                    weekdays={weekdays}
                  />
                </div>
              )}
            </div>
          );
        }}
      />
    </div>
  );
}
