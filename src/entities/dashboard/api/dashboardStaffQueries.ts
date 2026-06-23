import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useI18n } from "@/src/shared/i18n/I18nProvider";
import { showServerToast } from "@/src/shared/lib/toast";
import {
  addDispatcher,
  addDriver,
  AdminStaffResponse,
  CreateDispatcherBody,
  CreateDriverBody,
  deleteDispatcher,
  deleteDriver,
  getAdminStaff,
  UpdateDispatcherBody,
  UpdateDriverBody,
  updateDispatcher,
  updateDriver,
} from "./staffApi";

export const ADMIN_STAFF_KEY = "admin_staff";

export const useAdminStaffQuery = (options?: { enabled?: boolean }) =>
  useQuery<AdminStaffResponse>({
    queryFn: getAdminStaff,
    queryKey: [ADMIN_STAFF_KEY],
    staleTime: 1000 * 60 * 5,
    ...options,
  });

export const useAddDispatcherMutation = () => {
  const queryClient = useQueryClient();
  const { t } = useI18n();
  return useMutation({
    mutationFn: (body: CreateDispatcherBody) => addDispatcher(body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [ADMIN_STAFF_KEY] });
      showServerToast({ type: "success", successMessage: t("common.toast.dispatcherAddSuccess") });
    },
    onError: (error) => {
      showServerToast({ type: "error", error, errorMessage: t("common.toast.dispatcherAddError") });
    },
  });
};

export const useUpdateDispatcherMutation = () => {
  const queryClient = useQueryClient();
  const { t } = useI18n();
  return useMutation({
    mutationFn: ({ id, body }: { id: number; body: UpdateDispatcherBody }) =>
      updateDispatcher(id, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [ADMIN_STAFF_KEY] });
      showServerToast({ type: "success", successMessage: t("common.toast.dispatcherUpdateSuccess") });
    },
    onError: (error) => {
      showServerToast({ type: "error", error, errorMessage: t("common.toast.dispatcherUpdateError") });
    },
  });
};

export const useDeleteDispatcherMutation = () => {
  const queryClient = useQueryClient();
  const { t } = useI18n();
  return useMutation({
    mutationFn: (id: number) => deleteDispatcher(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [ADMIN_STAFF_KEY] });
      showServerToast({ type: "success", successMessage: t("common.toast.dispatcherDeleteSuccess") });
    },
    onError: (error) => {
      showServerToast({ type: "error", error, errorMessage: t("common.toast.dispatcherDeleteError") });
    },
  });
};

export const useAddDriverMutation = () => {
  const queryClient = useQueryClient();
  const { t } = useI18n();
  return useMutation({
    mutationFn: (body: CreateDriverBody) => addDriver(body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [ADMIN_STAFF_KEY] });
      showServerToast({ type: "success", successMessage: t("common.toast.driverAddSuccess") });
    },
    onError: (error) => {
      showServerToast({ type: "error", error, errorMessage: t("common.toast.driverAddError") });
    },
  });
};

export const useUpdateDriverMutation = () => {
  const queryClient = useQueryClient();
  const { t } = useI18n();
  return useMutation({
    mutationFn: ({ id, body }: { id: string; body: UpdateDriverBody }) =>
      updateDriver(id, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [ADMIN_STAFF_KEY] });
      showServerToast({ type: "success", successMessage: t("common.toast.driverUpdateSuccess") });
    },
    onError: (error) => {
      showServerToast({ type: "error", error, errorMessage: t("common.toast.driverUpdateError") });
    },
  });
};

export const useDeleteDriverMutation = () => {
  const queryClient = useQueryClient();
  const { t } = useI18n();
  return useMutation({
    mutationFn: (id: string) => deleteDriver(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [ADMIN_STAFF_KEY] });
      showServerToast({ type: "success", successMessage: t("common.toast.driverDeleteSuccess") });
    },
    onError: (error) => {
      showServerToast({ type: "error", error, errorMessage: t("common.toast.driverDeleteError") });
    },
  });
};
