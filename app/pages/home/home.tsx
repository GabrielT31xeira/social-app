import {useState} from 'react';
import {useTranslation} from 'react-i18next';
import {LanguageSwitcher} from '../../components/LanguageSwitcher';
import {ThemeSwitcher} from '../../components/ThemeSwitcher';
import PostCreate from '../../components/post/create';
import PostList from '../../components/post/home';

export default function Home() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const {t} = useTranslation();

    return (
        <main className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 dark:bg-slate-900">
            {/* Header */}
            <header className="bg-white dark:bg-gray-800 shadow-lg animate-slide-up">
                <div className="max-w-7xl mx-auto px-4 py-5">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div
                                className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-md">
                                <span className="text-white font-bold text-lg">T4</span>
                            </div>
                            <div>
                                <h1 className="font-bold text-gray-800 dark:text-white text-xl">Teixeir4 Blog</h1>
                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Posts em tempo real</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => setIsModalOpen(true)}
                                className="px-5 py-2.5 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-medium rounded-lg transition-all shadow-md hover:shadow-lg"
                            >
                                + Criar Post
                            </button>
                            <div className="flex gap-3">
                                <LanguageSwitcher/>
                                <ThemeSwitcher/>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            {/* Modal */}
            <PostCreate
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            />

            {/* Conteúdo principal - Posts ocupando metade da tela */}
            <PostList
                maxPosts={15}
            />

            {/* Footer */}
            <footer className="py-6 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 mt-12">
                <div className="max-w-2xl mx-auto px-4">
                    <div className="text-center">
                        <p className="text-gray-600 dark:text-gray-400">
                            © {new Date().getFullYear()} Teixeir4 Blog • Todos os direitos reservados
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">
                            Posts carregados automaticamente da API
                        </p>
                    </div>
                </div>
            </footer>
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
        </main>
    );
}