import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getCompanySettings,
  getPermissions,
  getPhones,
  PermissionsResponse,
  updateCompanySettings,
  updatePermissions,
  type UpdateCompanyPayload,
  type UpdatePermissionsPayload,
} from "./settingsApi";

export const SETTINGS_COMPANY_KEY = "settings_company";
export const SETTINGS_PERMISSIONS_KEY = "settings_permissions";
export const PHONES_KEY = "public_phones";

export const useCompanySettingsQuery = () =>
  useQuery({ queryFn: getCompanySettings, queryKey: [SETTINGS_COMPANY_KEY] });

export const usePermissionsQuery = () =>
  useQuery({ queryFn: getPermissions, queryKey: [SETTINGS_PERMISSIONS_KEY] });

export const usePhonesQuery = () => useQuery({ queryFn: getPhones, queryKey: [PHONES_KEY] });

export function useUpdateCompanyMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: UpdateCompanyPayload) => updateCompanySettings(data),
    onSuccess: (updated) => {
      queryClient.setQueryData([SETTINGS_COMPANY_KEY], updated);
    },
  });
}

export function useUpdatePermissionsMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: UpdatePermissionsPayload) => updatePermissions(data),
    onMutate: async (data) => {
      await queryClient.cancelQueries({ queryKey: [SETTINGS_PERMISSIONS_KEY] });
      const previous = queryClient.getQueryData<PermissionsResponse>([SETTINGS_PERMISSIONS_KEY]);
      queryClient.setQueryData<PermissionsResponse>([SETTINGS_PERMISSIONS_KEY], (old) =>
        old ? { ...old, ...data } : old,
      );
      return { previous };
    },
    onError: (_err, _data, context) => {
      if (context?.previous) {
        queryClient.setQueryData([SETTINGS_PERMISSIONS_KEY], context.previous);
      }
    },
    onSuccess: (updated) => {
      queryClient.setQueryData([SETTINGS_PERMISSIONS_KEY], updated);
    },
  });
}
