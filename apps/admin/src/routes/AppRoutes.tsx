import { Route, Routes } from "react-router-dom";
import { routesConfig } from "./routesConfig";

export function AppRoutes() {
  return (
    <Routes>
      {routesConfig.map(({ Layout, routes }) =>
        routes.map(({ path, element }) => (
          <Route key={path} path={path} element={<Layout>{element}</Layout>} />
        ))
      )}
    </Routes>
  );
}
