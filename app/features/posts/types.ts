export interface PostModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreated?: () => void;
}

export interface Post {
  id: string;
  title: string;
  body: string;
  userId: string;
  userName: string;
}

export interface CreatePostPayload {
  title: string;
  content: string;
  type_id: number;
}

export interface PostsMeta {
  current_page: number;
  last_page: number;
  total: number;
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

