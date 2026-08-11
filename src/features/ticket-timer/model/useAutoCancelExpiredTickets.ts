"use client";

import { updateAdminBooking } from "@/src/entities/ticket";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useCallback, useRef } from "react";

/**
 * Коли таймер брони доходить до межі, замовлення скасовується автоматично.
 * Мутація живе на рівні сторінки, а не рядка таблиці: так на квиток гарантовано
 * припадає один PATCH, навіть якщо рядок перемальовується або таблиця
 * перезавантажується.
 */
export function useAutoCancelExpiredTickets() {
  const queryClient = useQueryClient();
  const requested = useRef(new Set<string>());

  const { mutate } = useMutation({
    mutationFn: (ticketId: string) => updateAdminBooking(ticketId, { status: "CANCELLED" }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin-bookings"] }),
    // Невдалу спробу знімаємо з обліку, щоб таймер міг спробувати ще раз.
    onError: (_error, ticketId) => {
      requested.current.delete(ticketId);
    },
  });

  return useCallback(
    (ticketId: string) => {
      if (requested.current.has(ticketId)) return;

      requested.current.add(ticketId);
      mutate(ticketId);
    },
    [mutate],
  );
}
