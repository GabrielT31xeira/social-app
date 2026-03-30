import apiClient from "~/services/api/apiClient";
import type { ApiResult } from "~/services/api/responses";
import { clearSession, getStoredUser, storeSession, updateStoredUser } from "~/features/auth/auth-storage";
import type { LoginData, LoginPayload, MeResponseData, RegisterPayload, User } from "~/features/auth/types";

function mapMeToStoredUser(data: MeResponseData): User {
  const currentUser = getStoredUser();

  return {
    id: data.id,
    name: data.name,
    email: data.email,
    char_name: data.char_name,
    avatar_url: data.avatar_url,
    email_verified_at: currentUser?.email_verified_at ?? null,
    created_at: data.created_at,
    updated_at: data.updated_at,
  };
}

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
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("email", data.email);
      formData.append("char_name", data.char_name);
      formData.append("password", data.password);
      formData.append("password_confirmation", data.password_confirmation);

      if (data.avatar) {
        formData.append("avatar", data.avatar);
      }

      const response = await apiClient.post<ApiResult<null>>("register", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
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

  async getMe(): Promise<ApiResult<MeResponseData>> {
    try {
      const response = await apiClient.get<ApiResult<MeResponseData>>("me");
      if (response.data.success) {
        updateStoredUser(mapMeToStoredUser(response.data.data));
      }
      return response.data;
    } catch (error: any) {
      throw error.response?.data || {
        success: false,
        message: "Erro ao carregar perfil!",
      };
    }
  },

  async removeAvatar(): Promise<ApiResult<null>> {
    try {
      const response = await apiClient.delete<ApiResult<null>>("me/avatar");
      const currentUser = getStoredUser();

      if (currentUser) {
        updateStoredUser({ ...currentUser, avatar_url: null });
      }

      return response.data;
    } catch (error: any) {
      throw error.response?.data || {
        success: false,
        message: "Erro ao remover avatar!",
      };
    }
  },

  async uploadAvatar(file: File): Promise<ApiResult<null>> {
    try {
      const formData = new FormData();
      formData.append("avatar", file);

      const response = await apiClient.post<ApiResult<null>>("me/avatar", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      return response.data;
    } catch (error: any) {
      throw error.response?.data || {
        success: false,
        message: "Erro ao enviar avatar!",
      };
    }
  },

  getUser: getStoredUser,
};

export default authService;
