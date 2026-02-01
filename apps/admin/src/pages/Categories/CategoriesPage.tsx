import { Table, Space, Button } from "antd";
import type { TableProps } from "antd";

import { useModal } from "../../context/ModalContext";
import {
  useCategories,
  useDeleteCategory,
} from "../../hooks/useCategoryQueries";

import type { Category } from "@shop-monorepo/types";
import { PlusOutlined } from "@ant-design/icons";
import { StatusIndicator } from "../../components/StatusIndicator";
import { RightAlignedSpace } from "../../components/RightAlignedSpace";
import { DeleteButton } from "../../components/DeleteButton";
import { EditButton } from "../../components/EditButton";

import { CreateCategoryForm } from "./CreateCategoryForm";
import { EditCategoryForm } from "./EditCategoryForm";

export const CategoriesPage: React.FC = () => {
  const { openModal } = useModal();
  const { data: categories, isLoading } = useCategories();
  const { mutate: deleteCategory } = useDeleteCategory();

  const showCreateCategoryModal = () => {
    openModal({
      title: "Додати категорію",
      content: <CreateCategoryForm />,
      footer: null,
    });
  };

  const showEditCategoryModal = (category: Category) => {
    openModal({
      title: "Редагувати категорію",
      content: <EditCategoryForm category={category} />,
      footer: null,
    });
  };

  const columns: TableProps<Category>["columns"] = [
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
      align: "right", // Align header text to right
      render: (_, record) => (
        <RightAlignedSpace size="middle">
          <EditButton onClick={() => showEditCategoryModal(record)} />
          <DeleteButton
            onConfirm={() => deleteCategory(record.id)}
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
          onClick={showCreateCategoryModal}
        >
          Додати категорію
        </Button>
      </Space>
      <Table
        columns={columns}
        dataSource={categories || []}
        rowKey="id"
        loading={isLoading}
        pagination={false}
      />
    </div>
  );
};
