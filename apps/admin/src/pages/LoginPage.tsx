import React from "react";
import { Button, Card, Flex, Typography } from "antd";
import { GoogleOutlined } from "@ant-design/icons";
import { loginWithGoogle } from "../services/auth";

const { Title, Text } = Typography;

export const LoginPage: React.FC = () => {
  const handleGoogleLogin = () => {
    loginWithGoogle();
  };

  return (
    <Flex
      justify="center"
      align="center"
      style={{ minHeight: "100vh", backgroundColor: "#f0f2f5" }}
    >
      <Card
        style={{ width: 400, textAlign: "center" }}
        title={<Title level={3}>Вхід адміністратора</Title>}
      >
        <Text>Будь ласка, увійдіть за допомогою свого облікового запису Google, щоб отримати доступ до панелі адміністратора.</Text>
        <Button
          type="primary"
          icon={<GoogleOutlined />}
          onClick={handleGoogleLogin}
          style={{ marginTop: 24 }}
          block
        >
          Увійти за допомогою Google
        </Button>
      </Card>
    </Flex>
  );
};
