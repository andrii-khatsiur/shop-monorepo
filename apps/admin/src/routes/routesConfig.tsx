import { MainLayout } from "@/layout/MainLayout";
import { PublicLayout } from "../layout/PublicLayout";
import { BrandsPage } from "../pages/Brands/BrandsPage";
import { CategoriesPage } from "../pages/Categories/CategoriesPage";
import { Dashboard } from "../pages/Dashboard";
import { LoginPage } from "../pages/LoginPage";
import { ProductsPage } from "../pages/Products/ProductsPage";
import { ProductViewPage } from "../pages/Products/ProductViewPage";
import { ROUTES } from "./routes";

export const routesConfig = [
  {
    Layout: MainLayout,
    routes: [
      {
        path: ROUTES.DASHBOARD,
        element: <Dashboard />,
      },
      {
        path: ROUTES.PRODUCTS,
        element: <ProductsPage />,
      },
      {
        path: ROUTES.PRODUCT_VIEW,
        element: <ProductViewPage />,
      },
      {
        path: ROUTES.BRANDS,
        element: <BrandsPage />,
      },
      {
        path: ROUTES.CATEGORIES,
        element: <CategoriesPage />,
      },
    ],
  },
  {
    Layout: PublicLayout,
    routes: [
      {
        path: ROUTES.LOGIN,
        element: <LoginPage />,
      },
    ],
  },
];
