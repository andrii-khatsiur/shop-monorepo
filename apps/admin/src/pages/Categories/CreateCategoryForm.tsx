import React, { useState } from "react";
import { message } from "antd";
import { CategoryForm } from "./CategoryForm";
import { apiClient } from "../../services/api";
import type { CategoryInput } from "@shop-monorepo/types";
import { useModal } from "../../context/ModalContext";

interface CreateCategoryFormProps {
  onSuccess: () => void;
}

export const CreateCategoryForm: React.FC<CreateCategoryFormProps> = ({
  onSuccess,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { closeModal } = useModal();

  const handleSubmit = async (values: CategoryInput) => {
    setIsSubmitting(true);
    try {
      await apiClient.categories.create(values);
      message.success("Категорію успішно створено!");
      onSuccess();
      closeModal();
    } catch (error: any) {
      message.error(`Не вдалося створити категорію: ${error.message}`);
      console.error("Failed to create category:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return <CategoryForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />;
};
