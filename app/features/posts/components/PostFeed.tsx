import { useEffect } from "react";
import { toast } from "react-toastify";
import { usePosts } from "~/features/posts/hooks/usePosts";

interface PostFeedProps {
  maxPosts?: number;
}

export function PostFeed({ maxPosts }: PostFeedProps) {
  const { posts, meta, links, loading, error, reloadPosts } = usePosts({ maxPosts });

  useEffect(() => {
    if (error) {
      toast.error("Falha ao carregar posts");
    }
  }, [error]);

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
          <h3 className="mb-2 font-medium text-red-700">Erro ao carregar posts</h3>
          <p className="mb-4 text-sm text-red-600">{error}</p>
          <button
            onClick={() => reloadPosts()}
            className="rounded bg-red-100 px-4 py-2 font-medium text-red-700 transition-colors hover:bg-red-200"
          >
            Tentar novamente
          </button>
        </div>
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="mx-auto mt-8 max-w-2xl px-4 py-12 text-center">
        <h3 className="mb-2 text-lg font-medium text-gray-700 dark:text-gray-200">
          Nenhum post disponivel
        </h3>
        <p className="text-gray-500">Nao ha posts para exibir no momento.</p>
      </div>
    );
  }

  return (
    <div className="mx-auto mt-8 max-w-2xl px-4">
      <div className="space-y-8">
        {posts.map((post) => (
          <article
            key={post.id}
            className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-lg transition-all duration-300 hover:shadow-xl dark:border-gray-700 dark:bg-gray-800"
          >
            <div className="p-6">
              <div className="mb-5 flex justify-between">
                <div className="flex items-center gap-3">
                  <span className="rounded-full bg-indigo-50 px-3 py-1 text-sm text-indigo-700">
                    Post
                  </span>
                  <span className="text-sm text-gray-500">{post.userName}</span>
                </div>
              </div>

              <h3 className="mb-4 text-xl font-bold text-gray-800 dark:text-white">
                {post.title}
              </h3>

              <p className="text-gray-600 dark:text-gray-300">{post.body}</p>
            </div>
          </article>
        ))}
      </div>

      {meta && (
        <div className="mt-12">
          <div className="flex flex-col items-center justify-between gap-4 rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800 sm:flex-row">
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Pagina <span className="font-semibold text-gray-800 dark:text-white">{meta.current_page}</span>
              {" "}de{" "}
              <span className="font-semibold text-gray-800 dark:text-white">{meta.last_page}</span>
              {" "}Total: <span className="font-semibold">{meta.total}</span> posts
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => reloadPosts(links?.prev || undefined)}
                disabled={!links?.prev}
                className="rounded-lg border border-gray-200 bg-gray-50 px-4 py-2 text-gray-700 transition-all disabled:cursor-not-allowed disabled:opacity-40 hover:bg-gray-100 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
              >
                Anterior
              </button>

              <div className="rounded-lg bg-indigo-50 px-3 py-2 text-sm font-medium text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300">
                {meta.current_page}
              </div>

              <button
                onClick={() => reloadPosts(links?.next || undefined)}
                disabled={!links?.next}
                className="rounded-lg bg-indigo-600 px-4 py-2 font-medium text-white transition-all disabled:cursor-not-allowed disabled:opacity-40 hover:bg-indigo-700"
              >
                Proximo
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
