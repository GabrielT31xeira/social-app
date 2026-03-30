export interface PostModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreated?: () => void;
}

export type PostSort = "recent" | "best_rated" | "worst_rated";

export interface Post {
  id: string;
  title: string;
  body: string;
  userId: string;
  userName: string;
  commentsCount: number;
  likesCount: number;
  dislikesCount: number;
  myReaction: "like" | "dislike" | null;
}

export interface CreatePostPayload {
  title: string;
  contents: string[];
}

export interface CommentModalProps {
  isOpen: boolean;
  postId: string | null;
  onClose: () => void;
  onCreated?: () => void;
}

export interface CreateCommentPayload {
  description: string;
  post_id: string;
}

export interface PostDetailsModalProps {
  isOpen: boolean;
  postId: string | null;
  onClose: () => void;
}

export interface PostComment {
  id: string;
  description: string;
  userId: string;
  postId: string;
  createdAt: string;
  updatedAt: string;
  userName: string;
  likesCount: number;
  dislikesCount: number;
  myReaction: "like" | "dislike" | null;
}

export interface CommentsMeta {
  current_page: number;
  last_page: number;
  total: number;
  next_page_url: string | null;
  prev_page_url: string | null;
}

export interface PostDetails {
  id: string;
  title: string;
  contents: string[];
  userId: string;
  likesCount: number;
  dislikesCount: number;
  myReaction: "like" | "dislike" | null;
}

export interface PostDetailsResponse {
  post: PostDetails;
  comments: PostComment[];
  commentsMeta: CommentsMeta;
}

export interface PostsMeta {
  current_page: number;
  last_page: number;
  total: number;
  per_page?: number;
}

export interface PostsLinks {
  prev: string | null;
  next: string | null;
}

export interface PostsResponse {
  posts: Post[];
  meta: PostsMeta | null;
  links: PostsLinks | null;
}

export interface UserPostsResponse {
  posts: Array<{
    id: string;
    title: string;
    content: string;
    createdAt: string;
    updatedAt: string;
  }>;
  meta: PostsMeta | null;
  links: PostsLinks | null;
}
