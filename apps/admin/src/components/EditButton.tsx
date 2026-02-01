import { Button } from "antd";
import { EditOutlined } from "@ant-design/icons";

interface EditButtonProps {
  onClick: () => void;
}

export const EditButton: React.FC<EditButtonProps> = ({ onClick }) => {
  return <Button icon={<EditOutlined />} onClick={onClick} />;
};
