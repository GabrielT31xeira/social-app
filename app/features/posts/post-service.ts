import apiClient from "~/services/api/apiClient";
import { normalizeApiError } from "~/services/api/api-errors";
import type { ApiResult } from "~/services/api/responses";
import type {
  CommentsMeta,
  CreateCommentPayload,
  CreatePostPayload,
  Post,
  PostComment,
  PostDetailsResponse,
  PostSort,
  PostsLinks,
  PostsMeta,
  PostsResponse,
  UserPostsResponse,
} from "~/features/posts/types";

type ReactionType = "like" | "dislike";

interface ApiPostUser {
  id?: string | number | null;
  char_name?: string | null;
  avatar_url?: string | null;
}

interface ApiPostSummary {
  id: string;
  title: string;
  content?: string | null;
  contents?: string[] | null;
  user_id?: string | number | null;
  char_name?: string | null;
  comments_count?: number | string | null;
  likes_count?: number | string | null;
  dislikes_count?: number | string | null;
  my_reaction?: ReactionType | null;
  created_at?: string;
  updated_at?: string;
  user?: ApiPostUser | null;
}

interface ApiPostsMeta {
  current_page?: number;
  last_page?: number;
  total?: number;
  per_page?: number;
}

interface ApiPostsLinks {
  prev?: string | null;
  next?: string | null;
  first?: string | null;
  last?: string | null;
}

interface ApiPostsEnvelope {
  success: boolean;
  message?: string;
  data: ApiPostSummary[];
  meta?: ApiPostsMeta | null;
  links?: ApiPostsLinks | null;
}

interface ApiCommentUser {
  id?: string | number | null;
  char_name?: string | null;
  avatar_url?: string | null;
}

interface ApiCommentSummary {
  id: string;
  description: string;
  user_id?: string | number | null;
  post_id?: string | number | null;
  created_at: string;
  updated_at?: string | null;
  char_name?: string | null;
  likes_count?: number | string | null;
  dislikes_count?: number | string | null;
  my_reaction?: ReactionType | null;
  user?: ApiCommentUser | null;
}

interface ApiCommentsPage {
  current_page?: number;
  last_page?: number;
  total?: number;
  next_page_url?: string | null;
  prev_page_url?: string | null;
  data?: ApiCommentSummary[];
}

interface ApiCommentsEnvelope {
  success: boolean;
  message?: string;
  data:
    | ApiCommentSummary[]
    | {
        post?: {
          id: string;
          title: string;
          content?: string | string[] | null;
        };
        comments: ApiCommentsPage;
      };
  meta?: ApiPostsMeta | null;
  links?: ApiPostsLinks | null;
  context?: {
    post?: {
      id: string;
      title: string;
      content?: string | string[] | null;
    };
  } | null;
}

interface ApiPostDetailsEnvelope {
  success: boolean;
  message?: string;
  data: ApiPostSummary;
}

interface ApiReactionSummary {
  likes_count?: number | string | null;
  dislikes_count?: number | string | null;
  my_reaction?: ReactionType | null;
}

function buildSortedUrl(path: string, sort: PostSort) {
  const separator = path.includes("?") ? "&" : "?";
  return `${path}${separator}sort=${sort}`;
}

function toNumber(value: number | string | null | undefined) {
  return Number(value ?? 0);
}

function toPostsMeta(meta?: ApiPostsMeta | null): PostsMeta | null {
  if (!meta) {
    return null;
  }

  return {
    current_page: meta.current_page ?? 1,
    last_page: meta.last_page ?? 1,
    total: meta.total ?? 0,
    per_page: meta.per_page,
  };
}

function toPostsLinks(links?: ApiPostsLinks | null): PostsLinks | null {
  if (!links) {
    return null;
  }

  return {
    prev: links.prev ?? null,
    next: links.next ?? null,
  };
}

