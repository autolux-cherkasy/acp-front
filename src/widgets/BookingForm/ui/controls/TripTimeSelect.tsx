import { useMemo } from "react";

import type { Trip } from "@/src/entities/trip";

import ChevronIcon from "@/src/shared/ui/ChevronIcon/ChevronIcon";
import { useClickOutside } from "@/src/shared/lib/useClickOutside";
import { formatTripTime } from "../../lib/bookingForm.utils";
import styles from "../BookingForm.module.css";

type TripTimeSelectProps = {
  value: string;
  options: Trip[];
  locale: string;
  placeholder: string;
  disabled: boolean;
  onChange: (value: string) => void;
};

export default function TripTimeSelect({
  value,
  options,
  locale,
  placeholder,
  disabled,
  onChange,
}: TripTimeSelectProps) {
  const { isOpen, setIsOpen, fieldRef: dropdownRef } = useClickOutside();

  const selectedOption = useMemo(
    () => options.find((trip) => trip.id === value) ?? null,
    [options, value],
  );
  const useCompactGrid = options.length > 2;

  return (
    <div className={styles.timeDropdown} ref={dropdownRef}>
      <button
        type="button"
        className={styles.timeDropdownTrigger}
        onClick={() => {
          if (!disabled && options.length > 0) {
            setIsOpen((currentValue) => !currentValue);
          }
        }}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-controls="booking-form-time-listbox"
        disabled={disabled}
      >
        <span className={styles.timeDropdownValue}>
          {selectedOption ? formatTripTime(selectedOption, locale) : placeholder}
        </span>
        <ChevronIcon open={isOpen} />
      </button>

      {isOpen ? (
        <div className={styles.timeDropdownMenu}>
          <div
            id="booking-form-time-listbox"
            className={`${styles.timeDropdownList} ${
              useCompactGrid ? styles.timeDropdownListGrid : styles.timeDropdownListSingle
            }`}
            role="listbox"
            aria-label={placeholder}
          >
            {options.map((trip) => {
              const isSelected = trip.id === value;

              return (
                <button
                  key={trip.id}
                  type="button"
                  role="option"
                  aria-selected={isSelected}
                  className={`${styles.timeDropdownOption} ${
                    isSelected ? styles.timeDropdownOptionSelected : ""
                  } ${
                    useCompactGrid ? styles.timeDropdownOptionGrid : styles.timeDropdownOptionSingle
                  }`}
                  onClick={() => {
                    onChange(trip.id);
                    setIsOpen(false);
                  }}
                >
                  <span className={styles.timeDropdownOptionLabel}>
                    {formatTripTime(trip, locale)}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      ) : null}
    </div>
  );
}
