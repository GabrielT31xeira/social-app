import { type MouseEvent, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router";
import { toast } from "react-toastify";
import { useAuth } from "~/features/auth/AuthProvider";
import { PostDeleteConfirmModal } from "~/features/posts/components/PostDeleteConfirmModal";
import { PostDetailsModal } from "~/features/posts/components/PostDetailsModal";
import { PostSortSelect } from "~/features/posts/components/PostSortSelect";
import { usePosts } from "~/features/posts/hooks/usePosts";
import { postService } from "~/features/posts/post-service";
import type { PostSort } from "~/features/posts/types";
import { Icon } from "~/shared/components/Icons";
import { PaginationControls } from "~/shared/components/PaginationControls";

interface PostFeedProps {
  maxPosts?: number;
  reloadKey?: number;
}

export function PostFeed({ maxPosts, reloadKey = 0 }: PostFeedProps) {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [sort, setSort] = useState<PostSort>("recent");
  const { posts, meta, links, loading, error, reloadPosts, updatePost } = usePosts({
    maxPosts,
    reloadKey,
    sort,
  });
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);
  const [postPendingDelete, setPostPendingDelete] = useState<{ id: string; title: string } | null>(
    null,
  );
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

  const handleReaction = async (
    event: MouseEvent<HTMLButtonElement>,
    postId: string,
    currentReaction: "like" | "dislike" | null,
    nextReaction: "like" | "dislike",
  ) => {
    event.stopPropagation();

    if (!user) {
      return;
    }

    const result =
      currentReaction === nextReaction
        ? await postService.removeReaction(postId)
        : await postService.reactToPost(postId, nextReaction);

    if (!result.success) {
      toast.error(result.message || t("post.reaction.error"));
      return;
    }

    updatePost(postId, (post) => ({
      ...post,
      likesCount: Number(result.data?.likes_count ?? post.likesCount),
      dislikesCount: Number(result.data?.dislikes_count ?? post.dislikesCount),
      myReaction: result.data?.my_reaction ?? null,
    }));
  };

  useEffect(() => {
    if (error) {
      toast.error(t("post.feed.loadErrorToast"));
    }
  }, [error, t]);

  const handleOpenDetailsModal = (postId: string) => {
    setSelectedPostId(postId);
    setIsDetailsModalOpen(true);
  };

  const handleCloseDetailsModal = () => {
    setIsDetailsModalOpen(false);
    setSelectedPostId(null);
  };

  const handleOpenDeleteModal = (postId: string, postTitle: string) => {
    const postOwner = posts.find((post) => post.id === postId)?.userId;

    if (!user || !postOwner || String(user.id) !== String(postOwner)) {
      return;
    }

    setPostPendingDelete({ id: postId, title: postTitle });
  };

  const handleCloseDeleteModal = () => {
    setPostPendingDelete(null);
  };

  if (loading) {
    return (
      <div className="mx-auto mt-8 max-w-2xl px-4">
        <div className="space-y-6">
          {[1, 2, 3, 4].map((item) => (
            <div key={item} className="animate-pulse">
              <div className="mb-3 h-6 w-3/4 rounded bg-gray-200 dark:bg-gray-700" />
              <div className="mb-2 h-4 w-full rounded bg-gray-200 dark:bg-gray-700" />
              <div className="mb-2 h-4 w-5/6 rounded bg-gray-200 dark:bg-gray-700" />
              <div className="h-4 w-4/6 rounded bg-gray-200 dark:bg-gray-700" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto mt-8 max-w-2xl px-4">
        <div className="rounded-lg border border-red-200 bg-red-50 p-6 dark:border-red-800 dark:bg-red-900/20">
          <h3 className="mb-2 font-medium text-red-700">{t("post.feed.loadErrorTitle")}</h3>
          <p className="mb-4 text-sm text-red-600">{error}</p>
          <button
            onClick={() => reloadPosts()}
            className="inline-flex items-center gap-2 rounded bg-red-100 px-4 py-2 font-medium text-red-700 transition-colors hover:bg-red-200"
          >
            <Icon name="alertTriangle" className="h-4 w-4" />
            {t("common.retry")}
          </button>
        </div>
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="mx-auto mt-8 max-w-2xl px-4 py-12 text-center">
        <h3 className="mb-2 text-lg font-medium text-gray-700 dark:text-gray-200">
          {t("post.feed.emptyTitle")}
        </h3>
        <p className="text-gray-500">{t("post.feed.emptyDescription")}</p>
      </div>
    );
  }

  return (
    <div className="mx-auto mt-8 max-w-2xl px-4">
      <div className="mb-6 flex justify-end">
        <PostSortSelect value={sort} onChange={setSort} />
      </div>

      <div className="space-y-8">
        {posts.map((post) => (
          <article
            key={post.id}
            className="cursor-pointer overflow-hidden rounded-xl border border-gray-200 bg-white shadow-lg transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl dark:border-gray-700 dark:bg-gray-800"
            onClick={() => handleOpenDetailsModal(post.id)}
          >
            <div className="p-6">
              <div className="mb-5 flex justify-between">
                <div className="flex items-center gap-3">
                  <span className="rounded-full bg-indigo-50 px-3 py-1 text-sm text-indigo-700">
                    {t("post.feed.badge")}
                  </span>
                  <Link
                    to={`/users/${post.userId}/posts`}
                    state={{ userName: post.userName }}
                    onClick={(event) => event.stopPropagation()}
                    className="text-sm text-gray-500 transition-colors hover:text-indigo-600 hover:underline dark:hover:text-indigo-300"
                  >
                    {post.userName}
                  </Link>
                </div>
                <span className="inline-flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
                  <Icon name="messageCircle" className="h-4 w-4" />
                  {t("post.feed.commentsCount", { count: post.commentsCount })}
                </span>
              </div>

              <h3 className="mb-4 text-xl font-bold text-gray-800 dark:text-white">
                {post.title}
              </h3>

              <p className="mb-6 text-gray-600 dark:text-gray-300">{post.body}</p>

              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <button
                    onClick={(event) => void handleReaction(event, post.id, post.myReaction, "like")}
                    className={`inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium transition-colors ${
                      post.myReaction === "like"
                        ? "border-emerald-300 bg-emerald-50 text-emerald-700 dark:border-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300"
                        : "border-gray-200 text-gray-600 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-900/30"
                    }`}
                  >
                    <Icon name="thumbsUp" className="h-4 w-4" />
                    {post.likesCount}
                  </button>
                  <button
                    onClick={(event) =>
                      void handleReaction(event, post.id, post.myReaction, "dislike")
                    }
                    className={`inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium transition-colors ${
                      post.myReaction === "dislike"
                        ? "border-rose-300 bg-rose-50 text-rose-700 dark:border-rose-700 dark:bg-rose-900/30 dark:text-rose-300"
                        : "border-gray-200 text-gray-600 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-900/30"
                    }`}
                  >
                    <Icon name="thumbsDown" className="h-4 w-4" />
                    {post.dislikesCount}
                  </button>
                </div>

                <div className="flex justify-end gap-3">
                {user && String(user.id) === String(post.userId) && (
                  <button
                    onClick={(event) => {
                      event.stopPropagation();
                      handleOpenDeleteModal(post.id, post.title);
                    }}
                    className="inline-flex items-center gap-2 rounded-lg border border-red-200 px-4 py-2 text-sm font-medium text-red-700 transition-colors hover:bg-red-50 dark:border-red-800 dark:text-red-300 dark:hover:bg-red-900/30"
                  >
                    <Icon name="trash" className="h-4 w-4" />
                    {t("post.delete.trigger")}
                  </button>
                )}
                <button
                  onClick={(event) => {
                    event.stopPropagation();
                    handleOpenDetailsModal(post.id);
                  }}
                  className="inline-flex items-center gap-2 rounded-lg border border-indigo-200 px-4 py-2 text-sm font-medium text-indigo-700 transition-colors hover:bg-indigo-50 dark:border-indigo-700 dark:text-indigo-300 dark:hover:bg-indigo-900/30"
                >
                  <Icon name="eye" className="h-4 w-4" />
                  {t("post.feed.openDetails")}
                </button>
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>

      <PostDetailsModal
        isOpen={isDetailsModalOpen}
        postId={selectedPostId}
        onClose={handleCloseDetailsModal}
      />

      <PostDeleteConfirmModal
        isOpen={postPendingDelete !== null}
        postId={postPendingDelete?.id ?? null}
        postTitle={postPendingDelete?.title}
        onClose={handleCloseDeleteModal}
        onDeleted={() => void reloadPosts()}
      />

      {meta && (
        <div className="mt-12">
          <PaginationControls
            currentPage={meta.current_page}
            summary={t("post.feed.pagination", {
              currentPage: meta.current_page,
              lastPage: meta.last_page,
              total: meta.total,
            })}
            hasPrevious={Boolean(links?.prev)}
            hasNext={Boolean(links?.next)}
            onPrevious={() => void reloadPosts(links?.prev || undefined)}
            onNext={() => void reloadPosts(links?.next || undefined)}
          />
        </div>
      )}
    </div>
  );
}
