import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useI18n } from "@/src/shared/i18n/I18nProvider";
import { showServerToast } from "@/src/shared/lib/toast";
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

type FleetContext = { previous: BusResponse[] | undefined };

export const useAddBusMutation = () => {
  const queryClient = useQueryClient();
  const { t } = useI18n();
  return useMutation<BusResponse, Error, CreateBusBody, FleetContext>({
    mutationFn: (body: CreateBusBody) => addBus(body),
    onMutate: async (body) => {
      await queryClient.cancelQueries({ queryKey: [ADMIN_FLEET_KEY] });
      const previous = queryClient.getQueryData<BusResponse[]>([ADMIN_FLEET_KEY]);
      queryClient.setQueryData<BusResponse[]>([ADMIN_FLEET_KEY], (old) => [
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
      ]);
      return { previous };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [ADMIN_FLEET_KEY] });
      showServerToast({ type: "success", successMessage: t("common.toast.busAddSuccess") });
    },
    onError: (error, _body, context) => {
      if (context?.previous) {
        queryClient.setQueryData([ADMIN_FLEET_KEY], context.previous);
      }
      showServerToast({ type: "error", error, errorMessage: t("common.toast.busAddError") });
    },
  });
};

export const useUpdateBusMutation = () => {
  const queryClient = useQueryClient();
  const { t } = useI18n();
  return useMutation<BusResponse, Error, { id: string; body: UpdateBusBody }, FleetContext>({
    mutationFn: ({ id, body }: { id: string; body: UpdateBusBody }) =>
      updateBus(id, body),
    onMutate: async ({ id, body }) => {
      await queryClient.cancelQueries({ queryKey: [ADMIN_FLEET_KEY] });
      const previous = queryClient.getQueryData<BusResponse[]>([ADMIN_FLEET_KEY]);
      queryClient.setQueryData<BusResponse[]>([ADMIN_FLEET_KEY], (old) =>
        old?.map((bus) => (bus.id === id ? { ...bus, ...body } : bus)),
      );
      return { previous };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [ADMIN_FLEET_KEY] });
      showServerToast({ type: "success", successMessage: t("common.toast.busUpdateSuccess") });
    },
    onError: (error, _vars, context) => {
      if (context?.previous) {
        queryClient.setQueryData([ADMIN_FLEET_KEY], context.previous);
      }
      showServerToast({ type: "error", error, errorMessage: t("common.toast.busUpdateError") });
    },
  });
};

export const useDeleteBusMutation = () => {
  const queryClient = useQueryClient();
  const { t } = useI18n();
  return useMutation<void, Error, string, FleetContext>({
    mutationFn: (id: string) => deleteBus(id),
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: [ADMIN_FLEET_KEY] });
      const previous = queryClient.getQueryData<BusResponse[]>([ADMIN_FLEET_KEY]);
      queryClient.setQueryData<BusResponse[]>([ADMIN_FLEET_KEY], (old) =>
        old?.filter((bus) => bus.id !== id),
      );
      return { previous };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [ADMIN_FLEET_KEY] });
      showServerToast({ type: "success", successMessage: t("common.toast.busDeleteSuccess") });
    },
    onError: (error, _id, context) => {
      if (context?.previous) {
        queryClient.setQueryData([ADMIN_FLEET_KEY], context.previous);
      }
      showServerToast({ type: "error", error, errorMessage: t("common.toast.busDeleteError") });
    },
  });
};
