import React, { useState } from "react";
import { message } from "antd";
import { ProductForm } from "./ProductForm";
import { apiClient } from "../../services/api";
import type { ProductInput, Brand, Category } from "@shop-monorepo/types";
import { useModal } from "../../context/ModalContext";

interface CreateProductFormProps {
  onSuccess: () => void;
  brands: Brand[];
  categories: Category[];
}

export const CreateProductForm: React.FC<CreateProductFormProps> = ({
  onSuccess,
  brands,
  categories,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { closeModal } = useModal();

  const handleSubmit = async (values: ProductInput) => {
    setIsSubmitting(true);
    try {
      await apiClient.products.create(values);
      message.success("Продукт успішно створено!");
      onSuccess();
      closeModal();
    } catch (error: any) {
      message.error(`Не вдалося створити продукт: ${error.message}`);
      console.error("Failed to create product:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ProductForm
      onSubmit={handleSubmit}
      isSubmitting={isSubmitting}
      brands={brands}
      categories={categories}
    />
  );
};
