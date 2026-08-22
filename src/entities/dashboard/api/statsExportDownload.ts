import type { StatsExportResponse } from "./statsExportApi";

const CSV_HEADER = [
  "routeName",
  "direction",
  "tripsCount",
  "ticketsSoldTotal",
  "occupancyPercent",
  "revenueTotal",
  "buyoutRatePercent",
] as const;

function escapeCsvCell(value: string | number): string {
  const raw = String(value);
  if (/[",\n\r]/.test(raw)) {
    return `"${raw.replace(/"/g, '""')}"`;
  }
  return raw;
}

export function downloadStatsExportCsv(data: StatsExportResponse) {
  if (typeof window === "undefined") {
    return;
  }

  const lines = [
    CSV_HEADER.join(","),
    ...data.stats.map((row) =>
      [
        row.routeName,
        row.direction,
        row.tripsCount,
        row.ticketsSoldTotal,
        row.occupancyPercent,
        row.revenueTotal,
        row.buyoutRatePercent,
      ]
        .map(escapeCsvCell)
        .join(","),
    ),
  ];

  const blob = new Blob([`\uFEFF${lines.join("\n")}`], {
    type: "text/csv;charset=utf-8",
  });
  const objectUrl = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = objectUrl;
  anchor.download = `${data.sheetTitle}.csv`;
  anchor.click();
  URL.revokeObjectURL(objectUrl);
}

export function openStatsExportSheet(
  sheetUrl: string,
  tab: Window | null,
): boolean {
  if (typeof window === "undefined") {
    return false;
  }

  if (tab && !tab.closed) {
    tab.location.href = sheetUrl;
    tab.focus();
    return true;
  }

  const openedTab = window.open(sheetUrl, "_blank", "noopener,noreferrer");
  return openedTab != null;
}
