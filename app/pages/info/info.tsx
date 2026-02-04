import { useTranslation } from 'react-i18next';
import { LanguageSwitcher } from '../../components/LanguageSwitcher';
import { ThemeSwitcher } from '../../components/ThemeSwitcher';

export function Info() {
    const { t } = useTranslation();

    return (
        <main className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 dark:bg-slate-900">
            {/* Controls */}
            <div className="absolute top-6 right-6 flex items-center gap-3">
                <LanguageSwitcher />
                <ThemeSwitcher />
            </div>

            <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-lg shadow-2xl overflow-hidden animate-slide-up">
                {/* Header */}
                <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-8 text-center dark:from-indigo-700 dark:to-purple-700">
                    <h1 className="text-3xl font-bold mb-2 tracking-tight">{t('info.title')}</h1>
                    <p className="text-lg opacity-90 font-medium">{t('info.name')}</p>
                </div>

                {/* Content */}
                <div className="p-8">
                    {/* Contact Section */}
                    <div className="mb-8">
                        <h2 className="text-sm font-semibold text-gray-800 dark:text-gray-200 uppercase tracking-wider opacity-75 mb-4">{t('info.contact')}</h2>
                        <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded hover:bg-gray-100 dark:hover:bg-gray-600 transition-all duration-300 hover:translate-x-1">
                            <span className="font-semibold text-indigo-600 text-sm block">{t('info.email')}</span>
                            <a 
                                href="mailto:gt3ixeira@gmail.com" 
                                className="text-gray-800 dark:text-gray-100 font-medium hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors duration-300"
                            >
                                gt3ixeira@gmail.com
                            </a>
                        </div>
                    </div>

                    {/* Social Links Section */}
                    <div className="mb-8">
                        <h2 className="text-sm font-semibold text-gray-800 dark:text-gray-200 uppercase tracking-wider opacity-75 mb-4">{t('info.socialLinks')}</h2>
                        <div className="space-y-3">
                            {/* GitHub */}
                            <a 
                                href="https://github.com/GabrielT31xeira" 
                                target="_blank" 
                                rel="noreferrer"
                                className="flex items-center gap-3 p-4 border-2 border-gray-200 dark:border-gray-700 rounded hover:border-gray-800 dark:hover:border-gray-500 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-300 hover:translate-x-1 group"
                                aria-label="GitHub"
                            >
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className="text-gray-800 dark:text-gray-100 group-hover:scale-110 group-hover:rotate-5 transition-transform duration-300">
                                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v 3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                                </svg>
                                <span className="font-medium text-gray-800 dark:text-gray-100 group-hover:text-gray-900 dark:group-hover:text-white">GabrielT31xeira</span>
                            </a>

                            {/* LinkedIn */}
                            <a 
                                href="https://www.linkedin.com/in/gabriel-teixeira-de-carvalho-123456789/" 
                                target="_blank" 
                                rel="noreferrer"
                                className="flex items-center gap-3 p-4 border-2 border-gray-200 dark:border-gray-700 rounded hover:border-blue-600 dark:hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-gray-700 transition-all duration-300 hover:translate-x-1 group"
                                aria-label="LinkedIn"
                            >
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className="text-blue-600 dark:text-blue-400 group-hover:scale-110 group-hover:rotate-5 transition-transform duration-300">
                                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.475-2.236-1.986-2.236-1.081 0-1.722.732-2.004 1.438-.103.25-.129.599-.129.948v5.419h-3.554s.05-8.736 0-9.643h3.554v1.364c.429-.662 1.196-1.608 2.928-1.608 2.136 0 3.745 1.398 3.745 4.406v5.481zM5.337 9.433c-1.144 0-1.915-.759-1.915-1.708 0-.951.77-1.708 1.959-1.708 1.187 0 1.915.757 1.933 1.708 0 .949-.746 1.708-1.977 1.708zm1.581 10.019H3.656V9.81h3.262v9.642zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.225 0z"/>
                                </svg>
                                <span className="font-medium text-gray-800 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400">Gabriel Teixeira</span>
                            </a>
                        </div>
                    </div>
                </div>
            </div>

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