import { Space } from "antd";
import styled from "styled-components";

export const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  min-height: 0;
`;

export const Toolbar = styled(Space)`
  margin-bottom: 16px;
  flex-shrink: 0;
`;

export const TableContainer = styled.div`
  flex: 1;
  overflow: auto;
  min-height: 0;
`;
