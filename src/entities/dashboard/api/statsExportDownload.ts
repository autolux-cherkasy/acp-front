import type { StatsExportResponse } from "./statsExportApi";

const CSV_DELIMITER = ";";

const SUMMARY_HEADERS = [
  "Період з",
  "Період по",
  "Всього замовлень",
  "Загальний дохід, грн",
  "Завантаженість, %",
  "Місця: викуплено",
  "Місця: заброньовано",
  "Місця: скасовано",
  "Дохід: викуплено, грн",
  "Дохід: заброньовано, грн",
  "Дохід: скасовано, грн",
  "% викупу (загальний)",
] as const;

const SEGMENT_HEADERS = [
  "№",
  "Зупинка посадки",
  "Зупинка висадки",
  "Ділянка",
  "Рейсів за період",
  "Продано квитків",
  "Заброньовано, місць",
  "Викуплено, місць",
  "Скасовано, місць",
  "Дохід, грн",
  "Завантаженість, %",
  "% викупу",
] as const;

const REVENUE_HEADERS = ["Дата", "Дохід, грн"] as const;
const LOAD_HEADERS = ["Місяць", "Завантаженість, %"] as const;

function escapeCsvCell(value: string | number): string {
  const raw = String(value);
  if (/[;"\n\r]/.test(raw)) {
    return `"${raw.replace(/"/g, '""')}"`;
  }
  return raw;
}

function formatRow(values: Array<string | number>): string {
  return values.map(escapeCsvCell).join(CSV_DELIMITER);
}

function buildSection(title: string, header: readonly string[], rows: Array<Array<string | number>>) {
  return [title, formatRow([...header]), ...rows.map(formatRow)].join("\n");
}

export function downloadStatsReport(data: StatsExportResponse) {
  if (typeof window === "undefined") {
    return;
  }

  const { summary, segments, revenueSeries, loadSeries, period } = data;

  const summaryRow = [
    summary.startDate,
    summary.endDate,
    summary.ordersTotal,
    summary.revenueTotal,
    summary.occupancyPercent,
    summary.seatsBoughtOut,
    summary.seatsReserved,
    summary.seatsCanceled,
    summary.revenueBoughtOut,
    summary.revenueReserved,
    summary.revenueCanceled,
    summary.buyoutRatePercent,
  ];

  const segmentRows = segments.map((segment, index) => [
    index + 1,
    segment.boardingStopName,
    segment.alightingStopName,
    segment.direction,
    segment.tripsCount,
    segment.ticketsSoldTotal,
    segment.seatsReserved,
    segment.seatsBoughtOut,
    segment.seatsCanceled,
    segment.revenueTotal,
    segment.occupancyPercent,
    segment.buyoutRatePercent,
  ]);

  const revenueRows = revenueSeries.map((point) => [point.bucket, point.value]);
  const loadRows = loadSeries.map((point) => [point.bucket, point.value]);

  const content = [
    buildSection("Підсумок періоду", SUMMARY_HEADERS, [summaryRow]),
    "",
    buildSection("Деталізація по ділянках", SEGMENT_HEADERS, segmentRows),
    "",
    buildSection("Дохід по днях", REVENUE_HEADERS, revenueRows),
    "",
    buildSection("Завантаженість по місяцях", LOAD_HEADERS, loadRows),
  ].join("\n");

  const blob = new Blob([`\uFEFF${content}`], {
    type: "text/csv;charset=utf-8",
  });
  const objectUrl = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = objectUrl;
  anchor.download = `statystyka_${period.startDate}_${period.endDate}.csv`;
  anchor.rel = "noopener";
  anchor.style.display = "none";
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  window.setTimeout(() => URL.revokeObjectURL(objectUrl), 1000);
}

/** @deprecated Use downloadStatsReport */
export const downloadStatsExportCsv = downloadStatsReport;
