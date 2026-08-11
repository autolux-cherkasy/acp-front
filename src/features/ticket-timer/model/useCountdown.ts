import { useEffect, useState } from "react";

/**
 * Бронь тримає місце аж до 5 хвилин перед посадкою, тобто залишок може бути
 * і кілька діб. Табло показує лише останні 10 хвилин: доти таймер статично
 * стоїть на 10:00 і стартує рівно тоді, коли залишок у це вікно входить.
 */
export const COUNTDOWN_WINDOW_SECONDS = 600;

const MAX_TIMEOUT_MS = 2_147_483_647;

function toDisplayedSeconds(initialSeconds: number | null): number | null {
  if (initialSeconds === null) return null;

  return Math.min(Math.max(initialSeconds, 0), COUNTDOWN_WINDOW_SECONDS);
}

export function useCountdown(initialSeconds: number | null): number | null {
  const [state, setState] = useState(() => ({
    source: initialSeconds,
    seconds: toDisplayedSeconds(initialSeconds),
  }));

  // Новий залишок з бекенда скидає таймер ще під час рендеру, без зайвого
  // проходу через ефект.
  if (state.source !== initialSeconds) {
    setState({ source: initialSeconds, seconds: toDisplayedSeconds(initialSeconds) });
  }

  useEffect(() => {
    if (initialSeconds === null || initialSeconds <= 0) return;

    let interval: ReturnType<typeof setInterval> | undefined;

    const startTicking = () => {
      interval = setInterval(() => {
        setState((prev) => {
          if (prev.seconds === null || prev.seconds <= 1) {
            clearInterval(interval);
            return { ...prev, seconds: 0 };
          }

          return { ...prev, seconds: prev.seconds - 1 };
        });
      }, 1000);
    };

    const delayMs = Math.max(0, initialSeconds - COUNTDOWN_WINDOW_SECONDS) * 1000;

    if (delayMs > MAX_TIMEOUT_MS) {
      return;
    }

    const startTimeout = setTimeout(startTicking, delayMs);

    return () => {
      clearTimeout(startTimeout);
      clearInterval(interval);
    };
  }, [initialSeconds]);

  return state.seconds;
}
