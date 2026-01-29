import React, { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  DashboardOutlined,
  ShoppingOutlined,
  TagOutlined,
  AppstoreOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import { Button, Layout, Menu, theme, Flex } from "antd";
import { isAuthenticated, removeAuthToken } from "../../services/auth";
import { ROUTES } from "../../routes/routes";

const { Header, Sider, Content } = Layout;

export const AppLayout: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const handleLogout = () => {
    removeAuthToken();
    navigate(ROUTES.LOGIN);
  };

  if (!isAuthenticated()) {
    return <Navigate to={ROUTES.LOGIN} />;
  }

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider trigger={null} collapsible collapsed={collapsed}>
        <div className="demo-logo-vertical" />
        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={[ROUTES.DASHBOARD]}
          items={[
            {
              key: ROUTES.DASHBOARD,
              icon: <DashboardOutlined />,
              label: <Link to={ROUTES.DASHBOARD}>Панель управління</Link>,
            },
            {
              key: ROUTES.PRODUCTS,
              icon: <ShoppingOutlined />,
              label: <Link to={ROUTES.PRODUCTS}>Продукти</Link>,
            },
            {
              key: ROUTES.BRANDS,
              icon: <TagOutlined />,
              label: <Link to={ROUTES.BRANDS}>Бренди</Link>,
            },
            {
              key: ROUTES.CATEGORIES,
              icon: <AppstoreOutlined />,
              label: <Link to={ROUTES.CATEGORIES}>Категорії</Link>,
            },
          ]}
        />
      </Sider>
      <Layout>
        <Header style={{ padding: 0, background: colorBgContainer }}>
          <Flex align="center" justify="space-between">
            <Button
              type="text"
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={() => setCollapsed(!collapsed)}
              style={{
                fontSize: "16px",
                width: 64,
                height: 64,
              }}
            />
            <Button
              type="text"
              icon={<LogoutOutlined />}
              onClick={handleLogout}
              style={{
                fontSize: "16px",
                width: 64,
                height: 64,
              }}
            />
          </Flex>
        </Header>
        <Content
          style={{
            margin: "24px 16px",
            padding: 24,
            minHeight: 280,
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
          }}
        >
          {children}
        </Content>
      </Layout>
    </Layout>
  );
};
