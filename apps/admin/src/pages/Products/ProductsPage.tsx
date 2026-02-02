import React from "react";
import { Table, Button } from "antd";
import type { TableProps } from "antd";
import type { Product } from "@shop-monorepo/types";
import { useNavigate } from "react-router-dom";
import { useModal } from "../../context/ModalContext";

import { PlusOutlined, EyeOutlined } from "@ant-design/icons";
import { StatusIndicator } from "../../components/StatusIndicator";
import {
  PageContainer,
  Toolbar,
  TableContainer,
} from "../../components/PageLayout";
import { RightAlignedSpace } from "../../components/RightAlignedSpace";
import { DeleteButton } from "../../components/DeleteButton";
import { EditButton } from "../../components/EditButton";
import { BottomPagination } from "../../components/BottomPagination";

import { CreateProductForm } from "./CreateProductForm";
import { EditProductForm } from "./EditProductForm";
import { ProductFilters } from "./ProductFilters";

import { useProducts, useDeleteProduct } from "../../hooks/useProductQueries";
import { useBrands } from "../../hooks/useBrandQueries";
import { useCategories } from "../../hooks/useCategoryQueries";
import { usePagination } from "../../hooks/usePagination";
import { useProductFilters } from "../../hooks/useProductFilters";
import { useTableSorter } from "../../hooks/useTableSorter";
import { ROUTES } from "../../routes/routes";
import { formatPrice } from "../../utils/currency";
import { formatCategoryName } from "../../utils/categoryUtils";

export const ProductsPage: React.FC = () => {
  const { openModal } = useModal();
  const navigate = useNavigate();
  const { page, pageSize } = usePagination();

  const { data: brands = [] } = useBrands();
  const { data: categories = [] } = useCategories();

  const {
    filters,
    brandFilter,
    selectedCategoryId,
    setBrandFilter,
    setCategoryFilter,
  } = useProductFilters(categories);

  const { sorter, handleTableChange } = useTableSorter();

  const { data: paginatedProducts, isLoading } = useProducts({
    page,
    limit: pageSize,
    filters,
    sorter,
  });
  const products = paginatedProducts?.hits || [];
  const totalProducts = paginatedProducts?.total || 0;

  const { mutate: deleteProduct } = useDeleteProduct();

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
  const handleViewProduct = (slug: string) => {
    navigate(ROUTES.PRODUCT_VIEW.replace(":slug", slug));
  };

  const columns: TableProps<Product>["columns"] = [
    {
      title: "Назва",
      dataIndex: "name",
      key: "name",
      sorter: true,
      render: (name: string, record: Product) => (
        <Button
          type="link"
          onClick={() => handleViewProduct(record.slug)}
          style={{ padding: 0 }}
        >
          {name}
        </Button>
      ),
    },
    {
      title: "Ціна",
      dataIndex: "price",
      key: "price",
      render: (price: number) => formatPrice(price),
      sorter: true,
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
          .map((id) => formatCategoryName(categories, id))
          .filter(Boolean)
          .join(", ") || "Немає",
    },
    {
      title: "Активний",
      dataIndex: "isActive",
      key: "isActive",
      sorter: true,
      render: (isActive: boolean) => <StatusIndicator isActive={isActive} />,
    },
    {
      title: "Новий",
      dataIndex: "isNew",
      key: "isNew",
      sorter: true,
      render: (isNew: boolean) => <StatusIndicator isActive={isNew} />,
    },
    {
      title: "Дія",
      key: "action",
      align: "right", // Align header text to right
      render: (_, record) => (
        <RightAlignedSpace size="middle">
          <Button
            icon={<EyeOutlined />}
            onClick={() => handleViewProduct(record.slug)}
          />
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
        <ProductFilters
          brands={brands}
          categories={categories}
          brandFilter={brandFilter}
          selectedCategoryId={selectedCategoryId}
          onBrandChange={setBrandFilter}
          onCategoryChange={setCategoryFilter}
        />
      </Toolbar>
      <TableContainer>
        <Table
          columns={columns}
          dataSource={products}
          rowKey="id"
          loading={isLoading}
          pagination={false}
          onChange={handleTableChange}
        />
      </TableContainer>
      <BottomPagination total={totalProducts} />
    </PageContainer>
  );
};
