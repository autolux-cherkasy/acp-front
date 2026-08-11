import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useI18n } from "@/src/shared/i18n/I18nProvider";
import { createOptimisticMutationHandlers } from "@/src/shared/lib/optimisticMutation";
import type { TripStatus } from "@/src/entities/trip";
import {
  addTrip,
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
  [ADMIN_TRIPS_KEY, params.date ?? null, params.status ?? null] as const;

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
    }),
  });
};

export const useUpdateTripMutation = (params: GetAdminTripsParams = {}) => {
  const queryClient = useQueryClient();
  const { t } = useI18n();

  return useMutation({
    mutationFn: ({ id, body }: { id: string; body: UpdateTripBody }) =>
      updateTrip(id, body),
    ...createOptimisticMutationHandlers<
      { id: string; body: UpdateTripBody },
      AdminTripsResponse
    >({
      queryClient,
      queryKey: adminTripsQueryKey(params),
      updateCache: (old, { id, body }) =>
        old && {
          ...old,
          trips: old.trips.map((trip) =>
            trip.id === id ? { ...trip, ...body } : trip,
          ),
        },
      successMessage: t("common.toast.tripUpdateSuccess"),
      errorMessage: t("common.toast.tripUpdateError"),
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
