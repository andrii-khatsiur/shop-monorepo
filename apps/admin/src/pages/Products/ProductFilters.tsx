import React from "react";
import { Space } from "antd";
import { BrandSelectFilter } from "../../components/BrandSelectFilter";
import { CategorySelectFilter } from "../../components/CategorySelectFilter";
import { BooleanSelectFilter } from "../../components/BooleanSelectFilter";

export const ProductFilters: React.FC = () => {
  return (
    <Space>
      <BrandSelectFilter />
      <CategorySelectFilter />
      <BooleanSelectFilter name="isActive" placeholder="Активний" />
      <BooleanSelectFilter name="isNew" placeholder="Новий" />
    </Space>
  );
};