function mapPostSummary(post: ApiPostSummary): Post {
  return {
    id: post.id,
    title: post.title,
    body: post.content ?? "",
    userId: String(post.user_id ?? post.user?.id ?? ""),
    userName: post.user?.char_name ?? post.char_name ?? "Unknown",
    commentsCount: toNumber(post.comments_count),
    likesCount: toNumber(post.likes_count),
    dislikesCount: toNumber(post.dislikes_count),
    myReaction: post.my_reaction ?? null,
  };
}

function mapCommentSummary(comment: ApiCommentSummary, fallbackPostId: string): PostComment {
  return {
    id: comment.id,
    description: comment.description,
    userId: String(comment.user_id ?? comment.user?.id ?? ""),
    postId: String(comment.post_id ?? fallbackPostId),
    createdAt: comment.created_at,
    updatedAt: comment.updated_at ?? comment.created_at,
    userName: comment.user?.char_name ?? comment.char_name ?? "Unknown",
    likesCount: toNumber(comment.likes_count),
    dislikesCount: toNumber(comment.dislikes_count),
    myReaction: comment.my_reaction ?? null,
  };
}

function mapCommentsMeta(comments?: ApiCommentsPage): CommentsMeta {
  return {
    current_page: comments?.current_page ?? 1,
    last_page: comments?.last_page ?? 1,
    total: comments?.total ?? 0,
    next_page_url: comments?.next_page_url ?? null,
    prev_page_url: comments?.prev_page_url ?? null,
  };
}

function extractContents(post: ApiPostSummary) {
  if (Array.isArray(post.contents)) {
    return post.contents.filter((content) => typeof content === "string");
  }

  if (typeof post.content === "string" && post.content.trim().length > 0) {
    return [post.content];
  }

  return [];
}

function extractCommentsResponse(response: ApiCommentsEnvelope, postId: string) {
  if (Array.isArray(response.data)) {
    return {
      comments: response.data.map((comment) => mapCommentSummary(comment, postId)),
      commentsMeta: {
        current_page: response.meta?.current_page ?? 1,
        last_page: response.meta?.last_page ?? 1,
        total: response.meta?.total ?? response.data.length,
        next_page_url: response.links?.next ?? null,
        prev_page_url: response.links?.prev ?? null,
      } satisfies CommentsMeta,
    };
  }

  return {
    comments: (response.data.comments.data ?? []).map((comment) =>
      mapCommentSummary(comment, postId),
    ),
    commentsMeta: mapCommentsMeta(response.data.comments),
  };
}

