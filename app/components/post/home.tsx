import {useEffect, useState} from 'react';
import {toast} from 'react-hot-toast';
import {postService} from '~/services/post/postService';
import type {GetPosts} from '~/services/post/postService';

interface PostListProps {
    maxPosts?: number;
}

export default function PostList({ maxPosts }: PostListProps) {
    const [posts, setPosts] = useState<GetPosts[]>([]);
    const [meta, setMeta] = useState<any>(null);
    const [links, setLinks] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const loadPosts = async (url?: string) => {
        setLoading(true);
        setError(null);

        try {
            const response = await postService.getPosts(url);

            const limitedPosts = maxPosts
                ? response.posts.slice(0, maxPosts)
                : response.posts;

            setPosts(limitedPosts);
            setMeta(response.meta);
            setLinks(response.links);

        } catch (err: any) {
            setError(err.message);
            toast.error('Falha ao carregar posts');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadPosts();
    }, []);

    if (loading) {
        return (
            <div className="mt-8 max-w-2xl mx-auto px-4">
                <div className="space-y-6">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="animate-pulse">
                            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-3"></div>
                            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full mb-2"></div>
                            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6 mb-2"></div>
                            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-4/6"></div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="mt-8 max-w-2xl mx-auto px-4">
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6">
                    <div className="flex items-start gap-4">
                        <div className="text-red-500 mt-0.5 text-xl">⚠️</div>
                        <div className="flex-1">
                            <h3 className="font-medium text-red-700 mb-2">
                                Erro ao carregar posts
                            </h3>
                            <p className="text-red-600 text-sm mb-4">
                                {error}
                            </p>
                            <button
                                onClick={() => loadPosts()}
                                className="px-4 py-2 bg-red-100 hover:bg-red-200 text-red-700 rounded font-medium transition-colors"
                            >
                                Tentar novamente
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (posts.length === 0) {
        return (
            <div className="mt-8 max-w-2xl mx-auto px-4 text-center py-12">
                <div className="text-5xl mb-4">📭</div>
                <h3 className="text-lg font-medium text-gray-700 mb-2">
                    Nenhum post disponível
                </h3>
                <p className="text-gray-500">
                    Não há posts para exibir no momento
                </p>
            </div>
        );
    }

    return (
        <div className="mt-8 max-w-2xl mx-auto px-4">
            <div className="space-y-8">
                {posts.map((post) => (
                    <article
                        key={post.id}
                        className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden"
                    >
                        <div className="p-6">
                            <div className="flex justify-between mb-5">
                                <div className="flex items-center gap-3">
                                    <span className="px-3 py-1 rounded-full text-sm bg-indigo-50 text-indigo-700">
                                        Post
                                    </span>
                                    <span className="text-sm text-gray-500">
                                        {post.userName}
                                    </span>
                                </div>
                            </div>

                            <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
                                {post.title}
                            </h3>

                            <p className="text-gray-600 dark:text-gray-300 mb-6">
                                {post.body}
                            </p>
                        </div>
                    </article>
                ))}
            </div>

            {/* PAGINAÇÃO */}
            {meta && (
                <div className="mt-12">
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm">

                        {/* Info */}
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                            Página <span className="font-semibold text-gray-800 dark:text-white">{meta.current_page}</span>
                            {' '}de{' '}
                            <span className="font-semibold text-gray-800 dark:text-white">{meta.last_page}</span>
                            {' '}• Total:{' '}
                            <span className="font-semibold">{meta.total}</span> posts
                        </div>

                        {/* Botões */}
                        <div className="flex items-center gap-2">

                            {/* Anterior */}
                            <button
                                onClick={() => loadPosts(links.prev)}
                                disabled={!links?.prev}
                                className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                            >
                                <span>←</span>
                                <span className="hidden sm:inline">Anterior</span>
                            </button>

                            {/* Indicador da página atual */}
                            <div className="px-3 py-2 text-sm font-medium rounded-lg bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300">
                                {meta.current_page}
                            </div>

                            {/* Próximo */}
                            <button
                                onClick={() => loadPosts(links.next)}
                                disabled={!links?.next}
                                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-medium transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                            >
                                <span className="hidden sm:inline">Próximo</span>
                                <span>→</span>
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}