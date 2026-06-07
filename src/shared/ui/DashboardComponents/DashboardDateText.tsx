"use client";

import { useI18n } from "@/src/shared/i18n/I18nProvider";
import SharedLabel from "../SharedLabel/SharedLabel";

export function DashboardDateText({ chosenDate }: { chosenDate?: Date }) {
  const { locale } = useI18n();

  const formatted = new Intl.DateTimeFormat(locale, {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(chosenDate ?? new Date());

  return <SharedLabel variant="dashboardDate">{formatted}</SharedLabel>;
}
