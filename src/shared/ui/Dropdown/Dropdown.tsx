"use client";

import { createPortal } from "react-dom";
import { useEffect, useLayoutEffect, useRef } from "react";
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

export function Dropdown({
  id,
  openId,
  onToggle,
  items,
  hideTrigger,
}: DropdownProps) {
  const isOpen = openId === id;
  const wrapperRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  useLayoutEffect(() => {
    if (!isOpen || !wrapperRef.current || !listRef.current) return;
    const wrapperRect = wrapperRef.current.getBoundingClientRect();
    const listHeight = listRef.current.getBoundingClientRect().height;
    const spaceBelow = window.innerHeight - wrapperRect.bottom;
    const right = window.innerWidth - wrapperRect.right;

    listRef.current.style.right = `${right}px`;
    if (spaceBelow < listHeight + 4) {
      listRef.current.style.top = "auto";
      listRef.current.style.bottom = `${window.innerHeight - wrapperRect.top + 4}px`;
    } else {
      listRef.current.style.bottom = "auto";
      listRef.current.style.top = `${wrapperRect.bottom + 4}px`;
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    function handleClickOutside(e: MouseEvent) {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(e.target as Node) &&
        listRef.current &&
        !listRef.current.contains(e.target as Node)
      ) {
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

      {isOpen &&
        typeof document !== "undefined" &&
        createPortal(
          <ul ref={listRef} className={styles.dropdown}>
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
          </ul>,
          document.body,
        )}
    </div>
  );
}
