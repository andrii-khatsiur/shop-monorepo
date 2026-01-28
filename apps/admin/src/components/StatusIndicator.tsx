import React from "react";
import { Tag } from "antd";
import {
  CheckCircleOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";

interface StatusIndicatorProps {
  isActive: boolean;
}

export const StatusIndicator: React.FC<StatusIndicatorProps> = ({
  isActive,
}) => {
  return isActive ? (
    <Tag icon={<CheckCircleOutlined />} color="success">
      Так
    </Tag>
  ) : (
    <Tag icon={<ExclamationCircleOutlined />} color="warning">
      Ні
    </Tag>
  );
};
