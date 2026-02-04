import { useMemo } from "react";
import { TreeSelect } from "antd";
import { useSearchParams } from "react-router-dom";
import { useCategories } from "../hooks/useCategoryQueries";
import { transformToTreeData } from "../utils/categoryUtils";

interface CategorySelectFilterProps {
  placeholder?: string;
  width?: number;
}

export const CategorySelectFilter: React.FC<CategorySelectFilterProps> = ({
  placeholder = "Фільтр по категорії",
  width = 200,
}) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { data: categories = [] } = useCategories();

  const flatCategories = useMemo(
    () => categories.flatMap((c) => [c, ...(c.children || [])]),
    [categories]
  );

  const categorySlug = searchParams.get("category");
  const selectedCategoryId = useMemo(
    () => flatCategories.find((c) => c.slug === categorySlug)?.id,
    [flatCategories, categorySlug]
  );

  const handleChange = (value: number | undefined) => {
    const category = flatCategories.find((c) => c.id === value);
    setSearchParams((prev) => {
      if (category) {
        prev.set("category", category.slug);
      } else {
        prev.delete("category");
      }
      return prev;
    });
  };

  return (
    <TreeSelect
      placeholder={placeholder}
      allowClear
      style={{ width }}
      value={selectedCategoryId}
      onChange={handleChange}
      treeData={transformToTreeData(categories)}
      treeDefaultExpandAll
    />
  );
};
