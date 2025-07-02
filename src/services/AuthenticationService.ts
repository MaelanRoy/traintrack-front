import type { AxiosResponse } from "axios";

import api from "@/config/api/ApiConfig";
import type LoginRequest from "@/models/LoginRequest";
import type RegisterRequest from "@/models/RegisterRequest";

// Interface pour la réponse de connexion
interface Response {
  token: string;
  type: string;
}

class AuthenticationService {
  /**
   * Log in an user
   * @param LoginRequest -> a valid form login to connect with
   * @return promise @type { Promise<AxiosResponse<Response>> }
   */
  formLoginProcessor(
    LoginRequest: LoginRequest
  ): Promise<AxiosResponse<Response>> {
    return api.post("auth/login", LoginRequest);
  }

  /**
   * Sign up an user
   * @param RegisterRequest -> an user to create
   * @return promise @type { Promise<AxiosResponse<Response>> }
   */
  register(register: RegisterRequest): Promise<AxiosResponse<Response>> {
    return api.post("auth/register", register);
  }
}
export default new AuthenticationService();
