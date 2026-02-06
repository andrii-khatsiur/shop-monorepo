import React, { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import { Button, Layout, theme, Flex, Spin } from "antd";
import { useAuth } from "../context/AuthContext";
import { ROUTES } from "../routes/routes";
import { Navigation } from "./Navigation";
import styled from "styled-components";

const { Header, Sider, Content } = Layout;

const LayoutS = styled(Layout)`
  height: 100vh;
`;

const HeaderS = styled(Header)<{ $bg: string }>`
  padding: 0;
  background: ${({ $bg }) => $bg};
`;

const HeaderButton = styled(Button)`
  font-size: 16px;
  width: 64px;
  height: 64px;
`;

const UserEmail = styled.span`
  margin-right: 8px;
  color: rgba(0, 0, 0, 0.65);
`;

const HeaderRight = styled(Flex)`
  padding-right: 16px;
`;

const ContentS = styled(Content)<{ $bg: string; $radius: number }>`
  background: ${({ $bg }) => $bg};
  border-radius: ${({ $radius }) => $radius}px;
  padding: 10px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
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

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
`;

export const MainLayout: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const { isAuthenticated, isLoading, logout, user } = useAuth();
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const handleLogout = () => {
    logout();
    navigate(ROUTES.LOGIN);
  };

  if (isLoading) {
    return (
      <LoadingContainer>
        <Spin size="large" />
      </LoadingContainer>
    );
  }

  if (!isAuthenticated) {
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
        <HeaderS $bg={colorBgContainer}>
          <Flex align="center" justify="space-between">
            <HeaderButton
              type="text"
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={() => setCollapsed(!collapsed)}
            />
            <HeaderRight align="center">
              {user?.email && <UserEmail>{user.email}</UserEmail>}
              <HeaderButton
                type="text"
                icon={<LogoutOutlined />}
                onClick={handleLogout}
              />
            </HeaderRight>
          </Flex>
        </HeaderS>
        <ContentS $bg={colorBgContainer} $radius={borderRadiusLG}>
          {children}
        </ContentS>
      </Layout>
    </LayoutS>
  );
};
