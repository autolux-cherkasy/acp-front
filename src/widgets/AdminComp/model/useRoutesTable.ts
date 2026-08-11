"use client";

import { useLayoutEffect, useRef, useState } from "react";

/**
 * Статус рядка більше не тримається в локальному стейті: він приходить з
 * бекенду, а оптимістичне оновлення робить мутація. Тут лишається тільки
 * те, що є суто станом UI.
 */
export function useRoutesTable() {
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);

  return {
    openDropdownId,
    setOpenDropdownId,
  };
}

/**
 * За макетом кнопка фільтра в шапці накриває ту саму смугу, що й колонка
 * «Статус» разом із колонкою меню дій. Задані в CSS 140px і 40px — лише
 * орієнтир: таблиця рендериться з table-layout: auto, тож браузер роздає
 * колонкам вільне місце й реальна ширина залежить від вмісту. Тому міряємо
 * самі клітинки, а не покладаємось на константи.
 */
export function useStatusColumnWidth() {
  const statusColRef = useRef<HTMLTableCellElement | null>(null);
  const actionColRef = useRef<HTMLTableCellElement | null>(null);
  const [width, setWidth] = useState<number | null>(null);

  useLayoutEffect(() => {
    const statusCol = statusColRef.current;
    const actionCol = actionColRef.current;

    if (!statusCol || !actionCol) return;

    const measure = () => {
      const nextWidth =
        statusCol.getBoundingClientRect().width +
        actionCol.getBoundingClientRect().width;

      setWidth((prev) => (prev === nextWidth ? prev : nextWidth));
    };

    measure();

    const observer = new ResizeObserver(measure);
    observer.observe(statusCol);
    observer.observe(actionCol);

    return () => observer.disconnect();
  }, []);

  return { statusColRef, actionColRef, width };
}
