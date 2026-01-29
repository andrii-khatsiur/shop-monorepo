import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { message } from "antd";
import type { Brand, BrandInput } from "@shop-monorepo/types";
import { apiClient } from "../services/api";

const BRAND_QUERY_KEY = ["brands"];

export const useBrands = () => {
  return useQuery<Brand[], Error>({
    queryKey: BRAND_QUERY_KEY,
    queryFn: async () => {
      const data = await apiClient.brands.all();
      return data;
    },
  });
};

export const useCreateBrand = () => {
  const queryClient = useQueryClient();
  return useMutation<Brand, Error, BrandInput>({
    mutationFn: (newBrand) => apiClient.brands.create(newBrand),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: BRAND_QUERY_KEY });
      message.success("Бренд успішно додано!");
    },
    onError: (error) => {
      message.error(`Не вдалося додати бренд: ${error.message}`);
    },
  });
};

export const useUpdateBrand = () => {
  const queryClient = useQueryClient();
  return useMutation<Brand, Error, { id: number; brand: BrandInput }>({
    mutationFn: ({ id, brand }) => apiClient.brands.update(id, brand),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: BRAND_QUERY_KEY });
      message.success("Бренд успішно оновлено!");
    },
    onError: (error) => {
      message.error(`Не вдалося оновити бренд: ${error.message}`);
    },
  });
};

export const useDeleteBrand = () => {
  const queryClient = useQueryClient();
  return useMutation<
    { message: string },
    Error,
    number // The id of the brand to delete
  >({
    mutationFn: (id) => apiClient.brands.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: BRAND_QUERY_KEY });
      message.success("Бренд успішно видалено!");
    },
    onError: (error) => {
      message.error(`Не вдалося видалити бренд: ${error.message}`);
    },
  });
};
