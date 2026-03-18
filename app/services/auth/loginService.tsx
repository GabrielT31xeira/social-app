import apiClient from "~/services/api/apiClient";
import type {ApiResult} from "~/services/api/responses";

export interface LoginPayload {
    char_name: string;
    password: string;
}

export interface RegisterPayload {
    name: string;
    email: string;
    char_name: string;
    password: string;
    password_confirmation: string;
}

interface User {
    id: string;
    name: string;
    email: string;
    char_name: string;
}

interface AuthResponse {
    token: string;
    user: User;
}

export const loginService = {
    async login(data: LoginPayload): Promise<ApiResult<AuthResponse>> {
        try {
            const response = await apiClient.post<ApiResult<AuthResponse>>("login", data);
            const res = response.data;

            if (res.success) {
                // salva corretamente (string!)
                localStorage.setItem("token", res.data.token);
                localStorage.setItem("user", JSON.stringify(res.data.user));
            }

            return res;
        } catch (error: any) {
            throw error.response?.data || { success: false, message: "Erro ao fazer login!" };
        }
    },

    async register(data: RegisterPayload): Promise<ApiResult<null>> {
        try {
            const response = await apiClient.post<ApiResult<null>>("register", data);

            return response.data;
        } catch (error: any) {
            throw error.response?.data || { success: false, message: "Erro ao fazer cadastro!" };
        }
    },

    async logout(): Promise<ApiResult<null>> {
        try {
            const response = await apiClient.post<ApiResult<null>>("logout");

            // limpa storage independente da resposta
            localStorage.removeItem("token");
            localStorage.removeItem("user");

            return response.data;
        } catch (error: any) {
            throw error.response?.data || { success: false, message: "Erro ao fazer logout!" };
        }
    },

    async refreshToken(): Promise<ApiResult<AuthResponse>> {
        try {
            const response = await apiClient.post<ApiResult<AuthResponse>>("refresh");

            const res = response.data;

            if (res.success) {
                localStorage.setItem("token", res.data.token);
                localStorage.setItem("user", JSON.stringify(res.data.user));
            }

            return res;
        } catch (error: any) {
            throw error.response?.data || { success: false, message: "Erro ao atualizar token!" };
        }
    },

    getUser() {
        if (typeof window === "undefined") return null;

        try {
            const user = localStorage.getItem("user");
            return user ? JSON.parse(user) : null;
        } catch {
            return null;
        }
    }
};

export default loginService;