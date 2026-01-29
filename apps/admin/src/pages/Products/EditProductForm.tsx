import React from "react";
import { ProductForm } from "./ProductForm";
import type {
  Product,
  ProductInput,
  Brand,
  Category,
} from "@shop-monorepo/types";
import { useModal } from "../../context/ModalContext";
import { useUpdateProduct } from "../../hooks/useProductQueries";

interface EditProductFormProps {
  product: Product;
}

export const EditProductForm: React.FC<EditProductFormProps> = ({
  product,
}) => {
  const { closeModal } = useModal();
  const { mutate: updateProduct, isPending: isSubmitting } = useUpdateProduct();

  const handleSubmit = async (values: ProductInput) => {
    updateProduct(
      { id: product.id, product: values },
      {
        onSuccess: () => {
          closeModal();
        },
      }
    );
  };

  return (
    <ProductForm
      initialValues={{
        ...product,
        oldPrice: product.oldPrice === null ? undefined : product.oldPrice,
        brandId: product.brandId === null ? undefined : product.brandId,
        categoryIds: product.categoryIds,
      }}
      onSubmit={handleSubmit}
      isSubmitting={isSubmitting}
    />
  );
};
