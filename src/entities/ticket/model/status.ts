import type { BookingStatus } from "./types";

/**
 * Зворотний відлік має сенс лише для брони, яка ще може згоріти. Для
 * оплачених, скасованих і протермінованих замовлень таймера немає.
 */
export function hasLiveTimer(status: BookingStatus): boolean {
  return status === "reserved" || status === "pending";
}
