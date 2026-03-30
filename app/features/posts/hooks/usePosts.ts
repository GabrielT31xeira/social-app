import { useCallback, useEffect, useState } from "react";
import { postService } from "~/features/posts/post-service";
import type { Post, PostsLinks, PostsMeta, PostSort } from "~/features/posts/types";

interface UsePostsOptions {
  maxPosts?: number;
  reloadKey?: number;
  sort?: PostSort;
}

export function usePosts({ maxPosts, reloadKey = 0, sort = "recent" }: UsePostsOptions = {}) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [meta, setMeta] = useState<PostsMeta | null>(null);
  const [links, setLinks] = useState<PostsLinks | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadPosts = useCallback(async (url?: string) => {
    setLoading(true);
    setError(null);

    try {
      const response = await postService.getPosts(url, sort);
      setPosts(maxPosts ? response.posts.slice(0, maxPosts) : response.posts);
      setMeta(response.meta);
      setLinks(response.links);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [maxPosts, sort]);

  useEffect(() => {
    loadPosts();
  }, [loadPosts, reloadKey]);

  const updatePost = useCallback((postId: string, updater: (post: Post) => Post) => {
    setPosts((currentPosts) =>
      currentPosts.map((post) => (post.id === postId ? updater(post) : post)),
    );
  }, []);

  return {
    posts,
    meta,
    links,
    loading,
    error,
    reloadPosts: loadPosts,
    updatePost,
  };
}
