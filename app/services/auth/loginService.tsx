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

export interface User {
    id: string;
    name: string;
    char_name: string;
    email: string;
    email_verified_at: string | null;
    created_at: string;
    updated_at: string;
}

export interface LoginData {
    Bearer: string;
    user: User;
}

export interface LoginResponse {
    success: true;
    message: string;
    data: LoginData;
}

export const loginService = {
    async login(data: LoginPayload): Promise<ApiResult<LoginResponse>> {
        try {
            const response = await apiClient.post<ApiResult<LoginResponse>>("login", data);
            const res = response.data;
            if (res.success) {
                // @ts-ignore
                const token = res.data.access_token;
                // @ts-ignore
                const user = res.data.user;

                localStorage.setItem("token", token);
                localStorage.setItem("user", JSON.stringify(user));
            }

            return res;
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
            throw error.response?.data || { success: false, message: "Erro ao fazer cadastro!" };
        }
    },

    async logout(): Promise<ApiResult<null>> {
        try {
            const response = await apiClient.post<ApiResult<null>>("logout", {},
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    }
                });

            // limpa storage independente da resposta
            localStorage.removeItem("token");
            localStorage.removeItem("user");

            return response.data;
        } catch (error: any) {
            throw error.response?.data || { success: false, message: "Erro ao fazer logout!" };
        }
    },

    // async refreshToken(): Promise<ApiResult<null>> {
    //     try {
    //         const response = await apiClient.post<ApiResult<null>>("refresh");
    //
    //         const res = response.data;
    //
    //         if (res.success) {
    //             localStorage.setItem("token", res.data.token);
    //             localStorage.setItem("user", JSON.stringify(res.data.user));
    //         }
    //
    //         return res;
    //     } catch (error: any) {
    //         throw error.response?.data || { success: false, message: "Erro ao atualizar token!" };
    //     }
    // },

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