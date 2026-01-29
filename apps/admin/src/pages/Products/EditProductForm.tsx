import React, { useState } from "react";
import { message } from "antd";
import { ProductForm } from "./ProductForm";
import { apiClient } from "../../services/api";
import type { Product, ProductInput, Brand, Category } from "@shop-monorepo/types";
import { useModal } from "../../context/ModalContext";

interface EditProductFormProps {
  product: Product;
  onSuccess: () => void;
  brands: Brand[];
  categories: Category[];
}

export const EditProductForm: React.FC<EditProductFormProps> = ({
  product,
  onSuccess,
  brands,
  categories,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { closeModal } = useModal();

  const handleSubmit = async (values: ProductInput) => {
    setIsSubmitting(true);
    try {
      await apiClient.products.update(product.id, values);
      message.success("Продукт успішно оновлено!");
      onSuccess();
      closeModal();
    } catch (error: any) {
      message.error(`Не вдалося оновити продукт: ${error.message}`);
      console.error("Failed to update product:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ProductForm
      initialValues={{
        ...product,
        oldPrice: product.oldPrice === null ? undefined : product.oldPrice,
        brandId: product.brandId === null ? undefined : product.brandId,
        categoryIds: product.categoryIds,
      }}
      onSubmit={handleSubmit}
      isSubmitting={isSubmitting}
      brands={brands}
      categories={categories}
    />
  );
};
