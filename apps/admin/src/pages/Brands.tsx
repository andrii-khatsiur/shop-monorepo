import React, { useEffect, useState } from "react";
import { Table, Space, Button, message, Modal, Form, Input, Switch } from "antd";
import type { TableProps } from "antd";
import type { Brand, BrandInput } from "@shop-monorepo/types";

import {
  getBrands,
  createBrand,
  updateBrand,
  deleteBrand,
} from "../services/api";

import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { StatusIndicator } from "../components/StatusIndicator";
import { RightAlignedSpace } from "../components/RightAlignedSpace";

interface DataType extends Brand {}

export const Brands: React.FC = () => {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [editingBrand, setEditingBrand] = useState<Brand | null>(null);
  const [form] = Form.useForm();

  const fetchBrands = async () => {
    setLoading(true);
    try {
      const data: Brand[] = await getBrands();
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

  const handleAddBrand = () => {
    setEditingBrand(null);
    form.resetFields();
    form.setFieldsValue({ isActive: true }); // Set default for new brand
    setModalVisible(true);
  };

  const handleEditBrand = (brand: Brand) => {
    setEditingBrand(brand);
    form.setFieldsValue(brand);
    setModalVisible(true);
  };

  const handleDeleteBrand = async (id: number) => {
    try {
      await deleteBrand(id);
      message.success("Бренд успішно видалено!");
      fetchBrands();
    } catch (error: any) {
      message.error(`Не вдалося видалити бренд: ${error.message}`);
      console.error("Failed to delete brand:", error);
    }
  };

  const handleModalOk = async () => {
    try {
      const values: BrandInput = await form.validateFields();
      if (editingBrand) {
        await updateBrand(editingBrand.id, values);
        message.success("Бренд успішно оновлено!");
      } else {
        await createBrand(values);
        message.success("Бренд успішно створено!");
      }
      setModalVisible(false);
      fetchBrands();
    } catch (error: any) {
      message.error(`Не вдалося зберегти бренд: ${error.message}`);
      console.error("Failed to save brand:", error);
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
            onClick={() => handleEditBrand(record)}
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
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAddBrand}>
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

      <Modal
        title={editingBrand ? "Редагувати бренд" : "Додати бренд"}
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
            rules={[{ required: true, message: "Будь ласка, введіть назву бренду" }]}
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
