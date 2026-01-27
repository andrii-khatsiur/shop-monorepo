const TOKEN_KEY = "jwt_token";
const API_BASE_URL = "http://localhost:3000/api";

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
  window.location.href = `${API_BASE_URL}/auth/google`;
};

export const isAuthenticated = (): boolean => {
  const token = getAuthToken();
  if (!token) {
    return false;
  }
  // You might want to add token validation (e.g., check expiry) here
  return true;
};
