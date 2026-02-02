import { useState, useCallback } from "react";
import type { SorterResult } from "antd/es/table/interface";
import type { Product } from "@shop-monorepo/types";

export interface SorterState {
  field?: string;
  direction?: "asc" | "desc";
}

export function useProductSorter() {
  const [sorter, setSorter] = useState<SorterState>({});

  const handleTableChange = useCallback(
    (
      _: any,
      __: any,
      sorter: SorterResult<Product> | SorterResult<Product>[]
    ) => {
      const currentSorter = Array.isArray(sorter) ? sorter[0] : sorter;

      if (currentSorter) {
        setSorter({
          field: currentSorter.field as string,
          direction: currentSorter.order === "ascend" ? "asc" : "desc",
        });
      }
    },
    []
  );

  return {
    sorter,
    handleTableChange,
  };
}
