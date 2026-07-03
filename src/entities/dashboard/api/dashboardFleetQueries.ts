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

export const useAddBusMutation = () => {
  const queryClient = useQueryClient();
  const { t } = useI18n();
  return useMutation({
    mutationFn: (body: CreateBusBody) => addBus(body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [ADMIN_FLEET_KEY] });
      showServerToast({ type: "success", successMessage: t("common.toast.busAddSuccess") });
    },
    onError: (error) => {
      showServerToast({ type: "error", error, errorMessage: t("common.toast.busAddError") });
    },
  });
};

export const useUpdateBusMutation = () => {
  const queryClient = useQueryClient();
  const { t } = useI18n();
  return useMutation({
    mutationFn: ({ id, body }: { id: string; body: UpdateBusBody }) =>
      updateBus(id, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [ADMIN_FLEET_KEY] });
      showServerToast({ type: "success", successMessage: t("common.toast.busUpdateSuccess") });
    },
    onError: (error) => {
      showServerToast({ type: "error", error, errorMessage: t("common.toast.busUpdateError") });
    },
  });
};

export const useDeleteBusMutation = () => {
  const queryClient = useQueryClient();
  const { t } = useI18n();
  return useMutation({
    mutationFn: (id: string) => deleteBus(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [ADMIN_FLEET_KEY] });
      showServerToast({ type: "success", successMessage: t("common.toast.busDeleteSuccess") });
    },
    onError: (error) => {
      showServerToast({ type: "error", error, errorMessage: t("common.toast.busDeleteError") });
    },
  });
};
