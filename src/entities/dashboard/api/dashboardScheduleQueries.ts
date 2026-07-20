import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useI18n } from "@/src/shared/i18n/I18nProvider";
import { getAdminSchedule, RouteWithSchedule } from "./dashboardScheduleApi";
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
