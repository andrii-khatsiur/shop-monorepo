import React, { useEffect, useState } from "react";
import { Table, Space, Button, message } from "antd";
import type { TableProps } from "antd";
import type { Brand } from "@shop-monorepo/types";

import { apiClient } from "../../services/api";
import { useModal } from "../../context/ModalContext";

import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { StatusIndicator } from "../../components/StatusIndicator"; // Assuming StatusIndicator is not moved
import { RightAlignedSpace } from "../../components/RightAlignedSpace"; // Assuming RightAlignedSpace is not moved

import { CreateBrandForm } from "./CreateBrandForm";
import { EditBrandForm } from "./EditBrandForm";

interface DataType extends Brand {}

export const BrandsPage: React.FC = () => {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const { openModal } = useModal();

  const fetchBrands = async () => {
    setLoading(true);
    try {
      const data: Brand[] = await apiClient.brands.all();
      setBrands(data);
    } catch (error) {
      message.error("Не вдалося завантажити бренди.");
      console.error("Failed to fetch brands:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBrands();
  }, []);

  const handleFormSuccess = () => {
    fetchBrands();
  };

  const showCreateBrandModal = () => {
    openModal({
      title: "Додати бренд",
      content: <CreateBrandForm onSuccess={handleFormSuccess} />,
      footer: null,
    });
  };

  const showEditBrandModal = (brand: Brand) => {
    openModal({
      title: "Редагувати бренд",
      content: <EditBrandForm brand={brand} onSuccess={handleFormSuccess} />,
      footer: null,
    });
  };

  const handleDeleteBrand = async (id: number) => {
    try {
      await apiClient.brands.delete(id);
      message.success("Бренд успішно видалено!");
      fetchBrands();
    } catch (error: any) {
      message.error(`Не вдалося видалити бренд: ${error.message}`);
      console.error("Failed to delete brand:", error);
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
        dataSource={brands}
        rowKey="id"
        loading={loading}
        pagination={false}
      />
    </div>
  );
};
