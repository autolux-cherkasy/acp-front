// +380XXXXXXXXX → +38097 480 24 28
export function formatPhone(value: string | null | undefined): string {
  if (!value) return "";
  const digits = value.replace(/\D/g, "");
  if (digits.length !== 12 || !digits.startsWith("380")) return value;
  return `+${digits.slice(0, 5)} ${digits.slice(5, 8)} ${digits.slice(8, 10)} ${digits.slice(10, 12)}`;
}

export function unformatPhone(value: string): string {
  return value.replace(/\s/g, "");
}

// 2042-02-17T00:00:00.000 → 17.02.2042
export function formatLicenseDate(value: string | null | undefined): string {
  if (!value) return "";
  const stripped = value.replace(/^До\s+/, "");
  const iso = stripped.match(/^(\d{4})-(\d{2})-(\d{2})/);
  return iso ? `${iso[3]}.${iso[2]}.${iso[1]}` : stripped;
}

// 17.02.2042 → 2042-02-17
export function unformatLicenseDate(value: string): string {
  const match = value.trim().match(/^(\d{2})\.(\d{2})\.(\d{4})$/);
  if (!match) return value;
  const [, day, month, year] = match;
  return `${year}-${month}-${day}`;
}

// У дужках після міста бекенд тримає станцію метро без префікса
// («м.Київ (Харківська)»), а макет показує її як «м.Київ (ст.м.Харківська)».
// Правка суто відображальна: у запити йде оригінальний рядок напрямку,
// інакше upsert маршруту за direction плодив би дублікати.
const METRO_STOP_PREFIX = "ст.м.";

export function formatMetroStops(value: string): string {
  return value.replace(/\(([^)]*)\)/g, (match, station: string) => {
    const name = station.trim();
    if (!name || name.startsWith(METRO_STOP_PREFIX)) return match;

    return `(${METRO_STOP_PREFIX}${name})`;
  });
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat("uk-UA").format(value) + "\u00A0₴";
}

export function formatYAxis(value: number): string {
  if (value === 0) return "0";
  return `${value / 1000}\u00A0000`;
}

export function getNiceAxisConfig(maxValue: number, tickCount = 6) {
  const rawInterval = maxValue / tickCount;
  const magnitude = Math.pow(10, Math.floor(Math.log10(rawInterval)));
  const niceInterval = Math.ceil(rawInterval / magnitude) * magnitude;
  const maxTick = Math.ceil(maxValue / niceInterval) * niceInterval;
  const ticks = Array.from({ length: maxTick / niceInterval + 1 }, (_, i) => i * niceInterval);
  return { domain: [0, maxTick] as [number, number], ticks };
}

export function getCompactAxisFormatter(maxTick: number) {
  const unit =
    maxTick >= 1000000
      ? { divisor: 1000000, suffix: "M" }
      : maxTick >= 10000
        ? { divisor: 1000, suffix: "k" }
        : { divisor: 1, suffix: "" };

  return (value: number): string => {
    if (value === 0) return "0";

    return `${Number((value / unit.divisor).toFixed(2))}${unit.suffix}`;
  };
}

export function formatDateForApi(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}
