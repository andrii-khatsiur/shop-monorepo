import React, { useState } from "react";
import { Table, Space, Button } from "antd";
import type { TableProps } from "antd";
import type { Product } from "@shop-monorepo/types";
import { useModal } from "../../context/ModalContext";

import { PlusOutlined } from "@ant-design/icons";
import { StatusIndicator } from "../../components/StatusIndicator";
import { RightAlignedSpace } from "../../components/RightAlignedSpace";
import { DeleteButton } from "../../components/DeleteButton";
import { EditButton } from "../../components/EditButton";

import { CreateProductForm } from "./CreateProductForm";
import { EditProductForm } from "./EditProductForm";

import { useProducts, useDeleteProduct } from "../../hooks/useProductQueries";
import { useBrands } from "../../hooks/useBrandQueries";
import { useCategories } from "../../hooks/useCategoryQueries";

export const ProductsPage: React.FC = () => {
  const { openModal } = useModal();

  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
  });

  const { data: paginatedProducts, isLoading } = useProducts({
    page: pagination.current,
    limit: pagination.pageSize,
  });
  const products = paginatedProducts?.hits || [];
  const totalProducts = paginatedProducts?.total || 0;

  const { mutate: deleteProduct } = useDeleteProduct();

  const { data: brands = [] } = useBrands();
  const { data: categories = [] } = useCategories();

  const handleTableChange = (newPagination: any) => {
    setPagination((prev) => ({
      ...prev,
      current: newPagination.current,
      pageSize: newPagination.pageSize,
    }));
  };

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
    <div>
      <Space style={{ marginBottom: 16 }}>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={showCreateProductModal}
        >
          Додати продукт
        </Button>
      </Space>
      <Table
        columns={columns}
        dataSource={products}
        rowKey="id"
        loading={isLoading}
        pagination={{
          current: pagination.current,
          pageSize: pagination.pageSize,
          total: totalProducts,
          showSizeChanger: true,
        }}
        onChange={handleTableChange}
      />
    </div>
  );
};
