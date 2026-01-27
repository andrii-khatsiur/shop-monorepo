import React, { useEffect, useState } from "react";
import { Table, Space, Button, message, Modal, Form, Input } from "antd";
import type { TableProps } from "antd";
import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../services/api";
import type { Category, CategoryInput } from "../services/api";
import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";

interface DataType extends Category {}

export const Categories: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [form] = Form.useForm();

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const data: Category[] = await getCategories();
      setCategories(data);
    } catch (error) {
      message.error("Failed to fetch categories.");
      console.error("Failed to fetch categories:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleAddCategory = () => {
    setEditingCategory(null);
    form.resetFields();
    setModalVisible(true);
  };

  const handleEditCategory = (category: Category) => {
    setEditingCategory(category);
    form.setFieldsValue(category);
    setModalVisible(true);
  };

  const handleDeleteCategory = async (id: number) => {
    try {
      await deleteCategory(id);
      message.success("Category deleted successfully!");
      fetchCategories();
    } catch (error: any) {
      message.error(`Failed to delete category: ${error.message}`);
      console.error("Failed to delete category:", error);
    }
  };

  const handleModalOk = async () => {
    try {
      const values: CategoryInput = await form.validateFields();
      if (editingCategory) {
        await updateCategory(editingCategory.id, values);
        message.success("Category updated successfully!");
      } else {
        await createCategory(values);
        message.success("Category created successfully!");
      }
      setModalVisible(false);
      fetchCategories();
    } catch (error: any) {
      message.error(`Failed to save category: ${error.message}`);
      console.error("Failed to save category:", error);
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
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          <Button
            icon={<EditOutlined />}
            onClick={() => handleEditCategory(record)}
          />
          <Button
            icon={<DeleteOutlined />}
            danger
            onClick={() => handleDeleteCategory(record.id)}
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
          onClick={handleAddCategory}
        >
          Add Category
        </Button>
      </Space>
      <Table
        columns={columns}
        dataSource={categories}
        rowKey="id"
        loading={loading}
        pagination={false}
      />

      <Modal
        title={editingCategory ? "Edit Category" : "Add Category"}
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
            rules={[{ required: true, message: "Please enter category name" }]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};
