import apiClient from "~/services/api/apiClient";
import type { ApiResult } from "~/services/api/responses";
import type {
  CommentsMeta,
  CreateCommentPayload,
  CreatePostPayload,
  PostDetailsResponse,
  PostsResponse,
  UserPostsResponse,
} from "~/features/posts/types";

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
          userId: String(post.user_id ?? post.user?.id ?? ""),
          userName: post.user?.char_name ?? post.char_name ?? "Unknown",
          commentsCount: Number(post.comments_count ?? 0),
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
      const contents = data.contents.map((content) => content.trim()).filter(Boolean);
      const payload =
        contents.length === 1
          ? { title: data.title, content: contents[0], contents }
          : { title: data.title, contents };

      const response = await apiClient.post("post/store", payload);
      return response.data;
    } catch (error: any) {
      return error.response?.data || {
        success: false,
        message: "Erro ao fazer a publicacao!",
      };
    }
  },

  async createComment(data: CreateCommentPayload) {
    try {
      const response = await apiClient.post("comments", data);
      return response.data;
    } catch (error: any) {
      return error.response?.data || {
        success: false,
        message: "Erro ao adicionar comentario!",
      };
    }
  },

  async getUserPosts(userId: string, url?: string): Promise<UserPostsResponse> {
    try {
      const response = await apiClient.get(
        url?.startsWith("http") ? url : `users/${userId}/posts`,
      );
      const apiResponse = response.data;

      return {
        posts: apiResponse.data.map((post: any) => ({
          id: post.id,
          title: post.title,
          content: post.content,
          createdAt: post.created_at,
          updatedAt: post.updated_at,
        })),
        meta: apiResponse.meta ?? null,
        links: apiResponse.links ?? null,
      };
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Erro desconhecido ao buscar posts do usuário";

      throw new Error(`Falha ao carregar posts do usuário: ${errorMessage}`);
    }
  },

  async deletePost(postId: string): Promise<ApiResult<null>> {
    try {
      const response = await apiClient.delete<ApiResult<null>>(`posts/${postId}/destroy`);
      return response.data;
    } catch (error: any) {
      return error.response?.data || {
        success: false,
        message: "Erro ao apagar post!",
      };
    }
  },

  async deleteComment(commentId: string): Promise<ApiResult<null>> {
    try {
      const response = await apiClient.delete<ApiResult<null>>(`comments/${commentId}/destroy`);
      return response.data;
    } catch (error: any) {
      return error.response?.data || {
        success: false,
        message: "Erro ao apagar comentário!",
      };
    }
  },

  async getPostDetails(postId: string, url?: string): Promise<PostDetailsResponse> {
    try {
      const response = await apiClient.get(
        url?.startsWith("http") ? url : `posts/${postId}`,
      );
      const apiResponse = response.data.data;
      const contents = Array.isArray(apiResponse.contents)
        ? apiResponse.contents
        : apiResponse.content
          ? [apiResponse.content]
          : [];
      const comments = apiResponse.comments ?? null;

      return {
        post: {
          id: apiResponse.id,
          title: apiResponse.title,
          contents,
          userId: String(apiResponse.user_id ?? apiResponse.user?.id ?? ""),
        },
        comments: comments
          ? comments.data.map((comment: any) => ({
              id: comment.id,
              description: comment.description,
              userId: comment.user_id,
              postId: comment.post_id,
              createdAt: comment.created_at,
              updatedAt: comment.updated_at,
              userName: comment.user?.char_name ?? "Unknown",
            }))
          : [],
        commentsMeta: {
          current_page: comments?.current_page ?? 1,
          last_page: comments?.last_page ?? 1,
          total: comments?.total ?? 0,
          next_page_url: comments?.next_page_url ?? null,
          prev_page_url: comments?.prev_page_url ?? null,
        } satisfies CommentsMeta,
      };
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Erro desconhecido ao buscar detalhes do post";

      throw new Error(`Falha ao carregar detalhes do post: ${errorMessage}`);
    }
  },
};
