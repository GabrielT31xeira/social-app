import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import authService from "~/features/auth/auth-service";
import { PostCommentModal } from "~/features/posts/components/PostCommentModal";
import { postService } from "~/features/posts/post-service";
import type { PostDetails, PostDetailsModalProps, PostComment, CommentsMeta } from "~/features/posts/types";

export function PostDetailsModal({ isOpen, postId, onClose }: PostDetailsModalProps) {
  const { t } = useTranslation();
  const [post, setPost] = useState<PostDetails | null>(null);
  const [comments, setComments] = useState<PostComment[]>([]);
  const [commentsMeta, setCommentsMeta] = useState<CommentsMeta | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isCommentModalOpen, setIsCommentModalOpen] = useState(false);
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
              className="text-2xl font-bold text-white/80 transition-colors hover:text-white"
            >
              &times;
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
                className="rounded bg-red-100 px-4 py-2 font-medium text-red-700 transition-colors hover:bg-red-200"
              >
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
                  {user && (
                    <button
                      onClick={() => setIsCommentModalOpen(true)}
                      className="rounded-lg border border-indigo-200 px-4 py-2 text-sm font-medium text-indigo-700 transition-colors hover:bg-indigo-50 dark:border-indigo-700 dark:text-indigo-300 dark:hover:bg-indigo-900/30"
                    >
                      {t("post.comments.add")}
                    </button>
                  )}
                </div>

                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{post.title}</h3>
                <p className="whitespace-pre-wrap text-gray-700 dark:text-gray-300">{post.content}</p>
              </section>

              <section className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
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
                          <span className="font-medium text-gray-800 dark:text-gray-200">
                            {comment.userName}
                          </span>
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            {new Date(comment.createdAt).toLocaleString()}
                          </span>
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
                      className="rounded-lg border border-gray-200 bg-gray-50 px-4 py-2 text-gray-700 transition-all disabled:cursor-not-allowed disabled:opacity-40 hover:bg-gray-100 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
                    >
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
                      className="rounded-lg bg-indigo-600 px-4 py-2 font-medium text-white transition-all disabled:cursor-not-allowed disabled:opacity-40 hover:bg-indigo-700"
                    >
                      {t("common.next")}
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
    </div>
  );
}
