import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { User } from "@shop-monorepo/types";
import { apiClient } from "../services/api";
import { getAuthToken, setAuthToken, removeAuthToken } from "../services/auth";

export const AUTH_QUERY_KEY = ["auth", "me"];

export const useMe = () => {
  return useQuery<User, Error>({
    queryKey: AUTH_QUERY_KEY,
    queryFn: () => apiClient.auth.me(),
    enabled: !!getAuthToken(),
    retry: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useLogin = () => {
  const queryClient = useQueryClient();

  return useMutation<
    { token: string; user: User },
    Error,
    { email: string; password: string }
  >({
    mutationFn: ({ email, password }) => apiClient.auth.login(email, password),
    onSuccess: ({ token, user }) => {
      setAuthToken(token);
      queryClient.setQueryData(AUTH_QUERY_KEY, user);
    },
  });
};

export const useLogout = () => {
  const queryClient = useQueryClient();

  return () => {
    removeAuthToken();
    queryClient.setQueryData(AUTH_QUERY_KEY, null);
    queryClient.invalidateQueries({ queryKey: AUTH_QUERY_KEY });
  };
};
