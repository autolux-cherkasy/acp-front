import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useI18n } from "@/src/shared/i18n/I18nProvider";
import { createOptimisticMutationHandlers } from "@/src/shared/lib/optimisticMutation";
import {
  addBus,
  BusResponse,
  CreateBusBody,
  deleteBus,
  getBuses,
  UpdateBusBody,
  updateBus,
} from "./dashboardBusesApi";
import { ADMIN_FLEET_KEY } from "./dashboardApiKeys";
export { ADMIN_FLEET_KEY };

export const useAdminFleetQuery = (options?: { enabled?: boolean }) =>
  useQuery<BusResponse[]>({
    queryFn: getBuses,
    queryKey: [ADMIN_FLEET_KEY],
    staleTime: 1000 * 60 * 5,
    ...options,
  });

function addBusOptimistic(old: BusResponse[] | undefined, body: CreateBusBody): BusResponse[] {
  return [
    ...(old ?? []),
    {
      id: `temp-${Date.now()}`,
      model: body.model,
      seatsCount: body.seatsCount,
      registrationNumber: body.registrationNumber,
      driverId: body.driverId ?? null,
      isActive: body.isActive ?? true,
      driver: null,
    },
  ];
}

export const useAddBusMutation = () => {
  const queryClient = useQueryClient();
  const { t } = useI18n();
  return useMutation({
    mutationFn: (body: CreateBusBody) => addBus(body),
    ...createOptimisticMutationHandlers<CreateBusBody, BusResponse[]>({
      queryClient,
      queryKey: [ADMIN_FLEET_KEY],
      updateCache: addBusOptimistic,
      successMessage: t("common.toast.busAddSuccess"),
      errorMessage: t("common.toast.busAddError"),
    }),
  });
};

export const useUpdateBusMutation = () => {
  const queryClient = useQueryClient();
  const { t } = useI18n();
  return useMutation({
    mutationFn: ({ id, body }: { id: string; body: UpdateBusBody }) => updateBus(id, body),
    ...createOptimisticMutationHandlers<{ id: string; body: UpdateBusBody }, BusResponse[]>({
      queryClient,
      queryKey: [ADMIN_FLEET_KEY],
      updateCache: (old, { id, body }) =>
        old?.map((bus) => (bus.id === id ? { ...bus, ...body } : bus)),
      successMessage: t("common.toast.busUpdateSuccess"),
      errorMessage: t("common.toast.busUpdateError"),
    }),
  });
};

export const useDeleteBusMutation = () => {
  const queryClient = useQueryClient();
  const { t } = useI18n();
  return useMutation({
    mutationFn: (id: string) => deleteBus(id),
    ...createOptimisticMutationHandlers<string, BusResponse[]>({
      queryClient,
      queryKey: [ADMIN_FLEET_KEY],
      updateCache: (old, id) => old?.filter((bus) => bus.id !== id),
      successMessage: t("common.toast.busDeleteSuccess"),
      errorMessage: t("common.toast.busDeleteError"),
    }),
  });
};
