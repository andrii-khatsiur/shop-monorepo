import { useState, useCallback } from "react";
import type { SorterResult } from "antd/es/table/interface";

export interface SorterState {
  field?: string;
  direction?: "asc" | "desc";
}

export function useTableSorter() {
  const [sorter, setSorter] = useState<SorterState>({});

  const handleTableChange = useCallback(
    (_: any, __: any, sorter: SorterResult<any> | SorterResult<any>[]) => {
      const currentSorter = Array.isArray(sorter) ? sorter[0] : sorter;

      if (currentSorter && currentSorter.field) {
        let field: string = currentSorter.field as string;

        setSorter({
          field: field,
          direction: currentSorter.order === "ascend" ? "asc" : "desc",
        });
      } else {
        // Reset sorter if sorting is cleared
        setSorter({});
      }
    },
    []
  );

  return {
    sorter,
    handleTableChange,
  };
}
