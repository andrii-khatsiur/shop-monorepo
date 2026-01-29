import React from "react";
import { ProductForm } from "./ProductForm";
import type { ProductInput } from "@shop-monorepo/types";
import { useModal } from "../../context/ModalContext";
import { useCreateProduct } from "../../hooks/useProductQueries";

export const CreateProductForm: React.FC = () => {
  const { closeModal } = useModal();
  const { mutate: createProduct, isPending: isSubmitting } = useCreateProduct();

  const handleSubmit = async (values: ProductInput) => {
    createProduct(values, {
      onSuccess: () => {
        closeModal();
      },
    });
  };

  return <ProductForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />;
};
