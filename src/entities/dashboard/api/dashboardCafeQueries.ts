import { apiFetch, showServerToast, useI18n } from "@/src/shared";
import {
  CafeItemResponse,
  CafeSectionWithCategoriesResponse,
  UpdateCafeItemPayload,
} from "../types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ADMIN_CAFE_KEY, ADMIN_CAFE_URL } from "./dashboardApiKeys";

export { ADMIN_CAFE_KEY };

export const getAdminMenu = () => {
  return apiFetch<CafeSectionWithCategoriesResponse[]>(`${ADMIN_CAFE_URL}/menu`);
};

export const updateCafeItem = (id: string, body: UpdateCafeItemPayload) => {
  return apiFetch<CafeItemResponse>(`${ADMIN_CAFE_URL}/items/${id}`, {
    method: "PATCH",
    body: JSON.stringify(body),
  });
};

export const useAdminCafeQuery = (options?: { enabled?: boolean }) => {
  return useQuery<CafeSectionWithCategoriesResponse[]>({
    queryFn: getAdminMenu,
    queryKey: [ADMIN_CAFE_KEY],
    staleTime: 1000 * 60 * 5,
    ...options,
  });
};

export const useCafeItemUpdateMutation = (options?: { enabled?: boolean }) => {
  const queryClient = useQueryClient();
  const { t } = useI18n();
  return useMutation<CafeItemResponse, Error, { id: string; body: UpdateCafeItemPayload }, { previous: CafeSectionWithCategoriesResponse[] | undefined }>({
    mutationFn: ({ id, body }: { id: string; body: UpdateCafeItemPayload }) =>
      updateCafeItem(id, body),
    mutationKey: [ADMIN_CAFE_KEY],
    onMutate: async (data) => {
      await queryClient.cancelQueries({ queryKey: [ADMIN_CAFE_KEY] });
      const previous = queryClient.getQueryData<CafeSectionWithCategoriesResponse[]>([ADMIN_CAFE_KEY]);
      queryClient.setQueryData<CafeSectionWithCategoriesResponse[]>([ADMIN_CAFE_KEY], (old) =>
        old?.map((section) => ({
          ...section,
          categories: section.categories.map((category) => ({
            ...category,
            items: category.items.map((item) =>
              item.id === data.id ? { ...item, ...data.body } : item,
            ),
          })),
        })),
      );
      return { previous };
    },
    onError: (error, _data, context) => {
      if (context?.previous) {
        queryClient.setQueryData([ADMIN_CAFE_KEY], context.previous);
      }
      showServerToast({
        type: "error",
        error,
        errorMessage: t("common.toast.dispatcherUpdateError"),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [ADMIN_CAFE_KEY] });
      showServerToast({
        type: "success",
        successMessage: t("common.toast.dispatcherUpdateSuccess"),
      });
    },
    ...options,
  });
};
