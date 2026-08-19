"use client";

import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import ChevronIcon from "@/src/shared/ui/ChevronIcon/ChevronIcon";
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
  /** «end» притискає меню правим краєм до тригера — потрібне біля краю екрана. */
  align?: "start" | "end";
};

export function Dropdown({
  id,
  openId,
  onToggle,
  items,
  hideTrigger,
  align = "start",
}: DropdownProps) {
  return (
    <div className={styles.dropdownWrapper}>
      <DropdownMenu.Root open={openId === id} onOpenChange={(open) => onToggle(open ? id : null)}>
        {!hideTrigger && (
          <DropdownMenu.Trigger className={styles.chevronBtn}>
            <ChevronIcon open={openId === id} />
          </DropdownMenu.Trigger>
        )}

        <DropdownMenu.Portal>
          <DropdownMenu.Content
            className={styles.dropdown}
            side="bottom"
            align={align}
            sideOffset={4}
          >
            <DropdownMenu.Group>
              {items.map((item) => (
                <DropdownMenu.Item
                  key={item.label}
                  className={styles.dropdownItem}
                  onSelect={item.onClick}
                >
                  <DropdownMenu.Label>{item.label}</DropdownMenu.Label>
                </DropdownMenu.Item>
              ))}
            </DropdownMenu.Group>
          </DropdownMenu.Content>
        </DropdownMenu.Portal>
      </DropdownMenu.Root>
    </div>
  );
}
