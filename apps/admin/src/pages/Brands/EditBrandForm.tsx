import React, { useState } from "react";
import { message } from "antd";
import { BrandForm } from "./BrandForm";
import { apiClient } from "../../services/api";
import type { Brand, BrandInput } from "@shop-monorepo/types";
import { useModal } from "../../context/ModalContext";

interface EditBrandFormProps {
  brand: Brand;
  onSuccess: () => void;
}

export const EditBrandForm: React.FC<EditBrandFormProps> = ({
  brand,
  onSuccess,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { closeModal } = useModal();

  const handleSubmit = async (values: BrandInput) => {
    setIsSubmitting(true);
    try {
      await apiClient.brands.update(brand.id, values);
      message.success("Бренд успішно оновлено!");
      onSuccess();
      closeModal();
    } catch (error: any) {
      message.error(`Не вдалося оновити бренд: ${error.message}`);
      console.error("Failed to update brand:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <BrandForm
      initialValues={brand}
      onSubmit={handleSubmit}
      isSubmitting={isSubmitting}
    />
  );
};
