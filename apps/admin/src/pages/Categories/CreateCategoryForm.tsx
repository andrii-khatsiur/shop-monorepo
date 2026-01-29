import React from "react";
import { CategoryForm } from "./CategoryForm";
import type { CategoryInput } from "@shop-monorepo/types";
import { useModal } from "../../context/ModalContext";
import { useCreateCategory } from "../../hooks/useCategoryQueries";

export const CreateCategoryForm: React.FC = () => {
  const { closeModal } = useModal();
  const { mutate: createCategory, isPending: isSubmitting } =
    useCreateCategory();

  const handleSubmit = async (values: CategoryInput) => {
    createCategory(values, {
      onSuccess: () => {
        closeModal();
      },
    });
  };

  return <CategoryForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />;
};
