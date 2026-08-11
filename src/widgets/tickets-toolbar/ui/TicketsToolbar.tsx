"use client";

import { TicketSearchInput } from "@/src/features/search-tickets";
import { TicketSortDropdown } from "@/src/features/sort-tickets";
import type { SortOption } from "@/src/features/sort-tickets";
import { Button, DashboardDateText } from "@/src/shared";
import { useI18n } from "@/src/shared/i18n/I18nProvider";
import MiniCalendarTrigger from "@/src/widgets/MiniCalendar/MiniCalendarTrigger";
import type { DateRange } from "@/src/widgets/MiniCalendar/MiniCalendar";
import styles from "./TicketsToolbar.module.css";

type Props = {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  sortOption: SortOption | "";
  onSortChange: (option: SortOption) => void;
  range: DateRange;
  onRangeChange: (range: DateRange) => void;
  onAddOrder: () => void;
};

function isSameDay(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

export default function TicketsToolbar({
  searchQuery,
  onSearchChange,
  sortOption,
  onSortChange,
  range,
  onRangeChange,
  onAddOrder,
}: Props) {
  const { t } = useI18n();
  const isSingleDay = isSameDay(range.from, range.to);

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
        <DashboardDateText chosenDate={range.from} />
        {!isSingleDay && (
          <>
            <span className={styles.rangeSeparator} aria-hidden="true">
              –
            </span>
            <DashboardDateText chosenDate={range.to} />
          </>
        )}
        <MiniCalendarTrigger mode="range" range={range} onRangeChange={onRangeChange} />
      </div>
    </div>
  );
}
