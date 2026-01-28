import React, { useEffect, useState } from "react";
import {
  Table,
  Space,
  Button,
  message,
  Modal,
  Form,
  Input,
  InputNumber,
  Switch,
  Select,
} from "antd";
import type { TableProps } from "antd";
import {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getBrands,
  getCategories,
} from "../services/api";
import type {
  Product,
  PaginatedProducts,
  ProductInput,
  Brand,
  Category,
} from "@shop-monorepo/types";

import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { StatusIndicator } from "@/components/StatusIndicator";
import { RightAlignedSpace } from "../components/RightAlignedSpace";

interface DataType extends Product {}

export const Products: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [form] = Form.useForm();

  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  const fetchProducts = async (page: number, limit: number) => {
    setLoading(true);
    try {
      const data: PaginatedProducts = await getProducts(page, limit);
      setProducts(data.hits);
      setPagination((prev) => ({
        ...prev,
        total: data.total,
        current: page,
        pageSize: limit,
      }));
    } catch (error) {
      message.error("Не вдалося завантажити продукти.");
      console.error("Failed to fetch products:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchBrandsAndCategories = async () => {
    try {
      const [brandsData, categoriesData] = await Promise.all([
        getBrands(),
        getCategories(),
      ]);
      setBrands(brandsData);
      setCategories(categoriesData);
    } catch (error) {
      message.error("Не вдалося завантажити бренди або категорії.");
      console.error("Failed to fetch brands or categories:", error);
    }
  };

  useEffect(() => {
    fetchProducts(pagination.current, pagination.pageSize);
    fetchBrandsAndCategories();
  }, [pagination.current, pagination.pageSize]);

  const handleTableChange = (newPagination: any) => {
    setPagination((prev) => ({
      ...prev,
      current: newPagination.current,
      pageSize: newPagination.pageSize,
    }));
  };

  const handleAddProduct = () => {
    setEditingProduct(null);
    form.resetFields();
    setModalVisible(true);
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    form.setFieldsValue({
      ...product,
      oldPrice: product.oldPrice === null ? undefined : product.oldPrice,
      brandId: product.brandId === null ? undefined : product.brandId,
      categoryIds: product.categoryIds,
    });
    setModalVisible(true);
  };

  const handleDeleteProduct = async (id: number) => {
    try {
      await deleteProduct(id);
      message.success("Продукт успішно видалено!");
      fetchProducts(pagination.current, pagination.pageSize);
    } catch (error: any) {
      message.error(`Не вдалося видалити продукт: ${error.message}`);
      console.error("Failed to delete product:", error);
    }
  };

  const handleModalOk = async () => {
    try {
      const values: ProductInput = await form.validateFields();
      values.oldPrice = values.oldPrice === undefined ? null : values.oldPrice;
      values.brandId = values.brandId === undefined ? null : values.brandId;
      values.isActive = values.isActive ?? false;
      values.isNew = values.isNew ?? false;

      if (editingProduct) {
        await updateProduct(editingProduct.id, values);
        message.success("Продукт успішно оновлено!");
      } else {
        await createProduct(values);
        message.success("Продукт успішно створено!");
      }
      setModalVisible(false);
      fetchProducts(pagination.current, pagination.pageSize);
    } catch (error: any) {
      message.error(`Не вдалося зберегти продукт: ${error.message}`);
      console.error("Failed to save product:", error);
    }
  };

  const columns: TableProps<DataType>["columns"] = [
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
      align: 'right', // Align header text to right
      render: (_, record) => (
        <RightAlignedSpace size="middle">
          <Button
            icon={<EditOutlined />}
            onClick={() => handleEditProduct(record)}
          />
          <Button
            icon={<DeleteOutlined />}
            danger
            onClick={() => handleDeleteProduct(record.id)}
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
          onClick={handleAddProduct}
        >
          Додати продукт
        </Button>
      </Space>
      <Table
        columns={columns}
        dataSource={products}
        rowKey="id"
        loading={loading}
        pagination={{
          current: pagination.current,
          pageSize: pagination.pageSize,
          total: pagination.total,
          showSizeChanger: true,
        }}
        onChange={handleTableChange}
      />

      <Modal
        title={editingProduct ? "Редагувати продукт" : "Додати продукт"}
        open={modalVisible}
        onOk={handleModalOk}
        onCancel={() => setModalVisible(false)}
        okText="Зберегти"
        cancelText="Скасувати"
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="name"
            label="Назва"
            rules={[{ required: true, message: "Будь ласка, введіть назву продукту" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="description"
            label="Опис"
            rules={[
              { required: true, message: "Будь ласка, введіть опис продукту" },
            ]}
          >
            <Input.TextArea />
          </Form.Item>
          <Form.Item
            name="image"
            label="URL зображення"
            rules={[{ required: true, message: "Будь ласка, введіть URL зображення" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="price"
            label="Ціна"
            rules={[{ required: true, message: "Будь ласка, введіть ціну продукту" }]}
          >
            <InputNumber min={0} style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item name="oldPrice" label="Стара ціна">
            <InputNumber min={0} style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item name="brandId" label="Бренд">
            <Select
              placeholder="Виберіть бренд"
              allowClear
              options={brands.map((brand) => ({
                label: brand.name,
                value: brand.id,
              }))}
            />
          </Form.Item>
          <Form.Item name="categoryIds" label="Категорії">
            <Select
              mode="multiple"
              placeholder="Виберіть категорії"
              allowClear
              options={categories.map((category) => ({
                label: category.name,
                value: category.id,
              }))}
            />
          </Form.Item>
          <Form.Item name="isActive" label="Активний" valuePropName="checked">
            <Switch />
          </Form.Item>
          <Form.Item name="isNew" label="Новий" valuePropName="checked">
            <Switch />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};
