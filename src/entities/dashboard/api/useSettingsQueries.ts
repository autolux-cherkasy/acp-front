import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useMemo } from "react";
import { useI18n } from "@/src/shared/i18n/I18nProvider";
import { showServerToast } from "@/src/shared/lib/toast";
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
import { SETTINGS_COMPANY_KEY, SETTINGS_PERMISSIONS_KEY, PHONES_KEY } from "./dashboardApiKeys";
export { SETTINGS_COMPANY_KEY, SETTINGS_PERMISSIONS_KEY, PHONES_KEY };

export const useCompanySettingsQuery = () =>
  useQuery({ queryFn: getCompanySettings, queryKey: [SETTINGS_COMPANY_KEY] });

export const usePermissionsQuery = () =>
  useQuery({ queryFn: getPermissions, queryKey: [SETTINGS_PERMISSIONS_KEY] });

export const usePhonesQuery = () =>
  useQuery({ queryFn: getPhones, queryKey: [PHONES_KEY] });

export const usePhones = () => {
  const { data: phonesData } = usePhonesQuery();
  return useMemo(() => {
    if (!phonesData) return [];
    return [phonesData.phone1, phonesData.phone2, phonesData.phone3]
      .filter(Boolean)
      .map((p) => ({
        text: p?.replace(/^\+380(\d{2})(\d{3})(\d{2})(\d{2})$/, "+380$1 $2 $3 $4"),
        href: `tel:${p}`,
      }));
  }, [phonesData]);
};

export function useUpdateCompanyMutation() {
  const queryClient = useQueryClient();
  const { t } = useI18n();
  return useMutation({
    mutationFn: (data: UpdateCompanyPayload) => updateCompanySettings(data),
    onSuccess: (updated) => {
      queryClient.setQueryData([SETTINGS_COMPANY_KEY], updated);
      showServerToast({ type: "success", successMessage: t("common.toast.settingsUpdateSuccess") });
    },
    onError: (error) => {
      showServerToast({ type: "error", error, errorMessage: t("common.toast.settingsUpdateError") });
    },
  });
}

export function useUpdatePermissionsMutation() {
  const queryClient = useQueryClient();
  const { t } = useI18n();
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
    onError: (error, _data, context) => {
      if (context?.previous) {
        queryClient.setQueryData([SETTINGS_PERMISSIONS_KEY], context.previous);
      }
      showServerToast({ type: "error", error, errorMessage: t("common.toast.settingsUpdateError") });
    },
    onSuccess: (updated) => {
      queryClient.setQueryData([SETTINGS_PERMISSIONS_KEY], updated);
      showServerToast({ type: "success", successMessage: t("common.toast.settingsUpdateSuccess") });
    },
  });
}
