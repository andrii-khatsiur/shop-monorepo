import React from "react";
import { Form, Input, Switch, Button } from "antd";
import type { BrandInput } from "@shop-monorepo/types";

interface BrandFormProps {
  initialValues?: Partial<BrandInput>;
  onSubmit: (values: BrandInput) => Promise<void>;
  isSubmitting: boolean;
}

export const BrandForm: React.FC<BrandFormProps> = ({
  initialValues,
  onSubmit,
  isSubmitting,
}) => {
  const [form] = Form.useForm();

  const handleFinish = async (values: BrandInput) => {
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
          { required: true, message: "Будь ласка, введіть назву бренду" },
        ]}
      >
        <Input />
      </Form.Item>
      <Form.Item name="isActive" label="Активний" valuePropName="checked">
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
