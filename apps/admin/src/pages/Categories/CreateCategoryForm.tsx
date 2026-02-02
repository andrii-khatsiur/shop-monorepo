import React from "react";
import { CategoryForm } from "./CategoryForm";
import type { Category, CategoryInput } from "@shop-monorepo/types";
import { useModal } from "../../context/ModalContext";
import { useCreateCategory } from "../../hooks/useCategoryQueries";

interface CreateCategoryFormProps {
  defaultParentId?: number;
  parentCategories: Category[];
}

export const CreateCategoryForm: React.FC<CreateCategoryFormProps> = ({
  defaultParentId,
  parentCategories,
}) => {
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

  return (
    <CategoryForm
      initialValues={{ isActive: true, parentId: defaultParentId ?? null }}
      onSubmit={handleSubmit}
      isSubmitting={isSubmitting}
      parentCategories={parentCategories}
    />
  );
};
