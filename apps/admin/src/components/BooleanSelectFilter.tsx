import { Select } from "antd";
import { useSearchParams } from "react-router-dom";

const options = [
  { label: "Так", value: "true" },
  { label: "Ні", value: "false" },
];

interface BooleanSelectFilterProps {
  name: string;
  placeholder: string;
  width?: number;
}

export const BooleanSelectFilter: React.FC<BooleanSelectFilterProps> = ({
  name,
  placeholder,
  width = 120,
}) => {
  const [searchParams, setSearchParams] = useSearchParams();

  const value = searchParams.get(name) ?? undefined;

  const handleChange = (newValue: string | undefined) => {
    setSearchParams((prev) => {
      if (newValue !== undefined) {
        prev.set(name, newValue);
      } else {
        prev.delete(name);
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
      options={options}
    />
  );
};
