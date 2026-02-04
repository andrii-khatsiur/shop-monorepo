import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { message } from "antd";
import type { Product, PaginatedProducts, ProductInput } from "@shop-monorepo/types";
import { apiClient } from "../services/api";

const PRODUCT_QUERY_KEY = "products"; // Use a single key for all products queries

interface ProductsQueryParams {
  page?: number;
  limit?: number;
  filters?: { brand?: string; category?: string; isActive?: boolean; isNew?: boolean };
  sorter?: { field?: string; direction?: "asc" | "desc" };
}

export const useProducts = (params: ProductsQueryParams) => {
  return useQuery<PaginatedProducts, Error>({
    queryKey: [PRODUCT_QUERY_KEY, params], // Include params in query key for pagination/filtering
    queryFn: async () => {
      const { page = 1, limit = 10, filters, sorter } = params;
      const data = await apiClient.products.all(page, limit, filters, sorter);
      return data;
    },
    // Keep previous data when page/filters change, to avoid flickering
    // This is optional, but improves UX for pagination/filtering
    placeholderData: (previousData) => previousData,
  });
};

export const useProduct = (slug: string) => {
  return useQuery<Product, Error>({
    queryKey: [PRODUCT_QUERY_KEY, slug],
    queryFn: () => apiClient.products.getBySlug(slug),
    enabled: !!slug,
  });
};

export const useCreateProduct = () => {
  const queryClient = useQueryClient();
  return useMutation<Product, Error, ProductInput>({
    mutationFn: (newProduct) => apiClient.products.create(newProduct),
    onSuccess: () => {
      // Invalidate all queries that start with PRODUCT_QUERY_KEY
      queryClient.invalidateQueries({ queryKey: [PRODUCT_QUERY_KEY] });
      message.success("Продукт успішно додано!");
    },
    onError: (error) => {
      message.error(`Не вдалося додати продукт: ${error.message}`);
    },
  });
};

export const useUpdateProduct = () => {
  const queryClient = useQueryClient();
  return useMutation<Product, Error, { id: number; product: ProductInput }>({
    mutationFn: ({ id, product }) => apiClient.products.update(id, product),
    onSuccess: () => {
      // Invalidate all queries that start with PRODUCT_QUERY_KEY
      queryClient.invalidateQueries({ queryKey: [PRODUCT_QUERY_KEY] });
      message.success("Продукт успішно оновлено!");
    },
    onError: (error) => {
      message.error(`Не вдалося оновити продукт: ${error.message}`);
    },
  });
};

export const useDeleteProduct = () => {
  const queryClient = useQueryClient();
  return useMutation<
    { message: string },
    Error,
    number // The id of the product to delete
  >({
    mutationFn: (id) => apiClient.products.delete(id),
    onSuccess: () => {
      // Invalidate all queries that start with PRODUCT_QUERY_KEY
      queryClient.invalidateQueries({ queryKey: [PRODUCT_QUERY_KEY] });
      message.success("Продукт успішно видалено!");
    },
    onError: (error) => {
      message.error(`Не вдалося видалити продукт: ${error.message}`);
    },
  });
};
