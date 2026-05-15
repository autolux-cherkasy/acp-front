"use client";

import { useI18n } from "@/src/shared/i18n/I18nProvider";
import SharedLabel from "../SharedLabel/SharedLabel";

export function DashboardDateText() {
  const { locale } = useI18n();

  const formatted = new Intl.DateTimeFormat(locale, {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date());

  return <SharedLabel variant="dashboardDate">{formatted}</SharedLabel>;
}
