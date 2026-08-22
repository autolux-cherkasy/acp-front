"use client";

import type { PermissionsResponse } from "@/src/entities/dashboard/api/settingsApi";
import { usePermissionsQuery } from "@/src/entities/dashboard/api/useSettingsQueries";
import { useAuthSession } from "@/src/features/auth/model/session";

/** Вкладки «Керування даними» — саме їх адмін перемикає в налаштуваннях. */
export const DATA_MODULE_KEYS = [
  "canAccessRoutes",
  "canAccessFleet",
  "canAccessStaff",
  "canAccessCafe",
] as const satisfies readonly (keyof PermissionsResponse)[];

export function hasAnyDataModule(permissions: PermissionsResponse | undefined) {
  return DATA_MODULE_KEYS.some((key) => permissions?.[key] === true);
}

/**
 * Чи відкритий розділ «Керування даними». Права стосуються лише диспетчера:
 * адмін ними й керує, тож для нього розділ доступний завжди.
 *
 * Поки права не приїхали, повертається undefined — це «ще не знаємо», а не
 * «заборонено». Гейт у цей момент тримає лоадер, а сайдбар не ховає пункт,
 * щоб меню не смикалося на кожному завантаженні робочої зони.
 */
export function useDataSectionAccess(): boolean | undefined {
  const { role } = useAuthSession();
  const isDispatcher = role === "DISPATCHER";
  const { data, isError, isPending } = usePermissionsQuery({ enabled: isDispatcher });

  if (!isDispatcher) return true;
  if (isPending) return undefined;
  // Збій запиту читаємо як «дозволено»: справжній бар'єр — DispatcherPermissionGuard
  // на бекенді, тож мережева помилка не має замикати диспетчеру цілий розділ.
  if (isError) return true;

  return hasAnyDataModule(data);
}
