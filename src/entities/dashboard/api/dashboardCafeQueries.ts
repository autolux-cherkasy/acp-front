import { apiFetch, showServerToast, useI18n } from "@/src/shared";
import {
  CafeCategoryWithItemsResponse,
  CafeItemResponse,
  CafeSectionWithCategoriesResponse,
  CreateCafeCategoryPayload,
  CreateCafeItemPayload,
  CreateCafeSectionPayload,
  UpdateCafeCategoryPayload,
  UpdateCafeItemPayload,
  UpdateCafeSectionPayload,
} from "../types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ADMIN_CAFE_KEY, ADMIN_CAFE_URL } from "./dashboardApiKeys";

export { ADMIN_CAFE_KEY };

export const getAdminMenu = () => {
  return apiFetch<CafeSectionWithCategoriesResponse[]>(`${ADMIN_CAFE_URL}/menu`);
};

export const uploadCafeImage = (file: File) => {
  const formData = new FormData();
  formData.append("file", file);
  return apiFetch<{ imageUrl: string }>(`${ADMIN_CAFE_URL}/upload-photo`, {
    method: "POST",
    body: formData,
  });
};

export const createCafeSection = (body: CreateCafeSectionPayload) => {
  return apiFetch<CafeSectionWithCategoriesResponse>(`${ADMIN_CAFE_URL}/sections`, {
    method: "POST",
    body: JSON.stringify(body),
  });
};

export const updateCafeSection = (id: string, body: UpdateCafeSectionPayload) => {
  return apiFetch<CafeSectionWithCategoriesResponse>(`${ADMIN_CAFE_URL}/sections/${id}`, {
    method: "PATCH",
    body: JSON.stringify(body),
  });
};

export const deleteCafeSection = (id: string) => {
  return apiFetch<void>(`${ADMIN_CAFE_URL}/sections/${id}`, {
    method: "DELETE",
  });
};

export const createCafeCategory = (body: CreateCafeCategoryPayload) => {
  return apiFetch<CafeCategoryWithItemsResponse>(`${ADMIN_CAFE_URL}/categories`, {
    method: "POST",
    body: JSON.stringify(body),
  });
};

export const updateCafeCategory = (id: string, body: UpdateCafeCategoryPayload) => {
  return apiFetch<CafeCategoryWithItemsResponse>(`${ADMIN_CAFE_URL}/categories/${id}`, {
    method: "PATCH",
    body: JSON.stringify(body),
  });
};

export const createCafeItem = (body: CreateCafeItemPayload) => {
  return apiFetch<CafeItemResponse>(`${ADMIN_CAFE_URL}/items`, {
    method: "POST",
    body: JSON.stringify(body),
  });
};

export const updateCafeItem = (id: string, body: UpdateCafeItemPayload) => {
  return apiFetch<CafeItemResponse>(`${ADMIN_CAFE_URL}/items/${id}`, {
    method: "PATCH",
    body: JSON.stringify(body),
  });
};

