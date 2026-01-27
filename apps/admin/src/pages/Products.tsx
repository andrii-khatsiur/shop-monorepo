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
} from "../services/api";

import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";

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
      message.error("Failed to fetch products.");
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
      message.error("Failed to fetch brands or categories.");
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
      message.success("Product deleted successfully!");
      fetchProducts(pagination.current, pagination.pageSize);
    } catch (error: any) {
      message.error(`Failed to delete product: ${error.message}`);
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
        message.success("Product updated successfully!");
      } else {
        await createProduct(values);
        message.success("Product created successfully!");
      }
      setModalVisible(false);
      fetchProducts(pagination.current, pagination.pageSize);
    } catch (error: any) {
      message.error(`Failed to save product: ${error.message}`);
      console.error("Failed to save product:", error);
    }
  };

  const columns: TableProps<DataType>["columns"] = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Slug",
      dataIndex: "slug",
      key: "slug",
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
    },
    {
      title: "Brand",
      dataIndex: "brandId",
      key: "brandId",
      render: (brandId: number) =>
        brands.find((brand) => brand.id === brandId)?.name || "N/A",
    },
    {
      title: "Active",
      dataIndex: "isActive",
      key: "isActive",
      render: (isActive: boolean) => (isActive ? "Yes" : "No"),
    },
    {
      title: "New",
      dataIndex: "isNew",
      key: "isNew",
      render: (isNew: boolean) => (isNew ? "Yes" : "No"),
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          <Button
            icon={<EditOutlined />}
            onClick={() => handleEditProduct(record)}
          />
          <Button
            icon={<DeleteOutlined />}
            danger
            onClick={() => handleDeleteProduct(record.id)}
          />
        </Space>
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
          Add Product
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
        title={editingProduct ? "Edit Product" : "Add Product"}
        open={modalVisible}
        onOk={handleModalOk}
        onCancel={() => setModalVisible(false)}
        okText="Save"
        cancelText="Cancel"
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="name"
            label="Name"
            rules={[{ required: true, message: "Please enter product name" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="description"
            label="Description"
            rules={[
              { required: true, message: "Please enter product description" },
            ]}
          >
            <Input.TextArea />
          </Form.Item>
          <Form.Item
            name="image"
            label="Image URL"
            rules={[{ required: true, message: "Please enter image URL" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="price"
            label="Price"
            rules={[{ required: true, message: "Please enter product price" }]}
          >
            <InputNumber min={0} style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item name="oldPrice" label="Old Price">
            <InputNumber min={0} style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item name="brandId" label="Brand">
            <Select
              placeholder="Select a brand"
              allowClear
              options={brands.map((brand) => ({
                label: brand.name,
                value: brand.id,
              }))}
            />
          </Form.Item>
          <Form.Item name="categoryIds" label="Categories">
            <Select
              mode="multiple"
              placeholder="Select categories"
              allowClear
              options={categories.map((category) => ({
                label: category.name,
                value: category.id,
              }))}
            />
          </Form.Item>
          <Form.Item name="isActive" label="Active" valuePropName="checked">
            <Switch />
          </Form.Item>
          <Form.Item name="isNew" label="New" valuePropName="checked">
            <Switch />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};
