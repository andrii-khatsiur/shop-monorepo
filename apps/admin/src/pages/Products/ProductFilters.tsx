import React from "react";
import { Select, TreeSelect, Space } from "antd";
import type { Brand, Category } from "@shop-monorepo/types";
import { transformToTreeData } from "../../utils/categoryUtils";

interface ProductFiltersProps {
  brands: Brand[];
  categories: Category[];
  brandFilter?: string;
  selectedCategoryId?: number;
  onBrandChange: (value: string | undefined) => void;
  onCategoryChange: (value: number | undefined) => void;
}

export const ProductFilters: React.FC<ProductFiltersProps> = ({
  brands,
  categories,
  brandFilter,
  selectedCategoryId,
  onBrandChange,
  onCategoryChange,
}) => {
  return (
    <Space>
      <Select
        placeholder="Фільтр по бренду"
        allowClear
        style={{ width: 200 }}
        value={brandFilter}
        onChange={onBrandChange}
        options={brands.map((brand) => ({
          label: brand.name,
          value: brand.slug,
        }))}
      />
      <TreeSelect
        placeholder="Фільтр по категорії"
        allowClear
        style={{ width: 200 }}
        value={selectedCategoryId}
        onChange={onCategoryChange}
        treeData={transformToTreeData(categories)}
        treeDefaultExpandAll
      />
    </Space>
  );
};