export const deleteCafeItem = (id: string) => {
  return apiFetch<void>(`${ADMIN_CAFE_URL}/items/${id}`, {
    method: "DELETE",
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

function useCafeMutation<TVariables, TResult>({
  mutationFn,
  updateCache,
  successMessage,
  errorMessage,
  silent,
}: {
  mutationFn: (variables: TVariables) => Promise<TResult>;
  updateCache: (
    old: CafeSectionWithCategoriesResponse[] | undefined,
    variables: TVariables,
  ) => CafeSectionWithCategoriesResponse[] | undefined;
  successMessage?: string;
  errorMessage?: string;
  silent?: boolean;
}) {
  const queryClient = useQueryClient();
  return useMutation<
    TResult,
    Error,
    TVariables,
    { previous: CafeSectionWithCategoriesResponse[] | undefined }
  >({
    mutationFn,
    mutationKey: [ADMIN_CAFE_KEY],
    onMutate: async (variables) => {
      await queryClient.cancelQueries({ queryKey: [ADMIN_CAFE_KEY] });
      const previous = queryClient.getQueryData<CafeSectionWithCategoriesResponse[]>([
        ADMIN_CAFE_KEY,
      ]);
      queryClient.setQueryData<CafeSectionWithCategoriesResponse[]>([ADMIN_CAFE_KEY], (old) =>
        updateCache(old, variables),
      );
      return { previous };
    },
    onError: (error, _variables, context) => {
      if (context?.previous) {
        queryClient.setQueryData([ADMIN_CAFE_KEY], context.previous);
      }
      if (!silent) {
        showServerToast({ type: "error", error, errorMessage: errorMessage ?? "" });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [ADMIN_CAFE_KEY] });
      if (!silent) {
        showServerToast({ type: "success", successMessage: successMessage ?? "" });
      }
    },
  });
}

export const useAddCafeSectionMutation = () => {
  const { t } = useI18n();
  return useCafeMutation<CreateCafeSectionPayload, CafeSectionWithCategoriesResponse>({
    mutationFn: createCafeSection,
    updateCache: (old, body) => [
      ...(old ?? []),
      {
        id: `temp-${Date.now()}`,
        name: body.name,
        slug: body.slug ?? body.name,
        displayOrder: body.displayOrder ?? (old?.length ?? 0),
        imageUrl: body.imageUrl ?? null,
        isActive: body.isActive ?? true,
        createdAt: new Date(),
        categories: [],
      },
    ],
    successMessage: t("common.toast.cafeSectionAddSuccess"),
    errorMessage: t("common.toast.cafeSectionAddError"),
  });
};

export const useUpdateCafeSectionMutation = () => {
  const { t } = useI18n();
  return useCafeMutation<{ id: string; body: UpdateCafeSectionPayload }, CafeSectionWithCategoriesResponse>({
    mutationFn: ({ id, body }) => updateCafeSection(id, body),
    updateCache: (old, { id, body }) =>
      old?.map((section) => (section.id === id ? { ...section, ...body } : section)),
    successMessage: t("common.toast.cafeSectionUpdateSuccess"),
    errorMessage: t("common.toast.cafeSectionUpdateError"),
  });
};

export const useDeleteCafeSectionMutation = () => {
  const { t } = useI18n();
  return useCafeMutation<string, void>({
    mutationFn: deleteCafeSection,
    updateCache: (old, id) => old?.filter((section) => section.id !== id),
    successMessage: t("common.toast.cafeSectionDeleteSuccess"),
    errorMessage: t("common.toast.cafeSectionDeleteError"),
  });
};

export const useAddCafeCategoryMutation = () => {
  return useCafeMutation<CreateCafeCategoryPayload, CafeCategoryWithItemsResponse>({
    mutationFn: createCafeCategory,
    updateCache: (old, body) =>
      old?.map((section) =>
        section.id === body.sectionId
          ? {
              ...section,
              categories: [
                ...section.categories,
                {
                  id: `temp-${Date.now()}`,
                  sectionId: body.sectionId,
                  name: body.name,
                  displayOrder: body.displayOrder ?? section.categories.length,
                  isActive: body.isActive ?? true,
                  createdAt: new Date(),
                  items: [],
                },
              ],
            }
          : section,
      ),
    silent: true,
  });
};

export const useUpdateCafeCategoryMutation = () => {
  const { t } = useI18n();
  return useCafeMutation<{ id: string; body: UpdateCafeCategoryPayload }, CafeCategoryWithItemsResponse>({
    mutationFn: ({ id, body }) => updateCafeCategory(id, body),
    updateCache: (old, { id, body }) =>
      old?.map((section) => ({
        ...section,
        categories: section.categories.map((category) =>
          category.id === id ? { ...category, ...body } : category,
        ),
      })),
    successMessage: t("common.toast.cafeCategoryUpdateSuccess"),
    errorMessage: t("common.toast.cafeCategoryUpdateError"),
  });
};

export const useAddCafeItemMutation = () => {
  const { t } = useI18n();
  return useCafeMutation<CreateCafeItemPayload, CafeItemResponse>({
    mutationFn: createCafeItem,
    updateCache: (old, body) =>
      old?.map((section) => ({
        ...section,
        categories: section.categories.map((category) =>
          category.id === body.categoryId
            ? {
                ...category,
                items: [
                  ...category.items,
                  {
                    id: `temp-${Date.now()}`,
                    categoryId: body.categoryId,
                    name: body.name,
                    description: body.description ?? null,
                    price: body.price,
                    displayOrder: body.displayOrder ?? category.items.length,
                    isAvailable: body.isAvailable ?? true,
                    createdAt: new Date(),
                  },
                ],
              }
            : category,
        ),
      })),
    successMessage: t("common.toast.cafeItemAddSuccess"),
    errorMessage: t("common.toast.cafeItemAddError"),
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
        errorMessage: t("common.toast.cafeItemUpdateError"),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [ADMIN_CAFE_KEY] });
      showServerToast({
        type: "success",
        successMessage: t("common.toast.cafeItemUpdateSuccess"),
      });
    },
    ...options,
  });
};

export const useDeleteCafeItemMutation = () => {
  const { t } = useI18n();
  return useCafeMutation<string, void>({
    mutationFn: deleteCafeItem,
    updateCache: (old, id) =>
      old?.map((section) => ({
        ...section,
        categories: section.categories.map((category) => ({
          ...category,
          items: category.items.filter((item) => item.id !== id),
        })),
      })),
    successMessage: t("common.toast.cafeItemDeleteSuccess"),
    errorMessage: t("common.toast.cafeItemDeleteError"),
  });
};
