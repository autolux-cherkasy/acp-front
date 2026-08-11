type DurationUnit = "day" | "hour" | "minute" | "second";

// Intl-форматери дорогі в конструюванні, а таймер перемальовується щосекунди.
const formatterCache = new Map<string, Intl.NumberFormat>();

function formatUnit(locale: string, unit: DurationUnit, value: number): string {
    const key = `${locale}:${unit}`;
    let formatter = formatterCache.get(key);

    if (!formatter) {
        formatter = new Intl.NumberFormat(locale, { style: "unit", unit, unitDisplay: "long" });
        formatterCache.set(key, formatter);
    }

    return formatter.format(value);
}

/**
 * Людський залишок часу: «2 дні 3 години», «5 годин 20 хвилин», «7 хвилин»,
 * «45 секунд». Показуємо не більше двох найбільших одиниць, а відмінювання
 * бере на себе CLDR через Intl — у локалях числівники заводити не треба.
 */
export function formatDuration(totalSeconds: number, locale: string): string {
    const total = Math.max(0, Math.floor(totalSeconds));

    const days = Math.floor(total / 86400);
    const hours = Math.floor((total % 86400) / 3600);
    const minutes = Math.floor((total % 3600) / 60);
    const seconds = total % 60;

    if (days > 0) {
        const parts = [formatUnit(locale, "day", days)];
        if (hours > 0) parts.push(formatUnit(locale, "hour", hours));

        return parts.join(" ");
    }

    if (hours > 0) {
        const parts = [formatUnit(locale, "hour", hours)];
        if (minutes > 0) parts.push(formatUnit(locale, "minute", minutes));

        return parts.join(" ");
    }

    if (minutes > 0) {
        return formatUnit(locale, "minute", minutes);
    }

    // Остання хвилина — єдине місце, де секунди щось означають.
    return formatUnit(locale, "second", seconds);
}
