import React from "react";
import { BrandForm } from "./BrandForm";
import type { BrandInput } from "@shop-monorepo/types";
import { useModal } from "../../context/ModalContext";
import { useCreateBrand } from "../../hooks/useBrandQueries";

export const CreateBrandForm: React.FC = () => {
  const { closeModal } = useModal();
  const { mutate: createBrand, isPending: isSubmitting } = useCreateBrand();

  const handleSubmit = async (values: BrandInput) => {
    createBrand(values, {
      onSuccess: () => {
        closeModal();
      },
    });
  };

  return <BrandForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />;
};
