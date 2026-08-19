"use client";

import { useI18n } from "@/src/shared/i18n/I18nProvider";
import type { TripStatus } from "@/src/entities/trip";
import { Dropdown } from "@/src/shared/ui/Dropdown/Dropdown";

const STATUS_ITEMS: TripStatus[] = [
  "DEPARTED",
  "BOARDING",
  "SCHEDULED",
  "CANCELLED",
];

type StatusDropdownProps = {
  rowId: string;
  openId: string | null;
  onToggle: (id: string | null) => void;
  onStatusChange: (id: string, status: TripStatus) => void;
  onEdit: (id: string) => void;
};

export function StatusDropdown({
  rowId,
  openId,
  onToggle,
  onStatusChange,
  onEdit,
}: StatusDropdownProps) {
  const { t } = useI18n();

  const items = [
    ...STATUS_ITEMS.map((s) => ({
      label: t(`dispatcherArea.routes.table.statuses.${s}`),
      onClick: () => onStatusChange(rowId, s),
    })),
    {
      label: t("dispatcherArea.routes.table.statuses.edit"),
      onClick: () => onEdit(rowId),
    },
  ];

  return (
    <Dropdown
      id={rowId}
      openId={openId}
      onToggle={onToggle}
      items={items}
      align="end"
    />
  );
}
