import { useMemo } from "react";
import { Table, Button, Space } from "antd";
import type { TableProps } from "antd";

import { useModal } from "../../context/ModalContext";
import {
  useCategories,
  useDeleteCategory,
} from "../../hooks/useCategoryQueries";
import { useTableSorter } from "../../hooks/useTableSorter";
import { useBooleanParams } from "../../hooks/useUrlParam";

import type { Category } from "@shop-monorepo/types";
import { PlusOutlined } from "@ant-design/icons";
import { StatusIndicator } from "../../components/StatusIndicator";
import { RightAlignedSpace } from "../../components/RightAlignedSpace";
import { DeleteButton } from "../../components/DeleteButton";
import { EditButton } from "../../components/EditButton";
import { BooleanSelectFilter } from "../../components/BooleanSelectFilter";
import {
  PageContainer,
  Toolbar,
  TableContainer,
} from "../../components/PageLayout";

import { CreateCategoryForm } from "./CreateCategoryForm";
import { EditCategoryForm } from "./EditCategoryForm";

export const CategoriesPage: React.FC = () => {
  const { openModal } = useModal();
  const { sorter, handleTableChange } = useTableSorter();
  const filters = useBooleanParams(["isActive"]);
  const { data: categories, isLoading } = useCategories(sorter, filters);
  const { mutate: deleteCategory } = useDeleteCategory();

  const rootCategories = useMemo(() => categories || [], [categories]);

  const showCreateCategoryModal = (defaultParentId?: number) => {
    openModal({
      title: defaultParentId ? "Додати підкатегорію" : "Додати категорію",
      content: (
        <CreateCategoryForm
          defaultParentId={defaultParentId}
          parentCategories={rootCategories}
        />
      ),
      footer: null,
    });
  };

  const showEditCategoryModal = (category: Category) => {
    const hasChildren = Boolean(category.children?.length);
    openModal({
      title: "Редагувати категорію",
      content: (
        <EditCategoryForm
          category={category}
          parentCategories={rootCategories}
          hasChildren={hasChildren}
        />
      ),
      footer: null,
    });
  };

  const columns: TableProps<Category>["columns"] = [
    {
      title: "Назва",
      dataIndex: "name",
      key: "name",
      sorter: true,
    },
    {
      title: "Статус",
      dataIndex: "isActive",
      key: "isActive",
      width: 120,
      sorter: true,
      render: (isActive: boolean) => <StatusIndicator isActive={isActive} />,
    },
    {
      title: "Дія",
      key: "action",
      width: 180,
      align: "right",
      render: (_, record) => (
        <RightAlignedSpace size="small">
          {record.parentId === null && (
            <Button
              type="link"
              size="small"
              icon={<PlusOutlined />}
              onClick={() => showCreateCategoryModal(record.id)}
            />
          )}
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
    <PageContainer>
      <Toolbar>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => showCreateCategoryModal()}
        >
          Додати категорію
        </Button>
        <Space>
          <BooleanSelectFilter name="isActive" placeholder="Активний" />
        </Space>
      </Toolbar>
      <TableContainer>
        <Table
          columns={columns}
          dataSource={rootCategories}
          rowKey="id"
          loading={isLoading}
          pagination={false}
          expandable={{
            defaultExpandAllRows: true,
            indentSize: 24,
          }}
          onChange={handleTableChange}
        />
      </TableContainer>
    </PageContainer>
  );
};