export const postService = {
  async getPosts(url?: string, sort: PostSort = "recent"): Promise<PostsResponse> {
    try {
      const response = await apiClient.get<ApiPostsEnvelope>(
        url?.startsWith("http") ? url : buildSortedUrl("posts", sort),
      );

      return {
        posts: response.data.data.map(mapPostSummary),
        meta: toPostsMeta(response.data.meta),
        links: toPostsLinks(response.data.links),
      };
    } catch (error: unknown) {
      throw normalizeApiError(error, "Falha ao carregar posts.");
    }
  },

  async createPost(data: CreatePostPayload): Promise<ApiResult<unknown>> {
    try {
      const contents = data.contents.map((content) => content.trim()).filter(Boolean);
      const payload =
        contents.length === 1
          ? { title: data.title, content: contents[0], contents }
          : { title: data.title, contents };

      const response = await apiClient.post<ApiResult<unknown>>("posts", payload);
      return response.data;
    } catch (error: unknown) {
      throw normalizeApiError(error, "Erro ao fazer a publicação!");
    }
  },

  async createComment(data: CreateCommentPayload): Promise<ApiResult<unknown>> {
    try {
      const response = await apiClient.post<ApiResult<unknown>>(
        `posts/${data.post_id}/comments`,
        { description: data.description },
      );
      return response.data;
    } catch (error: unknown) {
      throw normalizeApiError(error, "Erro ao adicionar comentário!");
    }
  },

  async getPostComments(postId: string, url?: string, sort: PostSort = "recent") {
    try {
      const response = await apiClient.get<ApiCommentsEnvelope>(
        url?.startsWith("http") ? url : buildSortedUrl(`posts/${postId}/comments`, sort),
      );
      return extractCommentsResponse(response.data, postId);
    } catch (error: unknown) {
      throw normalizeApiError(error, "Falha ao carregar comentários.");
    }
  },

  async getUserPosts(
    userId: string,
    url?: string,
    sort: PostSort = "recent",
  ): Promise<UserPostsResponse> {
    try {
      const response = await apiClient.get<ApiPostsEnvelope>(
        url?.startsWith("http") ? url : buildSortedUrl(`users/${userId}/posts`, sort),
      );

      return {
        posts: response.data.data.map((post) => ({
          id: post.id,
          title: post.title,
          content: post.content ?? "",
          createdAt: post.created_at ?? "",
          updatedAt: post.updated_at ?? post.created_at ?? "",
        })),
        meta: toPostsMeta(response.data.meta),
        links: toPostsLinks(response.data.links),
      };
    } catch (error: unknown) {
      throw normalizeApiError(error, "Falha ao carregar posts do usuário.");
    }
  },

  async deletePost(postId: string): Promise<ApiResult<null>> {
    try {
      const response = await apiClient.delete<ApiResult<null>>(`posts/${postId}`);
      return response.data;
    } catch (error: unknown) {
      throw normalizeApiError(error, "Erro ao apagar post!");
    }
  },

  async deleteComment(commentId: string): Promise<ApiResult<null>> {
    try {
      const response = await apiClient.delete<ApiResult<null>>(`comments/${commentId}`);
      return response.data;
    } catch (error: unknown) {
      throw normalizeApiError(error, "Erro ao apagar comentário!");
    }
  },

  async reactToPost(postId: string, type: ReactionType): Promise<ApiResult<ApiReactionSummary>> {
    try {
      const response = await apiClient.post<ApiResult<ApiReactionSummary>>(
        `posts/${postId}/reactions`,
        { type },
      );
      return response.data;
    } catch (error: unknown) {
      throw normalizeApiError(error, "Erro ao reagir ao post!");
    }
  },

  async removeReaction(postId: string): Promise<ApiResult<ApiReactionSummary>> {
    try {
      const response = await apiClient.delete<ApiResult<ApiReactionSummary>>(
        `posts/${postId}/reactions`,
      );
      return response.data;
    } catch (error: unknown) {
      throw normalizeApiError(error, "Erro ao remover reação!");
    }
  },

  async reactToComment(
    commentId: string,
    type: ReactionType,
  ): Promise<ApiResult<ApiReactionSummary>> {
    try {
      const response = await apiClient.post<ApiResult<ApiReactionSummary>>(
        `comments/${commentId}/reactions`,
        { type },
      );
      return response.data;
    } catch (error: unknown) {
      throw normalizeApiError(error, "Erro ao reagir ao comentário!");
    }
  },

  async removeCommentReaction(commentId: string): Promise<ApiResult<ApiReactionSummary>> {
    try {
      const response = await apiClient.delete<ApiResult<ApiReactionSummary>>(
        `comments/${commentId}/reactions`,
      );
      return response.data;
    } catch (error: unknown) {
      throw normalizeApiError(error, "Erro ao remover reação do comentário!");
    }
  },

  async getPostDetails(postId: string, url?: string): Promise<PostDetailsResponse> {
    try {
      const response = await apiClient.get<ApiPostDetailsEnvelope>(
        url?.startsWith("http") ? url : `posts/${postId}`,
      );
      const post = response.data.data;

      return {
        post: {
          id: post.id,
          title: post.title,
          contents: extractContents(post),
          userId: String(post.user_id ?? post.user?.id ?? ""),
          likesCount: toNumber(post.likes_count),
          dislikesCount: toNumber(post.dislikes_count),
          myReaction: post.my_reaction ?? null,
        },
        comments: [],
        commentsMeta: mapCommentsMeta(),
      };
    } catch (error: unknown) {
      throw normalizeApiError(error, "Falha ao carregar detalhes do post.");
    }
  },
};
