import apiClient from "~/services/api/apiClient";
import type { ApiResult } from "~/services/api/responses";
import { clearSession, getStoredUser, storeSession } from "~/features/auth/auth-storage";
import type { LoginData, LoginPayload, RegisterPayload } from "~/features/auth/types";

export const authService = {
  async login(data: LoginPayload): Promise<ApiResult<LoginData>> {
    try {
      const response = await apiClient.post<ApiResult<LoginData>>("login", data);
      const result = response.data;

      if (result.success) {
        storeSession(result.data.access_token, result.data.user);
      }

      return result;
    } catch (error: any) {
      throw error.response?.data || {
        success: false,
        message: "Erro ao fazer login!",
      };
    }
  },

  async register(data: RegisterPayload): Promise<ApiResult<null>> {
    try {
      const response = await apiClient.post<ApiResult<null>>("register", data);
      return response.data;
    } catch (error: any) {
      throw error.response?.data || {
        success: false,
        message: "Erro ao fazer cadastro!",
      };
    }
  },

  async logout(): Promise<ApiResult<null>> {
    try {
      const response = await apiClient.post<ApiResult<null>>("logout", {});
      clearSession();
      return response.data;
    } catch (error: any) {
      clearSession();
      throw error.response?.data || {
        success: false,
        message: "Erro ao fazer logout!",
      };
    }
  },

  getUser: getStoredUser,
};

export default authService;
