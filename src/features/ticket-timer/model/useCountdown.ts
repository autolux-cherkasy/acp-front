import { useEffect, useState } from "react";

/**
 * Бронь тримає місце аж до 5 хвилин перед посадкою, тобто залишок може бути
 * і кілька діб. Табло показує лише останні 10 хвилин, а на 5 хвилинах бронь
 * згорає. Саме вікно й поріг живуть у TicketTimer — хук віддає сирий залишок.
 */
export const COUNTDOWN_WINDOW_SECONDS = 600;
export const CANCEL_FLOOR_SECONDS = 300;

type CountdownState = {
  source: number | null;
  seconds: number | null;
};

function createState(initialSeconds: number | null): CountdownState {
  return {
    source: initialSeconds,
    seconds: initialSeconds === null ? null : Math.max(0, initialSeconds),
  };
}

export function useCountdown(initialSeconds: number | null): number | null {
  const [state, setState] = useState(() => createState(initialSeconds));

  // Новий залишок з бекенда скидає таймер ще під час рендеру, без зайвого
  // проходу через ефект.
  if (state.source !== initialSeconds) {
    setState(createState(initialSeconds));
  }

  useEffect(() => {
    if (initialSeconds === null || initialSeconds <= 0) return;

    // Рахуємо від абсолютного дедлайну, а не декрементом: інакше таймер
    // дрейфує і відстає, поки вкладка у фоні.
    const deadline = Date.now() + initialSeconds * 1000;

    const interval = setInterval(() => {
      const seconds = Math.max(0, Math.round((deadline - Date.now()) / 1000));

      if (seconds === 0) {
        clearInterval(interval);
      }

      setState((prev) => (prev.seconds === seconds ? prev : { ...prev, seconds }));
    }, 1000);

    return () => clearInterval(interval);
  }, [initialSeconds]);

  return state.seconds;
}
