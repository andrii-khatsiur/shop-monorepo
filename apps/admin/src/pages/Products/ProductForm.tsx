import React from "react";
import { Form, Input, Switch, Button, InputNumber, Select } from "antd";
import type { ProductInput, Brand, Category } from "@shop-monorepo/types";

interface ProductFormProps {
  initialValues?: Partial<ProductInput>;
  onSubmit: (values: ProductInput) => Promise<void>;
  isSubmitting: boolean;
  brands: Brand[];
  categories: Category[];
}

export const ProductForm: React.FC<ProductFormProps> = ({
  initialValues,
  onSubmit,
  isSubmitting,
  brands,
  categories,
}) => {
  const [form] = Form.useForm();

  const handleFinish = async (values: ProductInput) => {
    // Ensure null for optional fields if they are empty
    values.oldPrice = values.oldPrice === undefined ? null : values.oldPrice;
    values.brandId = values.brandId === undefined ? null : values.brandId;
    values.isActive = values.isActive ?? false;
    values.isNew = values.isNew ?? false;

    await onSubmit(values);
    form.resetFields(); // Reset fields after successful submission
  };

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={handleFinish}
      initialValues={initialValues}
    >
      <Form.Item
        name="name"
        label="Назва"
        rules={[
          { required: true, message: "Будь ласка, введіть назву продукту" },
        ]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="description"
        label="Опис"
        rules={[
          { required: true, message: "Будь ласка, введіть опис продукту" },
        ]}
      >
        <Input.TextArea />
      </Form.Item>
      <Form.Item
        name="image"
        label="URL зображення"
        rules={[
          { required: true, message: "Будь ласка, введіть URL зображення" },
        ]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="price"
        label="Ціна"
        rules={[
          { required: true, message: "Будь ласка, введіть ціну продукту" },
        ]}
      >
        <InputNumber min={0} style={{ width: "100%" }} />
      </Form.Item>
      <Form.Item name="oldPrice" label="Стара ціна">
        <InputNumber min={0} style={{ width: "100%" }} />
      </Form.Item>
      <Form.Item name="brandId" label="Бренд">
        <Select
          placeholder="Виберіть бренд"
          allowClear
          options={brands.map((brand) => ({
            label: brand.name,
            value: brand.id,
          }))}
        />
      </Form.Item>
      <Form.Item name="categoryIds" label="Категорії">
        <Select
          mode="multiple"
          placeholder="Виберіть категорії"
          allowClear
          options={categories.map((category) => ({
            label: category.name,
            value: category.id,
          }))}
        />
      </Form.Item>
      <Form.Item name="isActive" label="Активний" valuePropName="checked">
        <Switch />
      </Form.Item>
      <Form.Item name="isNew" label="Новий" valuePropName="checked">
        <Switch />
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit" loading={isSubmitting}>
          Зберегти
        </Button>
      </Form.Item>
    </Form>
  );
};
