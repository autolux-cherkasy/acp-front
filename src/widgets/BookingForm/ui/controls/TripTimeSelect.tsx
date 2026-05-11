import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";

import type { Trip } from "@/src/entities/trip";

import styles from "../BookingForm.module.css";
import { formatTripTime } from "../../lib/bookingForm.utils";

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
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const selectedOption = useMemo(
    () => options.find((trip) => trip.id === value) ?? null,
    [options, value],
  );
  const useCompactGrid = options.length > 2;

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const handlePointerDown = (event: MouseEvent | TouchEvent) => {
      const target = event.target;

      if (!(target instanceof Node)) {
        return;
      }

      if (!dropdownRef.current?.contains(target)) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("touchstart", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("touchstart", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

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
        <span
          className={`${styles.timeDropdownChevron} ${
            isOpen ? styles.timeDropdownChevronOpen : ""
          }`}
          aria-hidden="true"
        >
          <Image
            src={isOpen ? "/icons/arrow-up.svg" : "/icons/down-arrow.svg"}
            alt=""
            width={12}
            height={7}
          />
        </span>
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
