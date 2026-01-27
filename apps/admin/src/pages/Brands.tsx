import React, { useEffect, useState } from "react";
import { Table, Space, Button, message, Modal, Form, Input } from "antd";
import type { TableProps } from "antd";
import {
  getBrands,
  createBrand,
  updateBrand,
  deleteBrand,
} from "../services/api";
import type { Brand, BrandInput } from "../services/api";
import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";

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
      message.error("Failed to fetch brands.");
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
      message.success("Brand deleted successfully!");
      fetchBrands();
    } catch (error: any) {
      message.error(`Failed to delete brand: ${error.message}`);
      console.error("Failed to delete brand:", error);
    }
  };

  const handleModalOk = async () => {
    try {
      const values: BrandInput = await form.validateFields();
      if (editingBrand) {
        await updateBrand(editingBrand.id, values);
        message.success("Brand updated successfully!");
      } else {
        await createBrand(values);
        message.success("Brand created successfully!");
      }
      setModalVisible(false);
      fetchBrands();
    } catch (error: any) {
      message.error(`Failed to save brand: ${error.message}`);
      console.error("Failed to save brand:", error);
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
            onClick={() => handleEditBrand(record)}
          />
          <Button
            icon={<DeleteOutlined />}
            danger
            onClick={() => handleDeleteBrand(record.id)}
          />
        </Space>
      ),
    },
  ];

  return (
    <div>
      <Space style={{ marginBottom: 16 }}>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAddBrand}>
          Add Brand
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
        title={editingBrand ? "Edit Brand" : "Add Brand"}
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
            rules={[{ required: true, message: "Please enter brand name" }]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};
