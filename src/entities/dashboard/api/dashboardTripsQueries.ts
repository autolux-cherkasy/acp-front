import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useI18n } from "@/src/shared/i18n/I18nProvider";
import { kyivDateOnly } from "@/src/shared/lib/kyivTime";
import { createOptimisticMutationHandlers } from "@/src/shared/lib/optimisticMutation";
import type { TripStatus } from "@/src/entities/trip";
import {
  addTrip,
  type AdminTripDto,
  type AdminTripsResponse,
  type CreateTripBody,
  deleteTrip,
  getAdminTrips,
  type GetAdminTripsParams,
  updateTrip,
  updateTripStatus,
  type UpdateTripBody,
} from "./dashboardTripsApi";
import { ADMIN_TRIPS_KEY } from "./dashboardApiKeys";

export { ADMIN_TRIPS_KEY };

export const adminTripsQueryKey = (params: GetAdminTripsParams = {}) =>
  [
    ADMIN_TRIPS_KEY,
    params.date ?? null,
    params.dateFrom ?? null,
    params.dateTo ?? null,
    params.status ?? null,
  ] as const;

export const useAdminTripsQuery = (params: GetAdminTripsParams = {}) =>
  useQuery<AdminTripsResponse>({
    queryFn: () => getAdminTrips(params),
    queryKey: adminTripsQueryKey(params),
    staleTime: 1000 * 60,
  });

/**
 * Мутації працюють з кешем конкретної доби, тому кожен хук приймає ті самі
 * params, що й запит списку — інакше оптимістичне оновлення потрапило б
 * не в той ключ.
 */
export const useAddTripMutation = (params: GetAdminTripsParams = {}) => {
  const queryClient = useQueryClient();
  const { t } = useI18n();

  return useMutation({
    mutationFn: (body: CreateTripBody) => addTrip(body),
    ...createOptimisticMutationHandlers<CreateTripBody, AdminTripsResponse>({
      queryClient,
      queryKey: adminTripsQueryKey(params),
      // Створений рейс приходить з бекенду з id та порахованими місцями,
      // тож оптимістично лише інвалідовуємо — підставляти заглушку в таблицю
      // означало б показати рядок без номера автобуса й статусу.
      updateCache: (old) => old,
      successMessage: t("common.toast.tripAddSuccess"),
      errorMessage: t("common.toast.tripAddError"),
      // 409 — рейс із такою парою «час + платформа» на маршруті вже заведено.
      errorMessageByStatus: { 409: t("common.toast.tripConflictError") },
    }),
  });
};

/**
 * Поля рядка, яких немає в PATCH-тілі: держномер приходить із парку за busId,
 * а напрямок бекенд перепише напрямком обраного маршруту. Без них рядок до
 * інвалідації показував би старий автобус і старий напрямок.
 */
export type UpdateTripOptimisticFields = Partial<
  Pick<AdminTripDto, "busNumber" | "direction">
>;

export type UpdateTripVariables = {
  id: string;
  body: UpdateTripBody;
  optimistic?: UpdateTripOptimisticFields;
};

const patchTrip = (
  trip: AdminTripDto,
  { body, optimistic }: Pick<UpdateTripVariables, "body" | "optimistic">,
): AdminTripDto => {
  const patched = { ...trip, ...body, ...optimistic };

  return { ...patched, isFull: patched.occupiedSeats >= patched.totalSeats };
};

/** Список приходить відсортованим за departureTime; ISO-рядки порівнюються як час. */
const byDepartureTime = (first: AdminTripDto, second: AdminTripDto) =>
  first.departureTime.localeCompare(second.departureTime);

const isWithinQueryRange = (
  trip: AdminTripDto,
  { date, dateFrom, dateTo }: GetAdminTripsParams,
) => {
  const from = dateFrom ?? date;
  const to = dateTo ?? date;
  const tripDate = kyivDateOnly(trip.departureTime);

  return (!from || tripDate >= from) && (!to || tripDate <= to);
};

export const useUpdateTripMutation = (params: GetAdminTripsParams = {}) => {
  const queryClient = useQueryClient();
  const { t } = useI18n();

  return useMutation({
    mutationFn: ({ id, body }: UpdateTripVariables) => updateTrip(id, body),
    ...createOptimisticMutationHandlers<
      UpdateTripVariables,
      AdminTripsResponse
    >({
      queryClient,
      queryKey: adminTripsQueryKey(params),
      // Редагування зачіпає й місце рядка в таблиці: зміна часу відправлення
      // пересуває його, а перенесення рейсу за межі обраного діапазону —
      // прибирає зовсім. Інакше рядок стрибав би вже після інвалідації.
      updateCache: (old, { id, body, optimistic }) => {
        if (!old) return old;

        const trips = old.trips
          .map((trip) =>
            trip.id === id ? patchTrip(trip, { body, optimistic }) : trip,
          )
          .filter((trip) => isWithinQueryRange(trip, params))
          .sort(byDepartureTime);

        return {
          ...old,
          trips,
          total: Math.max(old.total - (old.trips.length - trips.length), 0),
        };
      },
      successMessage: t("common.toast.tripUpdateSuccess"),
      errorMessage: t("common.toast.tripUpdateError"),
      errorMessageByStatus: { 409: t("common.toast.tripConflictError") },
    }),
  });
};

export const useUpdateTripStatusMutation = (
  params: GetAdminTripsParams = {},
) => {
  const queryClient = useQueryClient();
  const { t } = useI18n();

  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: TripStatus }) =>
      updateTripStatus(id, status),
    ...createOptimisticMutationHandlers<
      { id: string; status: TripStatus },
      AdminTripsResponse
    >({
      queryClient,
      queryKey: adminTripsQueryKey(params),
      updateCache: (old, { id, status }) =>
        old && {
          ...old,
          trips: old.trips.map((trip) =>
            trip.id === id ? { ...trip, status } : trip,
          ),
        },
      successMessage: t("common.toast.tripStatusUpdateSuccess"),
      errorMessage: t("common.toast.tripStatusUpdateError"),
    }),
  });
};

export const useDeleteTripMutation = (params: GetAdminTripsParams = {}) => {
  const queryClient = useQueryClient();
  const { t } = useI18n();

  return useMutation({
    mutationFn: (id: string) => deleteTrip(id),
    ...createOptimisticMutationHandlers<string, AdminTripsResponse>({
      queryClient,
      queryKey: adminTripsQueryKey(params),
      updateCache: (old, id) =>
        old && {
          ...old,
          trips: old.trips.filter((trip) => trip.id !== id),
          total: Math.max(old.total - 1, 0),
        },
      successMessage: t("common.toast.tripDeleteSuccess"),
      errorMessage: t("common.toast.tripDeleteError"),
    }),
  });
};
