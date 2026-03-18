import {useEffect, useState} from 'react';
import {toast} from 'react-hot-toast';
import PostService from '~/services/post/postService';
import type {GetPosts} from '~/services/post/postService';

interface PostListProps {
    maxPosts?: number;
}

export default function PostList({
                                     maxPosts,
                                 }: PostListProps) {
    const [posts, setPosts] = useState<GetPosts[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const loadPosts = async () => {
        setLoading(true);
        setError(null);

        try {
            const allPosts = await PostService.getPosts();
            const limitedPosts = maxPosts ? allPosts.slice(0, maxPosts) : allPosts;
            setPosts(limitedPosts);
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
                        <div className="text-red-500 dark:text-red-400 mt-0.5 text-xl">⚠️</div>
                        <div className="flex-1">
                            <h3 className="font-medium text-red-700 dark:text-red-300 mb-2">
                                Erro ao carregar posts
                            </h3>
                            <p className="text-red-600 dark:text-red-400 text-sm mb-4">
                                {error}
                            </p>
                            <button
                                onClick={loadPosts}
                                className="px-4 py-2 bg-red-100 dark:bg-red-800 hover:bg-red-200 dark:hover:bg-red-700 text-red-700 dark:text-red-300 rounded font-medium transition-colors"
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
                <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Nenhum post disponível
                </h3>
                <p className="text-gray-500 dark:text-gray-400">
                    Não há posts para exibir no momento
                </p>
            </div>
        );
    }

    return (
        <div className="mt-8 max-w-2xl mx-auto px-4">
            {/* LISTA EM UMA COLUNA - METADE DA TELA */}
            <div className="space-y-8">
                {posts.map((post) => (
                    <article
                        key={post.id}
                        className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden animate-slide-up"
                    >
                        <div className="p-6">
                            {/* Cabeçalho do post */}
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
                                <div className="flex items-center gap-3">
                                      <span
                                          className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300">
                                        Post #{post.id}
                                      </span>
                                    <span className="text-sm text-gray-500 dark:text-gray-400">
                                        Usuário {post.userId}
                                      </span>
                                </div>
                                <button
                                    className="text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 self-start sm:self-center">
                                    Ver detalhes
                                </button>
                            </div>

                            {/* Título */}
                            <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4 leading-tight">
                                {post.title}
                            </h3>

                            {/* Conteúdo */}
                            <div className="mb-6">
                                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                                    {post.body}
                                </p>
                            </div>

                            {/* Rodapé com ações */}
                            <div className="pt-5 border-t border-gray-100 dark:border-gray-700">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                    <div className="flex items-center gap-5">
                                        <button
                                            className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-300 transition-colors">
                                            <span className="text-lg">👍</span>
                                            <span className="text-sm">Gostei</span>
                                        </button>
                                        <button
                                            className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-300 transition-colors">
                                            <span className="text-lg">💬</span>
                                            <span className="text-sm">Comentar</span>
                                        </button>
                                        <button
                                            className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-300 transition-colors">
                                            <span className="text-lg">🔗</span>
                                            <span className="text-sm">Compartilhar</span>
                                        </button>
                                    </div>
                                    <button
                                        className="text-sm font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 transition-colors px-4 py-2 border border-indigo-200 dark:border-indigo-800 hover:border-indigo-300 dark:hover:border-indigo-600 rounded-lg">
                                        Ler completo →
                                    </button>
                                </div>
                            </div>
                        </div>
                    </article>
                ))}
            </div>

            {/* Contador de posts */}
            {maxPosts && posts.length >= maxPosts && (
                <div className="mt-10 pt-8 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                        <p className="text-gray-600 dark:text-gray-400">
                            Mostrando <span className="font-semibold">{posts.length}</span> posts
                            {maxPosts && <span> de {maxPosts}</span>}
                        </p>
                        <button
                            className="px-5 py-2.5 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg font-medium transition-colors">
                            Carregar mais posts
                        </button>
                    </div>
                </div>
            )}
            <style>{`
                @keyframes slide-up {
                    from {
                        opacity: 0;
                        transform: translateY(30px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                .animate-slide-up {
                    animation: slide-up 0.6s ease-out;
                }
                
                html.dark main {
                    background: linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%);
                }
            `}</style>
        </div>
    );
}