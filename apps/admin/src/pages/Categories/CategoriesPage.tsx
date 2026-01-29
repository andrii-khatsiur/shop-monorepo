import React, { useEffect, useState } from "react";
import { Table, Space, Button, message } from "antd";
import type { TableProps } from "antd";
import { apiClient } from "../../services/api";
import { useModal } from "../../context/ModalContext";

import type { Category } from "@shop-monorepo/types";
import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { StatusIndicator } from "../../components/StatusIndicator";
import { RightAlignedSpace } from "../../components/RightAlignedSpace";

import { CreateCategoryForm } from "./CreateCategoryForm";
import { EditCategoryForm } from "./EditCategoryForm";

interface DataType extends Category {}

export const CategoriesPage: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const { openModal } = useModal();

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

  const handleFormSuccess = () => {
    fetchCategories();
  };

  const showCreateCategoryModal = () => {
    openModal({
      title: "Додати категорію",
      content: <CreateCategoryForm onSuccess={handleFormSuccess} />,
      footer: null,
    });
  };

  const showEditCategoryModal = (category: Category) => {
    openModal({
      title: "Редагувати категорію",
      content: <EditCategoryForm category={category} onSuccess={handleFormSuccess} />,
      footer: null,
    });
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
            onClick={() => showEditCategoryModal(record)}
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
          onClick={showCreateCategoryModal}
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
    </div>
  );
};
