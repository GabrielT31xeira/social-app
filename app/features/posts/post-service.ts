import apiClient from "~/services/api/apiClient";
import type {
  CommentsMeta,
  CreateCommentPayload,
  CreatePostPayload,
  PostDetailsResponse,
  PostsResponse,
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
          userId: post.user_id,
          userName: post.user?.char_name ?? "Unknown",
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
      const response = await apiClient.post("post/store", data);
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

  async getPostDetails(postId: string, url?: string): Promise<PostDetailsResponse> {
    try {
      const response = await apiClient.get(
        url?.startsWith("http") ? url : `posts/${postId}/comments`,
      );
      const apiResponse = response.data.data;
      const comments = apiResponse.comments;

      return {
        post: {
          id: apiResponse.post.id,
          title: apiResponse.post.title,
          content: apiResponse.post.content,
        },
        comments: comments.data.map((comment: any) => ({
          id: comment.id,
          description: comment.description,
          userId: comment.user_id,
          postId: comment.post_id,
          createdAt: comment.created_at,
          updatedAt: comment.updated_at,
          userName: comment.user?.char_name ?? "Unknown",
        })),
        commentsMeta: {
          current_page: comments.current_page,
          last_page: comments.last_page,
          total: comments.total,
          next_page_url: comments.next_page_url,
          prev_page_url: comments.prev_page_url,
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
