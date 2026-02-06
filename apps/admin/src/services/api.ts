import axios from "axios";
import type { AxiosInstance, AxiosResponse } from "axios";
import type {
  Brand,
  Category,
  Product,
  PaginatedProducts,
  ProductInput,
  BrandInput,
  CategoryInput,
} from "@shop-monorepo/types";

import { getAuthToken } from "./auth";
import { API_BASE_URL } from "@/constants/env";

// Class to manage the Axios instance and its interceptors
class AxiosClient {
  public readonly instance: AxiosInstance;

  constructor() {
    this.instance = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        "Content-Type": "application/json",
      },
    });

    this.instance.interceptors.request.use((config) => {
      const token = getAuthToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });

    this.instance.interceptors.response.use(
      (response) => response,
      (error) => {
        if (
          error.response &&
          error.response.data &&
          error.response.data.error
        ) {
          return Promise.reject(new Error(error.response.data.error));
        }
        return Promise.reject(error);
      }
    );
  }
}

const axiosClient = new AxiosClient().instance;

// API client object with structured methods
export const apiClient = {
  products: {
    all: async (
      page: number = 1,
      limit: number = 10,
      filters?: {
        brand?: string;
        category?: string;
        isActive?: boolean;
        isNew?: boolean;
      },
      sorter?: { field?: string; direction?: "asc" | "desc" }
    ): Promise<PaginatedProducts> => {
      const params = new URLSearchParams();
      params.append("page", page.toString());
      params.append("limit", limit.toString());
      if (filters?.brand) {
        params.append("brand", filters.brand);
      }
      if (filters?.category) {
        params.append("category", filters.category);
      }
      if (filters?.isActive !== undefined) {
        params.append("isActive", String(filters.isActive));
      }
      if (filters?.isNew !== undefined) {
        params.append("isNew", String(filters.isNew));
      }
      if (sorter?.field) {
        params.append("sortBy", sorter.field);
        if (sorter.direction) {
          params.append("sortDir", sorter.direction);
        }
      }
      const response: AxiosResponse<PaginatedProducts> = await axiosClient.get(
        "/products",
        { params }
      );
      return response.data;
    },
    getBySlug: async (slug: string): Promise<Product> => {
      const response: AxiosResponse<Product> = await axiosClient.get(
        `/products/${slug}`
      );
      return response.data;
    },
    create: async (product: ProductInput): Promise<Product> => {
      const response: AxiosResponse<Product> = await axiosClient.post(
        "/products",
        product
      );
      return response.data;
    },
    update: async (id: number, product: ProductInput): Promise<Product> => {
      const response: AxiosResponse<Product> = await axiosClient.put(
        `/products/${id}`,
        product
      );
      return response.data;
    },
    delete: async (id: number): Promise<{ message: string }> => {
      const response: AxiosResponse<{ message: string }> =
        await axiosClient.delete(`/products/${id}`);
      return response.data;
    },
  },

  brands: {
    all: async (
      sorter?: { field?: string; direction?: "asc" | "desc" },
      filters?: { isActive?: boolean }
    ): Promise<Brand[]> => {
      const params = new URLSearchParams();
      if (sorter?.field) {
        params.append("sortBy", sorter.field);
        if (sorter.direction) {
          params.append("sortDir", sorter.direction);
        }
      }
      if (filters?.isActive !== undefined) {
        params.append("isActive", String(filters.isActive));
      }
      const response: AxiosResponse<Brand[]> = await axiosClient.get(
        "/brands",
        { params }
      );
      return response.data;
    },
    create: async (brand: BrandInput): Promise<Brand> => {
      const response: AxiosResponse<Brand> = await axiosClient.post(
        "/brands",
        brand
      );
      return response.data;
    },
    update: async (id: number, brand: BrandInput): Promise<Brand> => {
      const response: AxiosResponse<Brand> = await axiosClient.put(
        `/brands/${id}`,
        brand
      );
      return response.data;
    },
    delete: async (id: number): Promise<{ message: string }> => {
      const response: AxiosResponse<{ message: string }> =
        await axiosClient.delete(`/brands/${id}`);
      return response.data;
    },
  },

  categories: {
    all: async (
      sorter?: { field?: string; direction?: "asc" | "desc" },
      filters?: { isActive?: boolean }
    ): Promise<Category[]> => {
      const params = new URLSearchParams();
      if (sorter?.field) {
        params.append("sortBy", sorter.field);
        if (sorter.direction) {
          params.append("sortDir", sorter.direction);
        }
      }
      if (filters?.isActive !== undefined) {
        params.append("isActive", String(filters.isActive));
      }
      const response: AxiosResponse<Category[]> = await axiosClient.get(
        "/categories",
        { params }
      );
      return response.data;
    },
    create: async (category: CategoryInput): Promise<Category> => {
      const response: AxiosResponse<Category> = await axiosClient.post(
        "/categories",
        category
      );
      return response.data;
    },
    update: async (id: number, category: CategoryInput): Promise<Category> => {
      const response: AxiosResponse<Category> = await axiosClient.put(
        `/categories/${id}`,
        category
      );
      return response.data;
    },
    delete: async (id: number): Promise<{ message: string }> => {
      const response: AxiosResponse<{ message: string }> =
        await axiosClient.delete(`/categories/${id}`);
      return response.data;
    },
  },

  upload: {
    file: async (file: File): Promise<{ url: string }> => {
      const formData = new FormData();
      formData.append("file", file);
      const response: AxiosResponse<{ url: string }> = await axiosClient.post(
        "/upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return response.data;
    },
    delete: async (url: string): Promise<{ success: boolean }> => {
      const response: AxiosResponse<{ success: boolean }> =
        await axiosClient.delete("/upload", { data: { url } });
      return response.data;
    },
  },
};
