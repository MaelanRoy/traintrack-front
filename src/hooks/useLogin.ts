import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosResponse, AxiosError } from "axios";
import AuthenticationService from "@/services/AuthenticationService";
import type LoginRequest from "@/models/LoginRequest";
import { useAuth } from "@/hooks/useAuth";

interface LoginResponse {
  token: string;
  type: string;
}

interface UseLoginOptions {
  onSuccess?: (response: AxiosResponse<LoginResponse>) => void;
  onError?: (error: AxiosError) => void;
}

export const useLogin = (options?: UseLoginOptions) => {
  const queryClient = useQueryClient();
  const { login } = useAuth();

  return useMutation<AxiosResponse<LoginResponse>, AxiosError, LoginRequest>({
    mutationFn: (loginData) =>
      AuthenticationService.formLoginProcessor(loginData),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ["login"] });
      queryClient.invalidateQueries({ queryKey: ["user"] });
      const { token, type } = response.data;
      login(`${type} ${token}`);
      options?.onSuccess?.(response);
    },
    onError: (error) => {
      options?.onError?.(error);
    },
  });
};
