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

const API_BASE_URL = "http://localhost:3000/api";

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
      filters?: { brand?: string; category?: string }
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
      const response: AxiosResponse<PaginatedProducts> = await axiosClient.get(
        "/products",
        { params }
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
    all: async (): Promise<Brand[]> => {
      const response: AxiosResponse<Brand[]> = await axiosClient.get("/brands");
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
    all: async (): Promise<Category[]> => {
      const response: AxiosResponse<Category[]> = await axiosClient.get(
        "/categories"
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
};
