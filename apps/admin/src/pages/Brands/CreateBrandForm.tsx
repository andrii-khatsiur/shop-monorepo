import React, { useState } from "react";
import { message } from "antd";
import { BrandForm } from "./BrandForm";
import { apiClient } from "../../services/api";
import type { BrandInput } from "@shop-monorepo/types";
import { useModal } from "../../context/ModalContext";

interface CreateBrandFormProps {
  onSuccess: () => void;
}

export const CreateBrandForm: React.FC<CreateBrandFormProps> = ({
  onSuccess,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { closeModal } = useModal();

  const handleSubmit = async (values: BrandInput) => {
    setIsSubmitting(true);
    try {
      await apiClient.brands.create(values);
      message.success("Бренд успішно створено!");
      onSuccess();
      closeModal();
    } catch (error: any) {
      message.error(`Не вдалося створити бренд: ${error.message}`);
      console.error("Failed to create brand:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return <BrandForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />;
};
