import apiClient from "~/services/api/apiClient";
import type { CreatePostPayload, PostsResponse } from "~/features/posts/types";

export const postService = {
  async getPosts(url?: string): Promise<PostsResponse> {
    try {
      const response = await apiClient.get(url?.startsWith("http") ? url : "posts");
      const apiResponse = response.data;

      return {
        posts: apiResponse.data.map((post: any) => ({
          id: post.id,
          title: post.title,
          body: post.content,
          userId: post.user_id,
          userName: post.user?.char_name ?? "Unknown",
        })),
        meta: apiResponse.meta ?? null,
        links: apiResponse.links ?? null,
      };
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Erro desconhecido ao buscar posts";

      throw new Error(`Falha ao carregar posts: ${errorMessage}`);
    }
  },

  async createPost(data: CreatePostPayload) {
    try {
      const response = await apiClient.post("post/store", data);
      return response.data;
    } catch (error: any) {
      return error.response?.data || {
        success: false,
        message: "Erro ao fazer a publicacao!",
      };
    }
  },
};

