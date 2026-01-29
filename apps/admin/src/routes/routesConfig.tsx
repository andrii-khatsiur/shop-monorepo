import { AppLayout } from "../components/layout/Layout";
import { PublicLayout } from "../components/layout/PublicLayout";
import { Brands } from "../pages/Brands";
import { Categories } from "../pages/Categories";
import { Dashboard } from "../pages/Dashboard";
import { LoginPage } from "../pages/LoginPage";
import { OAuthCallback } from "../pages/OAuthCallback";
import { Products } from "../pages/Products";
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
        element: <Products />,
      },
      {
        path: ROUTES.BRANDS,
        element: <Brands />,
      },
      {
        path: ROUTES.CATEGORIES,
        element: <Categories />,
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
