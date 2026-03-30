import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import authService from "~/features/auth/auth-service";
import { CommentDeleteConfirmModal } from "~/features/posts/components/CommentDeleteConfirmModal";
import { PostCommentModal } from "~/features/posts/components/PostCommentModal";
import { postService } from "~/features/posts/post-service";
import type { PostDetails, PostDetailsModalProps, PostComment, CommentsMeta } from "~/features/posts/types";
import { Icon } from "~/shared/components/Icons";

export function PostDetailsModal({ isOpen, postId, onClose }: PostDetailsModalProps) {
  const { t } = useTranslation();
  const [post, setPost] = useState<PostDetails | null>(null);
  const [comments, setComments] = useState<PostComment[]>([]);
  const [commentsMeta, setCommentsMeta] = useState<CommentsMeta | null>(null);
  const [currentContentIndex, setCurrentContentIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isCommentModalOpen, setIsCommentModalOpen] = useState(false);
  const [commentPendingDelete, setCommentPendingDelete] = useState<string | null>(null);
  const user = authService.getUser();

  const loadPostDetails = async (url?: string) => {
    if (!postId) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await postService.getPostDetails(postId, url);
      setPost(response.post);
      setComments(response.comments);
      setCommentsMeta(response.commentsMeta);
      setCurrentContentIndex(0);
    } catch (err: any) {
      setError(err.message);
      toast.error(t("post.details.loadErrorToast"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && postId) {
      void loadPostDetails();
    }
  }, [isOpen, postId]);

  const canDeleteComment = (comment: PostComment) => {
    if (!user || !post) {
      return false;
    }

    const currentUserId = String(user.id);
    return currentUserId === String(comment.userId) || currentUserId === String(post.userId);
  };

  const handleOpenDeleteCommentModal = (comment: PostComment) => {
    if (!canDeleteComment(comment)) {
      return;
    }

    setCommentPendingDelete(comment.id);
  };

  const handleReaction = async (nextReaction: "like" | "dislike") => {
    if (!user || !post) {
      return;
    }

    const result =
      post.myReaction === nextReaction
        ? await postService.removeReaction(post.id)
        : await postService.reactToPost(post.id, nextReaction);

    if (!result.success) {
      toast.error(result.message || t("post.reaction.error"));
      return;
    }

    setPost((current) =>
      current
        ? {
            ...current,
            likesCount: Number(result.data?.likes_count ?? current.likesCount),
            dislikesCount: Number(result.data?.dislikes_count ?? current.dislikesCount),
            myReaction: result.data?.my_reaction ?? null,
          }
        : current,
    );
  };

  if (!isOpen || !postId) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      <div className="relative z-10 mx-4 max-h-[90vh] w-full max-w-2xl overflow-hidden rounded-2xl bg-white shadow-2xl dark:bg-gray-800">
        <div className="app-card-header p-6 text-white">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">{t("post.details.title")}</h2>
            <button
              onClick={onClose}
              className="text-white/80 transition-colors hover:text-white"
            >
              <Icon name="x" className="h-6 w-6" />
            </button>
          </div>
          <p className="mt-2 opacity-90">{t("post.details.subtitle")}</p>
        </div>

        <div className="max-h-[calc(90vh-96px)] overflow-y-auto p-6">
          {loading && (
            <div className="space-y-4">
              <div className="h-8 w-2/3 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
              <div className="h-4 w-full animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
              <div className="h-4 w-5/6 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
            </div>
          )}

          {error && !loading && (
            <div className="rounded-lg border border-red-200 bg-red-50 p-6 dark:border-red-800 dark:bg-red-900/20">
              <h3 className="mb-2 font-medium text-red-700">{t("post.details.loadErrorTitle")}</h3>
              <p className="mb-4 text-sm text-red-600">{error}</p>
              <button
                onClick={() => void loadPostDetails()}
                className="inline-flex items-center gap-2 rounded bg-red-100 px-4 py-2 font-medium text-red-700 transition-colors hover:bg-red-200"
              >
                <Icon name="alertTriangle" className="h-4 w-4" />
                {t("common.retry")}
              </button>
            </div>
          )}

          {!loading && !error && post && (
            <div className="space-y-8">
              <section className="space-y-3">
                <div className="flex items-center justify-between gap-4">
                  <span className="rounded-full bg-indigo-50 px-3 py-1 text-sm text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300">
                    {t("post.feed.badge")}
                  </span>
                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      onClick={() => void handleReaction("like")}
                      disabled={!user}
                      className={`inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${
                        post.myReaction === "like"
                          ? "border-emerald-300 bg-emerald-50 text-emerald-700 dark:border-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300"
                          : "border-gray-200 text-gray-600 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-900/30"
                      }`}
                    >
                      <Icon name="thumbsUp" className="h-4 w-4" />
                      {post.likesCount}
                    </button>
                    <button
                      type="button"
                      onClick={() => void handleReaction("dislike")}
                      disabled={!user}
                      className={`inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${
                        post.myReaction === "dislike"
                          ? "border-rose-300 bg-rose-50 text-rose-700 dark:border-rose-700 dark:bg-rose-900/30 dark:text-rose-300"
                          : "border-gray-200 text-gray-600 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-900/30"
                      }`}
                    >
                      <Icon name="thumbsDown" className="h-4 w-4" />
                      {post.dislikesCount}
                    </button>
                    {user && (
                      <button
                        onClick={() => setIsCommentModalOpen(true)}
                        className="inline-flex items-center gap-2 rounded-lg border border-indigo-200 px-4 py-2 text-sm font-medium text-indigo-700 transition-colors hover:bg-indigo-50 dark:border-indigo-700 dark:text-indigo-300 dark:hover:bg-indigo-900/30"
                      >
                        <Icon name="messageCircle" className="h-4 w-4" />
                        {t("post.comments.add")}
                      </button>
                    )}
                  </div>
                </div>

                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{post.title}</h3>
                <div className="space-y-4">
                  {post.contents.length === 0 ? (
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {t("post.details.emptyContent")}
                    </p>
                  ) : (
                    <div className="rounded-xl border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-900/30">
                      <div className="mb-4 flex items-center justify-between gap-4">
                        <button
                          type="button"
                          onClick={() =>
                            setCurrentContentIndex((current) => Math.max(current - 1, 0))
                          }
                          disabled={currentContentIndex === 0}
                          className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-700 transition-colors disabled:cursor-not-allowed disabled:opacity-40 hover:bg-gray-100 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                        >
                          <Icon name="chevronLeft" className="h-4 w-4" />
                          {t("common.previous")}
                        </button>

                        <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                          {t("post.details.blockLabel", { index: currentContentIndex + 1 })}
                        </p>

                        <button
                          type="button"
                          onClick={() =>
                            setCurrentContentIndex((current) =>
                              Math.min(current + 1, post.contents.length - 1),
                            )
                          }
                          disabled={currentContentIndex === post.contents.length - 1}
                          className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-700 transition-colors disabled:cursor-not-allowed disabled:opacity-40 hover:bg-gray-100 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                        >
                          {t("common.next")}
                          <Icon name="chevronRight" className="h-4 w-4" />
                        </button>
                      </div>

                      <p className="whitespace-pre-wrap text-gray-700 dark:text-gray-300">
                        {post.contents[currentContentIndex]}
                      </p>
                    </div>
                  )}
                </div>
              </section>

              <section className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="inline-flex items-center gap-2 text-lg font-semibold text-gray-900 dark:text-white">
                    <Icon name="messageCircle" className="h-5 w-5" />
                    {t("post.details.commentsTitle")}
                  </h4>
                  {commentsMeta && (
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {t("post.details.commentsCount", { total: commentsMeta.total })}
                    </span>
                  )}
                </div>

                {comments.length === 0 ? (
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {t("post.details.emptyComments")}
                  </p>
                ) : (
                  <div className="space-y-3">
                    {comments.map((comment) => (
                      <article
                        key={comment.id}
                        className="rounded-xl border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-900/30"
                      >
                        <div className="mb-2 flex items-center justify-between gap-3">
                          <div className="flex flex-col gap-1">
                            <span className="font-medium text-gray-800 dark:text-gray-200">
                              {comment.userName}
                            </span>
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              {new Date(comment.createdAt).toLocaleString()}
                            </span>
                          </div>
                          {canDeleteComment(comment) && (
                            <button
                              onClick={() => handleOpenDeleteCommentModal(comment)}
                              className="inline-flex items-center gap-2 rounded-lg border border-red-200 px-3 py-2 text-xs font-medium text-red-700 transition-colors hover:bg-red-50 dark:border-red-800 dark:text-red-300 dark:hover:bg-red-900/30"
                            >
                              <Icon name="trash" className="h-4 w-4" />
                              {t("post.comments.delete.trigger")}
                            </button>
                          )}
                        </div>
                        <p className="text-sm text-gray-700 dark:text-gray-300">
                          {comment.description}
                        </p>
                      </article>
                    ))}
                  </div>
                )}

                {commentsMeta && commentsMeta.last_page > 1 && (
                  <div className="flex items-center justify-between gap-4 border-t border-gray-200 pt-4 dark:border-gray-700">
                    <button
                      onClick={() => void loadPostDetails(commentsMeta.prev_page_url || undefined)}
                      disabled={!commentsMeta.prev_page_url}
                      className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 px-4 py-2 text-gray-700 transition-all disabled:cursor-not-allowed disabled:opacity-40 hover:bg-gray-100 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
                    >
                      <Icon name="chevronLeft" className="h-4 w-4" />
                      {t("common.previous")}
                    </button>

                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {t("post.details.pagination", {
                        currentPage: commentsMeta.current_page,
                        lastPage: commentsMeta.last_page,
                      })}
                    </span>

                    <button
                      onClick={() => void loadPostDetails(commentsMeta.next_page_url || undefined)}
                      disabled={!commentsMeta.next_page_url}
                      className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 font-medium text-white transition-all disabled:cursor-not-allowed disabled:opacity-40 hover:bg-indigo-700"
                    >
                      {t("common.next")}
                      <Icon name="chevronRight" className="h-4 w-4" />
                    </button>
                  </div>
                )}
              </section>
            </div>
          )}
        </div>
      </div>

      <PostCommentModal
        isOpen={isCommentModalOpen}
        postId={postId}
        onClose={() => setIsCommentModalOpen(false)}
        onCreated={() => void loadPostDetails()}
      />

      <CommentDeleteConfirmModal
        isOpen={commentPendingDelete !== null}
        commentId={commentPendingDelete}
        onClose={() => setCommentPendingDelete(null)}
        onDeleted={() => {
          setCommentPendingDelete(null);
          void loadPostDetails();
        }}
      />
    </div>
  );
}
