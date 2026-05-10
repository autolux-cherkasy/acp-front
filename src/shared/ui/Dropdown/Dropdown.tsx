"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import styles from "./dropdown.module.css";

export type DropdownItem = {
  label: string;
  onClick: () => void;
};

type DropdownProps = {
  id: string;
  openId: string | null;
  onToggle: (id: string | null) => void;
  items: DropdownItem[];
  hideTrigger?: boolean;
};

export function Dropdown({ id, openId, onToggle, items, hideTrigger }: DropdownProps) {
  const isOpen = openId === id;
  const wrapperRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const [dropUp, setDropUp] = useState(false);

  useLayoutEffect(() => {
    if (!isOpen) {
      setDropUp(false);
      return;
    }
    if (!wrapperRef.current || !listRef.current) return;

    const wrapperRect = wrapperRef.current.getBoundingClientRect();
    const listHeight = listRef.current.getBoundingClientRect().height;
    const spaceBelow = window.innerHeight - wrapperRect.bottom;

    setDropUp(spaceBelow < listHeight + 4);
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    function handleClickOutside(e: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        onToggle(null);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, onToggle]);

  return (
    <div ref={wrapperRef} className={styles.dropdownWrapper}>
      {!hideTrigger && (
        <button
          type="button"
          className={styles.chevronBtn}
          onClick={() => onToggle(isOpen ? null : id)}
        >
          <span
            className={`${styles.chevron} ${isOpen ? styles.chevronUp : ""}`}
          />
        </button>
      )}

      {isOpen && (
        <ul
          ref={listRef}
          className={`${styles.dropdown} ${dropUp ? styles.dropdownAbove : ""}`}
        >
          {items.map((item) => (
            <li key={item.label}>
              <button
                type="button"
                className={styles.dropdownItem}
                onClick={() => {
                  item.onClick();
                  onToggle(null);
                }}
              >
                {item.label}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
