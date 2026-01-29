import { AppLayout } from "@/components/layout/Layout";
import { PublicLayout } from "../components/layout/PublicLayout";
import { BrandsPage } from "../pages/Brands/BrandsPage";
import { CategoriesPage } from "../pages/Categories/CategoriesPage";
import { Dashboard } from "../pages/Dashboard";
import { LoginPage } from "../pages/LoginPage";
import { OAuthCallback } from "../pages/OAuthCallback";
import { ProductsPage } from "../pages/Products/ProductsPage";
import { ROUTES } from "./routes";

export const routesConfig = [
  {
    Layout: AppLayout,
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
      {
        path: ROUTES.AUTH_CALLBACK,
        element: <OAuthCallback />,
      },
    ],
  },
];
