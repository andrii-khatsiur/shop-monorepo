import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { setAuthToken } from "../services/auth";
import { Spin, Typography } from "antd";
import { LoadingOutlined } from "@ant-design/icons";

const { Text } = Typography;

export const OAuthCallback: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get("token");

    if (token) {
      setAuthToken(token);
      navigate("/"); // Redirect to dashboard or home page
    } else {
      // Handle error, e.g., show an error message and redirect to login
      navigate("/login?error=auth_failed");
    }
  }, [location, navigate]);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
      }}
    >
      <Spin
        indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />}
        size="large"
      />
      <Text style={{ marginTop: 20 }}>Authenticating...</Text>
    </div>
  );
};
