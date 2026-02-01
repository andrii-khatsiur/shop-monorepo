import { useSearchParams } from "react-router-dom";

const DEFAULT_PAGE = 1;
const DEFAULT_PAGE_SIZE = 10;

export function usePagination() {
  const [searchParams, setSearchParams] = useSearchParams();

  const page = Number(searchParams.get("page")) || DEFAULT_PAGE;
  const pageSize = Number(searchParams.get("pageSize")) || DEFAULT_PAGE_SIZE;

  const setPage = (newPage: number, newPageSize: number) => {
    setSearchParams((prev) => {
      if (newPage === DEFAULT_PAGE) {
        prev.delete("page");
      } else {
        prev.set("page", String(newPage));
      }

      if (newPageSize === DEFAULT_PAGE_SIZE) {
        prev.delete("pageSize");
      } else {
        prev.set("pageSize", String(newPageSize));
      }

      return prev;
    });
  };

  return { page, pageSize, setPage };
}
