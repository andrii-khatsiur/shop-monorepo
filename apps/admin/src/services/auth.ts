import { ROUTES } from "@/routes/routes";
import { TOKEN_KEY, API_BASE_URL } from "@/constants/env";

export const setAuthToken = (token: string) => {
  localStorage.setItem(TOKEN_KEY, token);
};

export const getAuthToken = (): string | null => {
  return localStorage.getItem(TOKEN_KEY);
};

export const removeAuthToken = () => {
  localStorage.removeItem(TOKEN_KEY);
};

export const loginWithGoogle = () => {
  window.location.href = `${API_BASE_URL}${ROUTES.GOOGLE_AUTH}`;
};

export const isAuthenticated = (): boolean => {
  const token = getAuthToken();
  if (!token) {
    return false;
  }
  // You might want to add token validation (e.g., check expiry) here
  return true;
};
