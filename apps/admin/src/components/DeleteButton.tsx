import { Button, Popconfirm } from "antd";
import { DeleteOutlined } from "@ant-design/icons";

interface DeleteButtonProps {
  onConfirm: () => void;
  entityName?: string;
}

export const DeleteButton: React.FC<DeleteButtonProps> = ({
  onConfirm,
  entityName = "цей запис",
}) => {
  return (
    <Popconfirm
      title="Видалення"
      description={`Ви впевнені, що хочете видалити ${entityName}?`}
      onConfirm={onConfirm}
      okText="Так"
      cancelText="Ні"
      placement="left"
    >
      <Button icon={<DeleteOutlined />} danger />
    </Popconfirm>
  );
};
