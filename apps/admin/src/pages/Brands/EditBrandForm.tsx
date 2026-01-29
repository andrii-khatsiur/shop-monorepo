import React from "react";
import { BrandForm } from "./BrandForm";
import type { Brand, BrandInput } from "@shop-monorepo/types";
import { useModal } from "../../context/ModalContext";
import { useUpdateBrand } from "../../hooks/useBrandQueries";

interface EditBrandFormProps {
  brand: Brand;
}

export const EditBrandForm: React.FC<EditBrandFormProps> = ({ brand }) => {
  const { closeModal } = useModal();
  const { mutate: updateBrand, isPending: isSubmitting } = useUpdateBrand();

  const handleSubmit = async (values: BrandInput) => {
    updateBrand(
      { id: brand.id, brand: values },
      {
        onSuccess: () => {
          closeModal();
        },
      }
    );
  };

  return (
    <BrandForm
      initialValues={brand}
      onSubmit={handleSubmit}
      isSubmitting={isSubmitting}
    />
  );
};
