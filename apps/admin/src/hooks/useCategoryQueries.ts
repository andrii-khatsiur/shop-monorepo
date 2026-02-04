import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { message } from "antd";
import type { Category, CategoryInput } from "@shop-monorepo/types";
import { apiClient } from "../services/api";

const CATEGORY_QUERY_KEY = ["categories"];

export const useCategories = (
  sorter?: { field?: string; direction?: "asc" | "desc" },
  filters?: { isActive?: boolean }
) => {
  return useQuery<Category[], Error>({
    queryKey: [...CATEGORY_QUERY_KEY, sorter, filters],
    queryFn: async () => {
      const data = await apiClient.categories.all(sorter, filters);
      return data;
    },
  });
};

export const useCreateCategory = () => {
  const queryClient = useQueryClient();
  return useMutation<Category, Error, CategoryInput>({
    mutationFn: (newCategory) => apiClient.categories.create(newCategory),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CATEGORY_QUERY_KEY });
      message.success("Категорію успішно додано!");
    },
    onError: (error) => {
      message.error(`Не вдалося додати категорію: ${error.message}`);
    },
  });
};

export const useUpdateCategory = () => {
  const queryClient = useQueryClient();
  return useMutation<Category, Error, { id: number; category: CategoryInput }>({
    mutationFn: ({ id, category }) => apiClient.categories.update(id, category),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CATEGORY_QUERY_KEY });
      message.success("Категорію успішно оновлено!");
    },
    onError: (error) => {
      message.error(`Не вдалося оновити категорію: ${error.message}`);
    },
  });
};

export const useDeleteCategory = () => {
  const queryClient = useQueryClient();
  return useMutation<
    { message: string },
    Error,
    number // The id of the category to delete
  >({
    mutationFn: (id) => apiClient.categories.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CATEGORY_QUERY_KEY });
      message.success("Категорію успішно видалено!");
    },
    onError: (error) => {
      message.error(`Не вдалося видалити категорію: ${error.message}`);
    },
  });
};
