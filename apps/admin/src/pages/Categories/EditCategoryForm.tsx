import React from "react";
import { CategoryForm } from "./CategoryForm";
import type { Category, CategoryInput } from "@shop-monorepo/types";
import { useModal } from "../../context/ModalContext";
import { useUpdateCategory } from "../../hooks/useCategoryQueries";

interface EditCategoryFormProps {
  category: Category;
  parentCategories: Category[];
  hasChildren: boolean;
}

export const EditCategoryForm: React.FC<EditCategoryFormProps> = ({
  category,
  parentCategories,
  hasChildren,
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

  // Disable parent select if category is a root with children
  const disableParentSelect = hasChildren && category.parentId === null;

  return (
    <CategoryForm
      initialValues={category}
      onSubmit={handleSubmit}
      isSubmitting={isSubmitting}
      parentCategories={parentCategories}
      disableParentSelect={disableParentSelect}
    />
  );
};
