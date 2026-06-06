"use client";

import Icon from "@/src/shared/ui/Icon/Icon";
import * as Select from "@radix-ui/react-select";
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
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={styles.wrapper}>
      <Select.Root value={value} onValueChange={onChange} onOpenChange={setIsOpen}>
        <Select.Trigger className={styles.trigger} disabled={disabled}>
          <span className={styles.value}>
            <Select.Value placeholder={placeholder} />
          </span>
          <span
            className={`${styles.chevron} ${isOpen ? styles.chevronOpen : ""}`}
            aria-hidden="true"
          >
            <Icon src="/icons/down-arrow.svg" size={12} />
          </span>
        </Select.Trigger>

        <Select.Portal>
          <Select.Content position="popper" sideOffset={4} className={styles.menu}>
            <Select.Viewport className={styles.list}>
              {options.map((option) => (
                <Select.Item
                  key={option.value}
                  value={option.value}
                  className={`${styles.option} ${option.value === value ? styles.optionSelected : ""}`}
                >
                  <Select.ItemText>{option.label}</Select.ItemText>
                </Select.Item>
              ))}
            </Select.Viewport>
          </Select.Content>
        </Select.Portal>
      </Select.Root>
    </div>
  );
}
