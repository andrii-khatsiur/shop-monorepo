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

// API service functions
async function request<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const headers: Record<string, string> = {
    ...(options?.headers as Record<string, string>),
  };

  const token = getAuthToken();
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });
  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({}));
    throw new Error(
      errorBody.error || `API request failed: ${response.statusText}`
    );
  }
  return response.json();
}

export const getProducts = (
  page: number = 1,
  limit: number = 10,
  filters?: { brand?: string; category?: string }
): Promise<PaginatedProducts> => {
  const query = new URLSearchParams();
  query.append("page", page.toString());
  query.append("limit", limit.toString());
  if (filters?.brand) {
    query.append("brand", filters.brand);
  }
  if (filters?.category) {
    query.append("category", filters.category);
  }
  return request(`/products?${query.toString()}`);
};

export const createProduct = (product: ProductInput): Promise<Product> => {
  return request("/products", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(product),
  });
};

export const updateProduct = (
  id: number,
  product: ProductInput
): Promise<Product> => {
  return request(`/products/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(product),
  });
};

export const deleteProduct = (id: number): Promise<{ message: string }> => {
  return request(`/products/${id}`, {
    method: "DELETE",
  });
};

export const getBrands = (): Promise<Brand[]> => {
  return request("/brands");
};

export const createBrand = (brand: BrandInput): Promise<Brand> => {
  return request("/brands", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(brand),
  });
};

export const updateBrand = (id: number, brand: BrandInput): Promise<Brand> => {
  return request(`/brands/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(brand),
  });
};

export const deleteBrand = (id: number): Promise<{ message: string }> => {
  return request(`/brands/${id}`, {
    method: "DELETE",
  });
};

export const getCategories = (): Promise<Category[]> => {
  return request("/categories");
};

export const createCategory = (category: CategoryInput): Promise<Category> => {
  return request("/categories", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(category),
  });
};

export const updateCategory = (
  id: number,
  category: CategoryInput
): Promise<Category> => {
  return request(`/categories/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(category),
  });
};

export const deleteCategory = (id: number): Promise<{ message: string }> => {
  return request(`/categories/${id}`, {
    method: "DELETE",
  });
};
