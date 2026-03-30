import apiClient from "~/services/api/apiClient";
import type { ApiResult } from "~/services/api/responses";
import type {
  CommentsMeta,
  CreateCommentPayload,
  CreatePostPayload,
  PostDetailsResponse,
  PostSort,
  PostsResponse,
  UserPostsResponse,
} from "~/features/posts/types";

function buildSortedUrl(path: string, sort: PostSort) {
  const separator = path.includes("?") ? "&" : "?";
  return `${path}${separator}sort=${sort}`;
}

export const postService = {
  async getPosts(url?: string, sort: PostSort = "recent"): Promise<PostsResponse> {
    try {
      const response = await apiClient.get(
        url?.startsWith("http") ? url : buildSortedUrl("posts", sort),
      );
      const apiResponse = response.data;

      return {
        posts: apiResponse.data.map((post: any) => ({
          id: post.id,
          title: post.title,
          body: post.content,
          userId: String(post.user_id ?? post.user?.id ?? ""),
          userName: post.user?.char_name ?? post.char_name ?? "Unknown",
          commentsCount: Number(post.comments_count ?? 0),
          likesCount: Number(post.likes_count ?? 0),
          dislikesCount: Number(post.dislikes_count ?? 0),
          myReaction: post.my_reaction ?? null,
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

  async getPostComments(postId: string, url?: string, sort: PostSort = "recent") {
    try {
      const response = await apiClient.get(
        url?.startsWith("http") ? url : buildSortedUrl(`posts/${postId}/comments`, sort),
      );
      const apiResponse = response.data.data;
      const comments = apiResponse.comments;

      return {
        comments: comments.data.map((comment: any) => ({
          id: comment.id,
          description: comment.description,
          userId: String(comment.user_id ?? comment.user?.id ?? ""),
          postId: String(comment.post_id ?? postId),
          createdAt: comment.created_at,
          updatedAt: comment.updated_at ?? comment.created_at,
          userName: comment.user?.char_name ?? comment.char_name ?? "Unknown",
          likesCount: Number(comment.likes_count ?? 0),
          dislikesCount: Number(comment.dislikes_count ?? 0),
          myReaction: comment.my_reaction ?? null,
        })),
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
        "Erro desconhecido ao buscar comentários";

      throw new Error(`Falha ao carregar comentários: ${errorMessage}`);
    }
  },

  async getUserPosts(
    userId: string,
    url?: string,
    sort: PostSort = "recent",
  ): Promise<UserPostsResponse> {
    try {
      const response = await apiClient.get(
        url?.startsWith("http") ? url : buildSortedUrl(`users/${userId}/posts`, sort),
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

  async reactToPost(postId: string, type: "like" | "dislike") {
    try {
      const response = await apiClient.post(`posts/${postId}/reaction`, { type });
      return response.data;
    } catch (error: any) {
      return error.response?.data || {
        success: false,
        message: "Erro ao reagir ao post!",
      };
    }
  },

  async removeReaction(postId: string) {
    try {
      const response = await apiClient.delete(`posts/${postId}/reaction`);
      return response.data;
    } catch (error: any) {
      return error.response?.data || {
        success: false,
        message: "Erro ao remover reação!",
      };
    }
  },

  async reactToComment(commentId: string, type: "like" | "dislike") {
    try {
      const response = await apiClient.post(`comments/${commentId}/reaction`, { type });
      return response.data;
    } catch (error: any) {
      return error.response?.data || {
        success: false,
        message: "Erro ao reagir ao comentário!",
      };
    }
  },

  async removeCommentReaction(commentId: string) {
    try {
      const response = await apiClient.delete(`comments/${commentId}/reaction`);
      return response.data;
    } catch (error: any) {
      return error.response?.data || {
        success: false,
        message: "Erro ao remover reação do comentário!",
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

      return {
        post: {
          id: apiResponse.id,
          title: apiResponse.title,
          contents,
          userId: String(apiResponse.user_id ?? apiResponse.user?.id ?? ""),
          likesCount: Number(apiResponse.likes_count ?? 0),
          dislikesCount: Number(apiResponse.dislikes_count ?? 0),
          myReaction: apiResponse.my_reaction ?? null,
        },
        comments: [],
        commentsMeta: {
          current_page: 1,
          last_page: 1,
          total: 0,
          next_page_url: null,
          prev_page_url: null,
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
