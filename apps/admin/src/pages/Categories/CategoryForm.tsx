import React from "react";
import { Form, Input, Switch, Button, Select } from "antd";
import type { Category, CategoryInput } from "@shop-monorepo/types";
import { FilePicker } from "../../components/FilePicker";

interface CategoryFormProps {
  initialValues?: Partial<CategoryInput>;
  onSubmit: (values: CategoryInput) => Promise<void>;
  isSubmitting: boolean;
  parentCategories: Category[];
  disableParentSelect?: boolean;
}

export const CategoryForm: React.FC<CategoryFormProps> = ({
  initialValues,
  onSubmit,
  isSubmitting,
  parentCategories,
  disableParentSelect = false,
}) => {
  const [form] = Form.useForm();

  const handleFinish = async (values: CategoryInput) => {
    await onSubmit(values);
    form.resetFields();
  };

  const currentCategoryId = (initialValues as Category)?.id;

  const parentOptions = [
    { value: null, label: "Немає (коренева категорія)" },
    ...parentCategories
      .filter((cat) => cat.id !== currentCategoryId)
      .map((cat) => ({
        value: cat.id,
        label: cat.name,
      })),
  ];

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
          { required: true, message: "Будь ласка, введіть назву категорії" },
        ]}
      >
        <Input />
      </Form.Item>
      <Form.Item name="image" label="Зображення">
        <FilePicker />
      </Form.Item>
      <Form.Item
        name="parentId"
        label="Батьківська категорія"
        tooltip={
          disableParentSelect
            ? "Неможливо змінити, категорія має підкатегорії"
            : undefined
        }
      >
        <Select
          options={parentOptions}
          disabled={disableParentSelect}
          placeholder="Оберіть батьківську категорію"
        />
      </Form.Item>
      <Form.Item name="isActive" label="Активна" valuePropName="checked">
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
