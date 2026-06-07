"use client";

import Icon from "@/src/shared/ui/Icon/Icon";
import * as Popover from "@radix-ui/react-popover";
import { useState } from "react";
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
  const [open, setOpen] = useState(false);

  const selectedLabel = options.find((o) => o.value === value)?.label;

  return (
    <div className={styles.wrapper}>
      <Popover.Root open={open} onOpenChange={setOpen} modal={false}>
        <Popover.Trigger asChild>
          <button
            type="button"
            className={styles.trigger}
            disabled={disabled}
          >
            <span className={`${styles.value} ${!selectedLabel ? styles.placeholder : ""}`}>
              {selectedLabel ?? placeholder}
            </span>
            <span
              className={`${styles.chevron} ${open ? styles.chevronOpen : ""}`}
              aria-hidden="true"
            >
              <Icon src="/icons/down-arrow.svg" size={12} />
            </span>
          </button>
        </Popover.Trigger>

        <Popover.Portal>
          <Popover.Content
            className={styles.menu}
            sideOffset={4}
            align="start"
            onOpenAutoFocus={(e) => e.preventDefault()}
          >
            <div className={styles.list}>
              {options.map((option) => (
                <div
                  key={option.value}
                  className={`${styles.option} ${option.value === value ? styles.optionSelected : ""}`}
                  onPointerDown={(e) => e.preventDefault()}
                  onClick={() => {
                    onChange(option.value);
                    setOpen(false);
                  }}
                >
                  {option.label}
                </div>
              ))}
            </div>
          </Popover.Content>
        </Popover.Portal>
      </Popover.Root>
    </div>
  );
}
