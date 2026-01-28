import React, { useEffect, useState } from "react";
import { Table, Space, Button, message, Modal, Form, Input, Switch } from "antd";
import type { TableProps } from "antd";
import { apiClient } from "../services/api";

import type { Category, CategoryInput } from "@shop-monorepo/types";
import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { StatusIndicator } from "../components/StatusIndicator";
import { RightAlignedSpace } from "../components/RightAlignedSpace";

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
      const data: Category[] = await apiClient.categories.all();
      setCategories(data);
    } catch (error) {
      message.error("Не вдалося завантажити категорії.");
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
    form.setFieldsValue({ isActive: true }); // Set default for new category
    setModalVisible(true);
  };

  const handleEditCategory = (category: Category) => {
    setEditingCategory(category);
    form.setFieldsValue(category);
    setModalVisible(true);
  };

  const handleDeleteCategory = async (id: number) => {
    try {
      await apiClient.categories.delete(id);
      message.success("Категорію успішно видалено!");
      fetchCategories();
    } catch (error: any) {
      message.error(`Не вдалося видалити категорію: ${error.message}`);
      console.error("Failed to delete category:", error);
    }
  };

  const handleModalOk = async () => {
    try {
      const values: CategoryInput = await form.validateFields();
      if (editingCategory) {
        await apiClient.categories.update(editingCategory.id, values);
        message.success("Категорію успішно оновлено!");
      } else {
        await apiClient.categories.create(values);
        message.success("Категорію успішно створено!");
      }
      setModalVisible(false);
      fetchCategories();
    } catch (error: any) {
      message.error(`Не вдалося зберегти категорію: ${error.message}`);
      console.error("Failed to save category:", error);
    }
  };

  const columns: TableProps<DataType>["columns"] = [
    {
      title: "Назва",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Статус",
      dataIndex: "isActive",
      key: "isActive",
      render: (isActive: boolean) => <StatusIndicator isActive={isActive} />,
    },
    {
      title: "Дія",
      key: "action",
      align: 'right', // Align header text to right
      render: (_, record) => (
        <RightAlignedSpace size="middle">
          <Button
            icon={<EditOutlined />}
            onClick={() => handleEditCategory(record)}
          />
          <Button
            icon={<DeleteOutlined />}
            danger
            onClick={() => handleDeleteCategory(record.id)}
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
          onClick={handleAddCategory}
        >
          Додати категорію
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
        title={editingCategory ? "Редагувати категорію" : "Додати категорію"}
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
            rules={[{ required: true, message: "Будь ласка, введіть назву категорії" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item name="isActive" label="Активний" valuePropName="checked">
            <Switch />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};
