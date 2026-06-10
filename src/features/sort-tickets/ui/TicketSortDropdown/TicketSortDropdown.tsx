"use client";

import { useState } from "react";
import { useI18n } from "@/src/shared/i18n/I18nProvider";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import ChevronIcon from "@/src/shared/ui/ChevronIcon/ChevronIcon";
import type { SortOption } from "../../model/types";
import dropdownStyles from "@/src/shared/ui/Dropdown/dropdown.module.css";
import styles from "./TicketSortDropdown.module.css";

export type TicketSortDropdownOption<T extends string> = {
  value: T;
  label: string;
};

type Props<T extends string = SortOption> = {
  options?: TicketSortDropdownOption<T>[];
  defaultLabel?: string;
  ariaLabel?: string;
  value: T | "";
  onChange: (value: T) => void;
};
export default function TicketSortDropdown<T extends string = SortOption>({
  options,
  defaultLabel,
  value,
  onChange,
}: Props<T>) {
  const { t } = useI18n();
  const [open, setOpen] = useState(false);
  const defaultOptions: TicketSortDropdownOption<SortOption>[] = [
    {
      value: "date-asc",
      label: t("dispatcherArea.tickets.sort.options.dateAsc"),
    },
    {
      value: "date-desc",
      label: t("dispatcherArea.tickets.sort.options.dateDesc"),
    },
    {
      value: "filter-booked",
      label: t("dispatcherArea.tickets.sort.options.filterBooked"),
    },
    {
      value: "filter-paid",
      label: t("dispatcherArea.tickets.sort.options.filterPaid"),
    },
    {
      value: "filter-cancelled",
      label: t("dispatcherArea.tickets.sort.options.filterCancelled"),
    },
  ];
  const sortOptions = (options ?? defaultOptions) as TicketSortDropdownOption<T>[];

  const selectedLabel =
    sortOptions.find((option) => option.value === value)?.label ??
    defaultLabel ??
    t("dispatcherArea.routes.table.sort");

  return (
    <div className={styles.wrapper}>
      <DropdownMenu.Root open={open} onOpenChange={setOpen}>
        <DropdownMenu.Trigger className={styles.trigger}>
          <span className={styles.label}>{selectedLabel}</span>
          <ChevronIcon open={open} />
        </DropdownMenu.Trigger>

        <DropdownMenu.Portal>
          <DropdownMenu.Content
            side="bottom"
            align="end"
            sideOffset={4}
            className={dropdownStyles.dropdown}
          >
            {sortOptions.map((option) => (
              <DropdownMenu.Item
                key={option.value}
                onSelect={() => onChange(option.value)}
                className={dropdownStyles.dropdownItem}
              >
                {option.label}
              </DropdownMenu.Item>
            ))}
          </DropdownMenu.Content>
        </DropdownMenu.Portal>
      </DropdownMenu.Root>
    </div>
  );
}
