import { Table, Button, Space } from "antd";
import type { TableProps } from "antd";
import type { Brand } from "@shop-monorepo/types";

import { useModal } from "../../context/ModalContext";
import { useBrands, useDeleteBrand } from "../../hooks/useBrandQueries";
import { useTableSorter } from "../../hooks/useTableSorter";
import { useBooleanParams } from "../../hooks/useUrlParam";

import { PlusOutlined } from "@ant-design/icons";
import { StatusIndicator } from "../../components/StatusIndicator";
import { RightAlignedSpace } from "../../components/RightAlignedSpace";
import { DeleteButton } from "../../components/DeleteButton";
import { EditButton } from "../../components/EditButton";
import { BooleanSelectFilter } from "../../components/BooleanSelectFilter";
import {
  PageContainer,
  Toolbar,
  TableContainer,
} from "../../components/PageLayout";

import { CreateBrandForm } from "./CreateBrandForm";
import { EditBrandForm } from "./EditBrandForm";

export const BrandsPage: React.FC = () => {
  const { openModal } = useModal();
  const { sorter, handleTableChange } = useTableSorter();
  const filters = useBooleanParams(["isActive"]);
  const { data: brands, isLoading } = useBrands(sorter, filters);
  const { mutate: deleteBrand } = useDeleteBrand();

  const showCreateBrandModal = () => {
    openModal({
      title: "Додати бренд",
      content: <CreateBrandForm />,
      footer: null,
    });
  };

  const showEditBrandModal = (brand: Brand) => {
    openModal({
      title: "Редагувати бренд",
      content: <EditBrandForm brand={brand} />,
      footer: null,
    });
  };

  const columns: TableProps<Brand>["columns"] = [
    {
      title: "Назва",
      dataIndex: "name",
      key: "name",
      sorter: true,
    },
    {
      title: "Статус",
      dataIndex: "isActive",
      key: "isActive",
      sorter: true,
      render: (isActive: boolean) => <StatusIndicator isActive={isActive} />,
    },
    {
      title: "Дія",
      key: "action",
      align: "right",
      render: (_, record) => (
        <RightAlignedSpace size="middle">
          <EditButton onClick={() => showEditBrandModal(record)} />
          <DeleteButton
            onConfirm={() => deleteBrand(record.id)}
            entityName={record.name}
          />
        </RightAlignedSpace>
      ),
    },
  ];

  return (
    <PageContainer>
      <Toolbar>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={showCreateBrandModal}
        >
          Додати бренд
        </Button>
        <Space>
          <BooleanSelectFilter name="isActive" placeholder="Активний" />
        </Space>
      </Toolbar>
      <TableContainer>
        <Table
          columns={columns}
          dataSource={brands || []}
          rowKey="id"
          loading={isLoading}
          pagination={false}
          onChange={handleTableChange}
        />
      </TableContainer>
    </PageContainer>
  );
};
