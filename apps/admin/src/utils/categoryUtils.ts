import type { Category } from "@shop-monorepo/types";

interface TreeNode {
  title: string;
  value: number;
  key: number;
  disabled: boolean;
  children?: TreeNode[];
}

export const transformToTreeData = (categories: Category[]): TreeNode[] => {
  return categories.map((category) => ({
    title: category.name,
    value: category.id,
    key: category.id,
    disabled: !category.isActive,
    children: category.children?.length
      ? transformToTreeData(category.children)
      : undefined,
  }));
};

export const findCategoryInTree = (
  categories: Category[],
  id: number
): { category: Category; parent?: Category } | null => {
  for (const cat of categories) {
    if (cat.id === id) return { category: cat };
    if (cat.children) {
      const found = cat.children.find((child) => child.id === id);
      if (found) return { category: found, parent: cat };
    }
  }
  return null;
};

export const formatCategoryName = (
  categories: Category[],
  id: number
): string | null => {
  const result = findCategoryInTree(categories, id);
  if (!result) return null;
  return result.parent
    ? `${result.parent.name} > ${result.category.name}`
    : result.category.name;
};
