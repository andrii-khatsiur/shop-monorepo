import React, { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import { Button, Layout, theme, Flex } from "antd";
import { isAuthenticated, removeAuthToken } from "../services/auth";
import { ROUTES } from "../routes/routes";
import { Navigation } from "./Navigation";
import styled from "styled-components";

const { Header, Sider, Content } = Layout;

const LayoutS = styled(Layout)`
  height: 100vh;
`;

const LogoContainer = styled.div<{ collapsed: boolean }>`
  height: 42px;
  margin: 5px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden; // Important for hiding text that doesn't fit

  h1 {
    color: white;
    font-size: 18px;
    margin: 0;
    white-space: nowrap; // Prevent text from wrapping
  }

  .logo-full-text {
    display: ${({ collapsed }) => (collapsed ? "none" : "block")};
  }

  .logo-collapsed-text {
    display: ${({ collapsed }) => (collapsed ? "block" : "none")};
  }
`;

export const MainLayout: React.FC<{ children: React.ReactNode }> = ({
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
    <LayoutS>
      <Sider trigger={null} collapsible collapsed={collapsed}>
        <LogoContainer collapsed={collapsed}>
          <h1>
            <span className="logo-full-text">Shop Admin</span>
            <span className="logo-collapsed-text">SA</span>
          </h1>
        </LogoContainer>
        <Navigation />
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
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
            padding: "10px",
          }}
        >
          {children}
        </Content>
      </Layout>
    </LayoutS>
  );
};
