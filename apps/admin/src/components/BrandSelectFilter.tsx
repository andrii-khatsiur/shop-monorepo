import { Select } from "antd";
import { useSearchParams } from "react-router-dom";
import { useBrands } from "../hooks/useBrandQueries";

interface BrandSelectFilterProps {
  placeholder?: string;
  width?: number;
}

export const BrandSelectFilter: React.FC<BrandSelectFilterProps> = ({
  placeholder = "Фільтр по бренду",
  width = 200,
}) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { data: brands = [] } = useBrands();

  const value = searchParams.get("brand") || undefined;

  const handleChange = (newValue: string | undefined) => {
    setSearchParams((prev) => {
      if (newValue) {
        prev.set("brand", newValue);
      } else {
        prev.delete("brand");
      }
      return prev;
    });
  };

  return (
    <Select
      placeholder={placeholder}
      allowClear
      style={{ width }}
      value={value}
      onChange={handleChange}
      options={brands.map((brand) => ({
        label: brand.name,
        value: brand.slug,
      }))}
    />
  );
};
