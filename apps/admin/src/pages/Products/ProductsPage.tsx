import React from "react";
import { Table, Button } from "antd";
import type { TableProps } from "antd";
import type { Product } from "@shop-monorepo/types";
import { useModal } from "../../context/ModalContext";

import { PlusOutlined } from "@ant-design/icons";
import { StatusIndicator } from "../../components/StatusIndicator";
import { PageContainer, Toolbar, TableContainer } from "../../components/PageLayout";
import { RightAlignedSpace } from "../../components/RightAlignedSpace";
import { DeleteButton } from "../../components/DeleteButton";
import { EditButton } from "../../components/EditButton";
import { BottomPagination } from "../../components/BottomPagination";

import { CreateProductForm } from "./CreateProductForm";
import { EditProductForm } from "./EditProductForm";

import { useProducts, useDeleteProduct } from "../../hooks/useProductQueries";
import { useBrands } from "../../hooks/useBrandQueries";
import { useCategories } from "../../hooks/useCategoryQueries";
import { usePagination } from "../../hooks/usePagination";

export const ProductsPage: React.FC = () => {
  const { openModal } = useModal();
  const { page, pageSize } = usePagination();

  const { data: paginatedProducts, isLoading } = useProducts({
    page,
    limit: pageSize,
  });
  const products = paginatedProducts?.hits || [];
  const totalProducts = paginatedProducts?.total || 0;

  const { mutate: deleteProduct } = useDeleteProduct();

  const { data: brands = [] } = useBrands();
  const { data: categories = [] } = useCategories();

  const showCreateProductModal = () => {
    openModal({
      title: "Додати продукт",
      content: <CreateProductForm />,
      footer: null,
    });
  };
  const showEditProductModal = (product: Product) => {
    openModal({
      title: "Редагувати продукт",
      content: <EditProductForm product={product} />,
      footer: null,
    });
  };
  const columns: TableProps<Product>["columns"] = [
    {
      title: "Назва",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Ціна",
      dataIndex: "price",
      key: "price",
    },
    {
      title: "Бренд",
      dataIndex: "brandId",
      key: "brandId",
      render: (brandId: number) =>
        brands.find((brand) => brand.id === brandId)?.name || "Немає",
    },
    {
      title: "Категорії",
      dataIndex: "categoryIds",
      key: "categoryIds",
      render: (categoryIds: number[]) =>
        categoryIds
          .map((id) => categories.find((cat) => cat.id === id)?.name)
          .filter(Boolean)
          .join(", ") || "Немає",
    },
    {
      title: "Активний",
      dataIndex: "isActive",
      key: "isActive",
      render: (isActive: boolean) => <StatusIndicator isActive={isActive} />,
    },
    {
      title: "Новий",
      dataIndex: "isNew",
      key: "isNew",
      render: (isNew: boolean) => <StatusIndicator isActive={isNew} />,
    },
    {
      title: "Дія",
      key: "action",
      align: "right", // Align header text to right
      render: (_, record) => (
        <RightAlignedSpace size="middle">
          <EditButton onClick={() => showEditProductModal(record)} />
          <DeleteButton
            onConfirm={() => deleteProduct(record.id)}
            entityName={record.name}
          />
        </RightAlignedSpace>
      ),
    },
  ];

  return (
    <PageContainer>
      <Toolbar>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={showCreateProductModal}
        >
          Додати продукт
        </Button>
      </Toolbar>
      <TableContainer>
        <Table
          columns={columns}
          dataSource={products}
          rowKey="id"
          loading={isLoading}
          pagination={false}
        />
      </TableContainer>
      <BottomPagination total={totalProducts} />
    </PageContainer>
  );
};
