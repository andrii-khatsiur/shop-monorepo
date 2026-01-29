import React, { useState } from "react";
import { message } from "antd";
import { CategoryForm } from "./CategoryForm";
import { apiClient } from "../../services/api";
import type { Category, CategoryInput } from "@shop-monorepo/types";
import { useModal } from "../../context/ModalContext";

interface EditCategoryFormProps {
  category: Category;
  onSuccess: () => void;
}

export const EditCategoryForm: React.FC<EditCategoryFormProps> = ({
  category,
  onSuccess,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { closeModal } = useModal();

  const handleSubmit = async (values: CategoryInput) => {
    setIsSubmitting(true);
    try {
      await apiClient.categories.update(category.id, values);
      message.success("Категорію успішно оновлено!");
      onSuccess();
      closeModal();
    } catch (error: any) {
      message.error(`Не вдалося оновити категорію: ${error.message}`);
      console.error("Failed to update category:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <CategoryForm
      initialValues={category}
      onSubmit={handleSubmit}
      isSubmitting={isSubmitting}
    />
  );
};
