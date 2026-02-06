import React, { useState } from "react";
import { Button, Card, Flex, Typography, Form, Input, message, Spin } from "antd";
import { LockOutlined, MailOutlined } from "@ant-design/icons";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { ROUTES } from "../routes/routes";
import styled from "styled-components";

const { Title } = Typography;

interface LoginFormValues {
  email: string;
  password: string;
}

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
`;

export const LoginPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const { login, isAuthenticated, isLoading } = useAuth();

  const handleSubmit = async (values: LoginFormValues) => {
    setLoading(true);
    try {
      await login(values.email, values.password);
    } catch (error: any) {
      message.error(error.message || "Помилка входу");
    } finally {
      setLoading(false);
    }
  };

  if (isLoading) {
    return (
      <LoadingContainer>
        <Spin size="large" />
      </LoadingContainer>
    );
  }

  if (isAuthenticated) {
    return <Navigate to={ROUTES.DASHBOARD} />;
  }

  return (
    <Flex
      justify="center"
      align="center"
      style={{ minHeight: "100vh", backgroundColor: "#f0f2f5" }}
    >
      <Card
        style={{ width: 400 }}
        title={<Title level={3} style={{ textAlign: "center", margin: 0 }}>Вхід адміністратора</Title>}
      >
        <Form
          layout="vertical"
          onFinish={handleSubmit}
          autoComplete="off"
        >
          <Form.Item
            name="email"
            rules={[
              { required: true, message: "Введіть email" },
              { type: "email", message: "Невірний формат email" },
            ]}
          >
            <Input
              prefix={<MailOutlined />}
              placeholder="Email"
              size="large"
            />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[{ required: true, message: "Введіть пароль" }]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Пароль"
              size="large"
            />
          </Form.Item>
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              block
              size="large"
            >
              Увійти
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </Flex>
  );
};
