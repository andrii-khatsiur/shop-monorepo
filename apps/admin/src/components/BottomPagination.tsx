import React from "react";
import { Pagination } from "antd";
import styled from "styled-components";
import { usePagination } from "../hooks/usePagination";

const StyledPagination = styled(Pagination)`
  margin-top: auto;
  padding-top: 16px;
  text-align: right;
`;

interface BottomPaginationProps {
  total: number;
}

export const BottomPagination: React.FC<BottomPaginationProps> = ({
  total,
}) => {
  const { page, pageSize, setPage } = usePagination();

  return (
    <StyledPagination
      current={page}
      pageSize={pageSize}
      total={total}
      showSizeChanger
      onChange={setPage}
    />
  );
};
