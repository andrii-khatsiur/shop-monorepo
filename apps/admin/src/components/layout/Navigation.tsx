import { ROUTES } from "@/routes/routes";
import {
  AppstoreOutlined,
  DashboardOutlined,
  ShoppingOutlined,
  TagOutlined,
} from "@ant-design/icons";
import { Menu } from "antd";
import { Link } from "react-router-dom";

export function Navigation() {
  return (
    <Menu
      theme="dark"
      mode="inline"
      defaultSelectedKeys={[ROUTES.DASHBOARD]}
      items={[
        {
          key: ROUTES.DASHBOARD,
          icon: <DashboardOutlined />,
          label: <Link to={ROUTES.DASHBOARD}>Панель управління</Link>,
        },
        {
          key: ROUTES.PRODUCTS,
          icon: <ShoppingOutlined />,
          label: <Link to={ROUTES.PRODUCTS}>Продукти</Link>,
        },
        {
          key: ROUTES.BRANDS,
          icon: <TagOutlined />,
          label: <Link to={ROUTES.BRANDS}>Бренди</Link>,
        },
        {
          key: ROUTES.CATEGORIES,
          icon: <AppstoreOutlined />,
          label: <Link to={ROUTES.CATEGORIES}>Категорії</Link>,
        },
      ]}
    />
  );
}
