import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useI18n } from "@/src/shared/i18n/I18nProvider";
import {
  addScheduleEntry,
  CreateScheduleEntryBody,
  deleteScheduleEntry,
  getAdminSchedule,
  RouteWithSchedule,
  updateScheduleEntry,
  UpdateScheduleEntryBody,
} from "./dashboardScheduleApi";
import {
  addRoute,
  CreateRouteBody,
  deleteRoute,
  updateRoute,
  UpdateRouteBody,
} from "./dashboardRoutesApi";
import { createOptimisticMutationHandlers } from "@/src/shared/lib/optimisticMutation";
import { ADMIN_SCHEDULE_KEY } from "./dashboardApiKeys";
export { ADMIN_SCHEDULE_KEY };

export const useAdminScheduleQuery = (options?: { enabled?: boolean }) =>
  useQuery<RouteWithSchedule[]>({
    queryFn: getAdminSchedule,
    queryKey: [ADMIN_SCHEDULE_KEY],
    staleTime: 1000 * 60 * 5,
    ...options,
  });

function addRouteOptimistic(
  old: RouteWithSchedule[] | undefined,
  body: CreateRouteBody,
): RouteWithSchedule[] {
  return [
    ...(old ?? []),
    {
      id: `temp-${Date.now()}`,
      name: body.name,
      origin: body.origin,
      destination: body.destination,
      schedules: [],
    },
  ];
}

export const useAddRouteMutation = () => {
  const queryClient = useQueryClient();
  const { t } = useI18n();
  return useMutation({
    mutationFn: (body: CreateRouteBody) => addRoute(body),
    ...createOptimisticMutationHandlers<CreateRouteBody, RouteWithSchedule[]>({
      queryClient,
      queryKey: [ADMIN_SCHEDULE_KEY],
      updateCache: addRouteOptimistic,
      successMessage: t("common.toast.routeAddSuccess"),
      errorMessage: t("common.toast.routeAddError"),
    }),
  });
};

export const useUpdateRouteMutation = () => {
  const queryClient = useQueryClient();
  const { t } = useI18n();
  return useMutation({
    mutationFn: ({ id, body }: { id: string; body: UpdateRouteBody }) => updateRoute(id, body),
    ...createOptimisticMutationHandlers<{ id: string; body: UpdateRouteBody }, RouteWithSchedule[]>({
      queryClient,
      queryKey: [ADMIN_SCHEDULE_KEY],
      updateCache: (old, { id, body }) =>
        old?.map((route) => (route.id === id ? { ...route, ...body } : route)),
      successMessage: t("common.toast.routeUpdateSuccess"),
      errorMessage: t("common.toast.routeUpdateError"),
    }),
  });
};

// direction на бекенді складається з двох міст, тож оптимістичний рядок
// будуємо так само — інакше він до інвалідації показувався б порожнім.
function buildDirection(departurePlace: string, arrivalPlace: string): string {
  return `${departurePlace.trim()} - ${arrivalPlace.trim()}`;
}

export const useAddScheduleEntryMutation = () => {
  const queryClient = useQueryClient();
  const { t } = useI18n();
  return useMutation({
    mutationFn: (body: CreateScheduleEntryBody) => addScheduleEntry(body),
    ...createOptimisticMutationHandlers<CreateScheduleEntryBody, RouteWithSchedule[]>({
      queryClient,
      queryKey: [ADMIN_SCHEDULE_KEY],
      updateCache: (old, body) =>
        old?.map((route) =>
          route.id === body.routeId
            ? {
                ...route,
                schedules: [
                  ...route.schedules,
                  {
                    id: `temp-${Date.now()}`,
                    direction: buildDirection(body.departurePlace, body.arrivalPlace),
                    platform: "Центральна",
                    departureTime: body.departureTime,
                    arrivalTime: body.arrivalTime,
                    price: body.price,
                    isActive: true,
                  },
                ],
              }
            : route,
        ),
      successMessage: t("common.toast.directionAddSuccess"),
      errorMessage: t("common.toast.directionAddError"),
    }),
  });
};

export const useUpdateScheduleEntryMutation = () => {
  const queryClient = useQueryClient();
  const { t } = useI18n();
  return useMutation({
    mutationFn: ({ id, body }: { id: string; body: UpdateScheduleEntryBody }) =>
      updateScheduleEntry(id, body),
    ...createOptimisticMutationHandlers<
      { id: string; body: UpdateScheduleEntryBody },
      RouteWithSchedule[]
    >({
      queryClient,
      queryKey: [ADMIN_SCHEDULE_KEY],
      updateCache: (old, { id, body }) =>
        old?.map((route) => ({
          ...route,
          schedules: route.schedules.map((entry) => {
            if (entry.id !== id) return entry;
            const [currentDeparture = "", currentArrival = ""] = entry.direction.split(" - ");
            const directionChanging =
              body.departurePlace !== undefined || body.arrivalPlace !== undefined;
            return {
              ...entry,
              ...(body.departureTime !== undefined && { departureTime: body.departureTime }),
              ...(body.arrivalTime !== undefined && { arrivalTime: body.arrivalTime }),
              ...(body.price !== undefined && { price: body.price }),
              ...(directionChanging && {
                direction: buildDirection(
                  body.departurePlace ?? currentDeparture,
                  body.arrivalPlace ?? currentArrival,
                ),
              }),
            };
          }),
        })),
      successMessage: t("common.toast.directionUpdateSuccess"),
      errorMessage: t("common.toast.directionUpdateError"),
    }),
  });
};

export const useDeleteScheduleEntryMutation = () => {
  const queryClient = useQueryClient();
  const { t } = useI18n();
  return useMutation({
    mutationFn: (id: string) => deleteScheduleEntry(id),
    ...createOptimisticMutationHandlers<string, RouteWithSchedule[]>({
      queryClient,
      queryKey: [ADMIN_SCHEDULE_KEY],
      updateCache: (old, id) =>
        old?.map((route) => ({
          ...route,
          schedules: route.schedules.filter((entry) => entry.id !== id),
        })),
      successMessage: t("common.toast.directionDeleteSuccess"),
      errorMessage: t("common.toast.directionDeleteError"),
    }),
  });
};

export const useDeleteRouteMutation = () => {
  const queryClient = useQueryClient();
  const { t } = useI18n();
  return useMutation({
    mutationFn: (id: string) => deleteRoute(id),
    ...createOptimisticMutationHandlers<string, RouteWithSchedule[]>({
      queryClient,
      queryKey: [ADMIN_SCHEDULE_KEY],
      updateCache: (old, id) => old?.filter((route) => route.id !== id),
      successMessage: t("common.toast.routeDeleteSuccess"),
      errorMessage: t("common.toast.routeDeleteError"),
    }),
  });
};
