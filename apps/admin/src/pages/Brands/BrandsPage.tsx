import { Table, Space, Button } from "antd";
import type { TableProps } from "antd";
import type { Brand } from "@shop-monorepo/types";

import { useModal } from "../../context/ModalContext";
import { useBrands, useDeleteBrand } from "../../hooks/useBrandQueries";

import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { StatusIndicator } from "../../components/StatusIndicator";
import { RightAlignedSpace } from "../../components/RightAlignedSpace";

import { CreateBrandForm } from "./CreateBrandForm";
import { EditBrandForm } from "./EditBrandForm";

export const BrandsPage: React.FC = () => {
  const { openModal } = useModal();
  const { data: brands, isLoading } = useBrands();
  const { mutate: deleteBrand } = useDeleteBrand();

  const showCreateBrandModal = () => {
    openModal({
      title: "Додати бренд",
      content: <CreateBrandForm />,
      footer: null,
    });
  };

  const showEditBrandModal = (brand: Brand) => {
    openModal({
      title: "Редагувати бренд",
      content: <EditBrandForm brand={brand} />,
      footer: null,
    });
  };

  const handleDeleteBrand = async (id: number) => {
    deleteBrand(id);
  };

  const columns: TableProps<Brand>["columns"] = [
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
          <Button
            icon={<EditOutlined />}
            onClick={() => showEditBrandModal(record)}
          />
          <Button
            icon={<DeleteOutlined />}
            danger
            onClick={() => handleDeleteBrand(record.id)}
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
          onClick={showCreateBrandModal}
        >
          Додати бренд
        </Button>
      </Space>
      <Table
        columns={columns}
        dataSource={brands || []}
        rowKey="id"
        loading={isLoading}
        pagination={false}
      />
    </div>
  );
};
