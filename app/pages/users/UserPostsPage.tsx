import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useLocation } from "react-router";
import { toast } from "react-toastify";
import { getReadableError } from "~/features/auth/auth-errors";
import { PostDetailsModal } from "~/features/posts/components/PostDetailsModal";
import { PostSortSelect } from "~/features/posts/components/PostSortSelect";
import { postService } from "~/features/posts/post-service";
import type { PostSort, PostsLinks, PostsMeta, UserPostsResponse } from "~/features/posts/types";
import { Icon } from "~/shared/components/Icons";
import { PaginationControls } from "~/shared/components/PaginationControls";

interface UserPostsPageProps {
  userId: string;
}

interface LocationState {
  userName?: string;
}

export function UserPostsPage({ userId }: UserPostsPageProps) {
  const { t } = useTranslation();
  const location = useLocation();
  const state = location.state as LocationState | null;
  const [posts, setPosts] = useState<UserPostsResponse["posts"]>([]);
  const [meta, setMeta] = useState<PostsMeta | null>(null);
  const [links, setLinks] = useState<PostsLinks | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [sort, setSort] = useState<PostSort>("recent");

  const loadPosts = async (url?: string) => {
    setLoading(true);
    setError(null);

    try {
      const response = await postService.getUserPosts(userId, url, sort);
      setPosts(response.posts);
      setMeta(response.meta);
      setLinks(response.links);
    } catch (err: unknown) {
      setError(getReadableError(err, t("userPosts.loadErrorTitle")));
      toast.error(t("userPosts.loadErrorToast"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadPosts();
  }, [sort, userId]);

  const openDetails = (postId: string) => {
    setSelectedPostId(postId);
    setIsDetailsModalOpen(true);
  };

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-10 dark:bg-slate-950">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <Link
              to="/home"
              className="mb-3 inline-flex items-center gap-2 text-sm font-medium text-indigo-600 hover:underline dark:text-indigo-300"
            >
              <Icon name="chevronLeft" className="h-4 w-4" />
              {t("userPosts.back")}
            </Link>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              {t("userPosts.title", { name: state?.userName || userId })}
            </h1>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              {t("userPosts.subtitle")}
            </p>
          </div>
          <PostSortSelect value={sort} onChange={setSort} />
        </div>

        {loading && (
          <div className="space-y-6">
            {[1, 2, 3].map((item) => (
              <div key={item} className="rounded-2xl bg-white p-6 shadow-sm dark:bg-gray-800">
                <div className="mb-4 h-6 w-1/2 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
                <div className="mb-2 h-4 w-full animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
                <div className="h-4 w-3/4 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
              </div>
            ))}
          </div>
        )}

        {!loading && error && (
          <div className="rounded-lg border border-red-200 bg-red-50 p-6 dark:border-red-800 dark:bg-red-900/20">
            <h3 className="mb-2 font-medium text-red-700">{t("userPosts.loadErrorTitle")}</h3>
            <p className="mb-4 text-sm text-red-600">{error}</p>
            <button
              onClick={() => void loadPosts()}
              className="inline-flex items-center gap-2 rounded bg-red-100 px-4 py-2 font-medium text-red-700 transition-colors hover:bg-red-200"
            >
              <Icon name="alertTriangle" className="h-4 w-4" />
              {t("common.retry")}
            </button>
          </div>
        )}

        {!loading && !error && posts.length === 0 && (
          <div className="rounded-2xl bg-white p-10 text-center shadow-sm dark:bg-gray-800">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              {t("userPosts.emptyTitle")}
            </h3>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              {t("userPosts.emptyDescription")}
            </p>
          </div>
        )}

        {!loading && !error && posts.length > 0 && (
          <div className="space-y-6">
            {posts.map((post) => (
              <article
                key={post.id}
                onClick={() => openDetails(post.id)}
                className="cursor-pointer rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-lg dark:border-gray-700 dark:bg-gray-800"
              >
                <div className="mb-4 flex items-center justify-between gap-4">
                  <span className="rounded-full bg-indigo-50 px-3 py-1 text-sm font-medium text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300">
                    {t("post.feed.badge")}
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {new Date(post.createdAt).toLocaleString()}
                  </span>
                </div>

                <h2 className="mb-3 text-2xl font-bold text-gray-900 dark:text-white">
                  {post.title}
                </h2>
                <p className="mb-5 text-gray-600 dark:text-gray-300">{post.content}</p>

                <button
                  onClick={(event) => {
                    event.stopPropagation();
                    openDetails(post.id);
                  }}
                  className="inline-flex items-center gap-2 rounded-lg border border-indigo-200 px-4 py-2 text-sm font-medium text-indigo-700 transition-colors hover:bg-indigo-50 dark:border-indigo-700 dark:text-indigo-300 dark:hover:bg-indigo-900/30"
                >
                  <Icon name="eye" className="h-4 w-4" />
                  {t("post.feed.openDetails")}
                </button>
              </article>
            ))}

            {meta && (
              <PaginationControls
                currentPage={meta.current_page}
                summary={t("post.feed.pagination", {
                  currentPage: meta.current_page,
                  lastPage: meta.last_page,
                  total: meta.total,
                })}
                hasPrevious={Boolean(links?.prev)}
                hasNext={Boolean(links?.next)}
                onPrevious={() => void loadPosts(links?.prev || undefined)}
                onNext={() => void loadPosts(links?.next || undefined)}
              />
            )}
          </div>
        )}
      </div>

      <PostDetailsModal
        isOpen={isDetailsModalOpen}
        postId={selectedPostId}
        onClose={() => {
          setIsDetailsModalOpen(false);
          setSelectedPostId(null);
        }}
      />
    </main>
  );
}
