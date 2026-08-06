"use client";

import { useState } from "react";

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
