"use client";

import { useEffect, useRef, useState } from "react";
import Icon from "@/src/shared/ui/Icon/Icon";
import styles from "./SelectField.module.css";

export type SelectOption = {
  value: string;
  label: string;
};

type Props = {
  value: string;
  options: SelectOption[];
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
};

export default function SelectField({ value, options, onChange, placeholder, disabled }: Props) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);

  const selectedLabel = options.find((o) => o.value === value)?.label;

  useEffect(() => {
    if (!isOpen) return;

    function handlePointerDown(event: MouseEvent | TouchEvent) {
      if (!(event.target instanceof Node)) return;
      if (!wrapperRef.current?.contains(event.target)) setIsOpen(false);
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setIsOpen(false);
    }

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
    <div ref={wrapperRef} className={styles.wrapper}>
      <button
        type="button"
        className={styles.trigger}
        onClick={() => { if (!disabled) setIsOpen((v) => !v); }}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        disabled={disabled}
      >
        <span className={selectedLabel ? styles.value : `${styles.value} ${styles.placeholder}`}>
          {selectedLabel ?? placeholder}
        </span>
        <span className={`${styles.chevron} ${isOpen ? styles.chevronOpen : ""}`} aria-hidden="true">
          <Icon src="/icons/down-arrow.svg" size={12} />
        </span>
      </button>

      {isOpen && (
        <div className={styles.menu}>
          <ul className={styles.list} role="listbox">
            {options.map((option) => (
              <li key={option.value} role="none">
                <button
                  type="button"
                  role="option"
                  aria-selected={option.value === value}
                  className={`${styles.option} ${option.value === value ? styles.optionSelected : ""}`}
                  onClick={() => { onChange(option.value); setIsOpen(false); }}
                >
                  {option.label}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
