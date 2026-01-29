import React from "react";
import { CategoryForm } from "./CategoryForm";
import type { Category, CategoryInput } from "@shop-monorepo/types";
import { useModal } from "../../context/ModalContext";
import { useUpdateCategory } from "../../hooks/useCategoryQueries";

interface EditCategoryFormProps {
  category: Category;
}

export const EditCategoryForm: React.FC<EditCategoryFormProps> = ({
  category,
}) => {
  const { closeModal } = useModal();
  const { mutate: updateCategory, isPending: isSubmitting } =
    useUpdateCategory();

  const handleSubmit = async (values: CategoryInput) => {
    updateCategory(
      { id: category.id, category: values },
      {
        onSuccess: () => {
          closeModal();
        },
      }
    );
  };

  return (
    <CategoryForm
      initialValues={category}
      onSubmit={handleSubmit}
      isSubmitting={isSubmitting}
    />
  );
};
