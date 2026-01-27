import "./index.css";
import { Navigate, Route, Routes } from "react-router-dom";
import { AppLayout } from "./Layout";
import { Products } from "./pages/Products";
import { Brands } from "./pages/Brands";
import { Categories } from "./pages/Categories";
import { Dashboard } from "./pages/Dashboard";
import { LoginPage } from "./pages/LoginPage";
import { OAuthCallback } from "./pages/OAuthCallback";
import { isAuthenticated } from "./services/auth";
import type { JSX } from "react";

const PrivateRoute = ({ children }: { children: JSX.Element }) => {
  return isAuthenticated() ? children : <Navigate to="/login" />;
};

export function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/auth-callback" element={<OAuthCallback />} />
      <Route
        path="/*"
        element={
          <PrivateRoute>
            <AppLayout>
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/products" element={<Products />} />
                <Route path="/brands" element={<Brands />} />
                <Route path="/categories" element={<Categories />} />
              </Routes>
            </AppLayout>
          </PrivateRoute>
        }
      />
    </Routes>
  );
}

export default App;
