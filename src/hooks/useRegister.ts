import type RegisterRequest from "@/models/RegisterRequest";
import AuthenticationService from "@/services/AuthenticationService";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosResponse } from "axios";
import { useAuth } from "@/hooks/useAuth";

interface registerResponse {
  token: string;
  type: string;
}
export const useRegister = () => {
  const queryClient = useQueryClient();
  const { login } = useAuth();

  return useMutation<AxiosResponse<registerResponse>, Error, RegisterRequest>({
    mutationFn: (registerData) => AuthenticationService.register(registerData),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ["register"] });
      const { token, type } = response.data;
      login(`${type} ${token}`);
    },
  });
};
