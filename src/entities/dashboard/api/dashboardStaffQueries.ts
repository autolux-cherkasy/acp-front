import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useI18n } from "@/src/shared/i18n/I18nProvider";
import { createOptimisticMutationHandlers } from "./optimisticMutation";
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

import { ADMIN_STAFF_KEY } from "./dashboardApiKeys";
export { ADMIN_STAFF_KEY };

export const useAdminStaffQuery = (options?: { enabled?: boolean }) =>
  useQuery<AdminStaffResponse>({
    queryFn: getAdminStaff,
    queryKey: [ADMIN_STAFF_KEY],
    staleTime: 1000 * 60 * 5,
    ...options,
  });

function addDispatcherOptimistic(
  old: AdminStaffResponse | undefined,
  body: CreateDispatcherBody,
): AdminStaffResponse | undefined {
  if (!old) return old;
  return {
    ...old,
    dispatchers: [
      ...old.dispatchers,
      { id: Date.now(), name: body.name, email: body.email, phone: body.phone },
    ],
  };
}

function addDriverOptimistic(
  old: AdminStaffResponse | undefined,
  body: CreateDriverBody,
): AdminStaffResponse | undefined {
  if (!old) return old;
  return {
    ...old,
    drivers: [
      ...old.drivers,
      {
        id: `temp-${Date.now()}`,
        fullName: body.fullName,
        phone: body.phone,
        licenseValidUntil: body.licenseValidUntil,
        licenseCategories: body.licenseCategories,
      },
    ],
  };
}

export const useAddDispatcherMutation = () => {
  const queryClient = useQueryClient();
  const { t } = useI18n();
  return useMutation({
    mutationFn: (body: CreateDispatcherBody) => addDispatcher(body),
    ...createOptimisticMutationHandlers<CreateDispatcherBody, AdminStaffResponse>({
      queryClient,
      queryKey: [ADMIN_STAFF_KEY],
      updateCache: addDispatcherOptimistic,
      successMessage: t("common.toast.dispatcherAddSuccess"),
      errorMessage: t("common.toast.dispatcherAddError"),
    }),
  });
};

export const useUpdateDispatcherMutation = () => {
  const queryClient = useQueryClient();
  const { t } = useI18n();
  return useMutation({
    mutationFn: ({ id, body }: { id: number; body: UpdateDispatcherBody }) =>
      updateDispatcher(id, body),
    ...createOptimisticMutationHandlers<
      { id: number; body: UpdateDispatcherBody },
      AdminStaffResponse
    >({
      queryClient,
      queryKey: [ADMIN_STAFF_KEY],
      updateCache: (old, { id, body }) =>
        old && {
          ...old,
          dispatchers: old.dispatchers.map((d) => (d.id === id ? { ...d, ...body } : d)),
        },
      successMessage: t("common.toast.dispatcherUpdateSuccess"),
      errorMessage: t("common.toast.dispatcherUpdateError"),
    }),
  });
};

export const useDeleteDispatcherMutation = () => {
  const queryClient = useQueryClient();
  const { t } = useI18n();
  return useMutation({
    mutationFn: (id: number) => deleteDispatcher(id),
    ...createOptimisticMutationHandlers<number, AdminStaffResponse>({
      queryClient,
      queryKey: [ADMIN_STAFF_KEY],
      updateCache: (old, id) =>
        old && { ...old, dispatchers: old.dispatchers.filter((d) => d.id !== id) },
      successMessage: t("common.toast.dispatcherDeleteSuccess"),
      errorMessage: t("common.toast.dispatcherDeleteError"),
    }),
  });
};

export const useAddDriverMutation = () => {
  const queryClient = useQueryClient();
  const { t } = useI18n();
  return useMutation({
    mutationFn: (body: CreateDriverBody) => addDriver(body),
    ...createOptimisticMutationHandlers<CreateDriverBody, AdminStaffResponse>({
      queryClient,
      queryKey: [ADMIN_STAFF_KEY],
      updateCache: addDriverOptimistic,
      successMessage: t("common.toast.driverAddSuccess"),
      errorMessage: t("common.toast.driverAddError"),
    }),
  });
};

export const useUpdateDriverMutation = () => {
  const queryClient = useQueryClient();
  const { t } = useI18n();
  return useMutation({
    mutationFn: ({ id, body }: { id: string; body: UpdateDriverBody }) => updateDriver(id, body),
    ...createOptimisticMutationHandlers<{ id: string; body: UpdateDriverBody }, AdminStaffResponse>({
      queryClient,
      queryKey: [ADMIN_STAFF_KEY],
      updateCache: (old, { id, body }) =>
        old && { ...old, drivers: old.drivers.map((d) => (d.id === id ? { ...d, ...body } : d)) },
      successMessage: t("common.toast.driverUpdateSuccess"),
      errorMessage: t("common.toast.driverUpdateError"),
    }),
  });
};

export const useDeleteDriverMutation = () => {
  const queryClient = useQueryClient();
  const { t } = useI18n();
  return useMutation({
    mutationFn: (id: string) => deleteDriver(id),
    ...createOptimisticMutationHandlers<string, AdminStaffResponse>({
      queryClient,
      queryKey: [ADMIN_STAFF_KEY],
      updateCache: (old, id) => old && { ...old, drivers: old.drivers.filter((d) => d.id !== id) },
      successMessage: t("common.toast.driverDeleteSuccess"),
      errorMessage: t("common.toast.driverDeleteError"),
    }),
  });
};
