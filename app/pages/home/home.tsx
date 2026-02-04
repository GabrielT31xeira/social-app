import { useTranslation } from 'react-i18next';
import { LanguageSwitcher } from '../../components/LanguageSwitcher';
import { ThemeSwitcher } from '../../components/ThemeSwitcher';

export default function Home() {
    const { t } = useTranslation();

    return (
        <main className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 dark:bg-slate-900">
            {/* Controls */}
            <div className="absolute top-6 right-6 flex items-center gap-3">
                <LanguageSwitcher />
                <ThemeSwitcher />
            </div>

            {/* Card retangular no topo */}
            <div className="w-full bg-white dark:bg-gray-800 shadow-2xl animate-slide-up">
                {/* Conteúdo do header */}
                <div className="container mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        {/* Nome do perfil à esquerda */}
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center">
                                <span className="text-white text-xl font-bold">T</span>
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-gray-800 dark:text-white">Teixeir4</p>
                                <p className="text-sm text-gray-600 dark:text-gray-300">Online agora</p>
                            </div>
                        </div>

                        {/* Botão verde à direita */}
                        <button className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-105 hover:shadow-lg active:scale-95 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-opacity-50">
                            {t('home.post.create')}
                        </button>
                    </div>
                </div>
            </div>

            {/* Conteúdo principal abaixo do header */}
            <div className="container mx-auto px-4 py-8 mt-4">
                <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl p-8 shadow-lg">
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">Seu conteúdo aqui</h2>
                    <p className="text-gray-600 dark:text-gray-300">
                        O restante do conteúdo do seu aplicativo vai aparecer aqui, abaixo do header retangular.
                    </p>
                    {/* Adicione mais conteúdo conforme necessário */}
                </div>
            </div>

            <style>{`
                @keyframes slide-up {
                    from {
                        opacity: 0;
                        transform: translateY(-20px);
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