"use client";

import { TicketSearchInput } from "@/src/features/search-tickets";
import { TicketSortDropdown } from "@/src/features/sort-tickets";
import type { SortOption } from "@/src/features/sort-tickets";
import { Button, DashboardDateText } from "@/src/shared";
import { useI18n } from "@/src/shared/i18n/I18nProvider";
import MiniCalendarTrigger from "@/src/widgets/MiniCalendar/MiniCalendarTrigger";
import { useState } from "react";
import styles from "./TicketsToolbar.module.css";

type Props = {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  sortOption: SortOption | "";
  onSortChange: (option: SortOption) => void;
  onAddOrder: () => void;
};

export default function TicketsToolbar({
  searchQuery,
  onSearchChange,
  sortOption,
  onSortChange,
  onAddOrder,
}: Props) {
  const { t } = useI18n();
  const [chosenDate, setChosenDate] = useState(new Date());

  return (
    <div
      className={styles.toolbar}
      role="toolbar"
      aria-label={t("dispatcherArea.tickets.toolbar.aria")}
    >
      <TicketSearchInput value={searchQuery} onChange={onSearchChange} />
      <TicketSortDropdown value={sortOption} onChange={onSortChange} />
      <div className={styles.addButton}>
        <Button
          text={t("dispatcherArea.tickets.actions.addOrder")}
          onClick={onAddOrder}
          variant="primary"
          fullWidth={false}
        />
      </div>
      <div className={styles.date}>
        <DashboardDateText chosenDate={chosenDate} />
        <MiniCalendarTrigger
          chosenDate={chosenDate}
          setChosenDate={setChosenDate}
          onCalendarChange={setChosenDate}
        />
      </div>
    </div>
  );
}
