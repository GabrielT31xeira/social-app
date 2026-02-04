import { useTranslation } from 'react-i18next';
import { LanguageSwitcher } from '../../components/LanguageSwitcher';
import { ThemeSwitcher } from '../../components/ThemeSwitcher';
import { Link } from 'react-router';

export function Welcome() {
  const { t } = useTranslation();

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 dark:bg-slate-900">
      {/* Controls */}
      <div className="absolute top-6 right-6 flex items-center gap-3">
        <LanguageSwitcher />
        <ThemeSwitcher />
      </div>

      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="text-center mb-12 animate-slide-up">
          <h1 className="text-5xl font-bold text-white mb-4 tracking-tight">
            {t('welcome.title')}
          </h1>
          <p className="text-xl text-white/80">
            {t('welcome.subtitle')}
          </p>
        </div>

        {/* Description Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12 animate-slide-up" style={{ animationDelay: "0.1s" }}>
          {/* Features Card */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
              ✨ {t('welcome.features.title')}
            </h2>
            <ul className="space-y-2 text-gray-700 dark:text-gray-200 text-sm">
              <li>• {t('welcome.features.item1')}</li>
              <li>• {t('welcome.features.item2')}</li>
              <li>• {t('welcome.features.item3')}</li>
              <li>• {t('welcome.features.item4')}</li>
            </ul>
          </div>

          {/* Integration Card */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
              🔗 {t('welcome.integration.title')}
            </h2>
            <p className="text-gray-700 dark:text-gray-200 text-sm leading-relaxed">
              {t('welcome.integration.description')}
            </p>
            <a 
              href="https://jsonplaceholder.typicode.com" 
              target="_blank" 
              rel="noreferrer"
              className="inline-block mt-4 text-indigo-600 dark:text-indigo-400 hover:text-purple-600 dark:hover:text-purple-400 font-medium text-sm hover:underline transition-colors"
            >
              {t('welcome.integration.link')} →
            </a>
          </div>
        </div>

        {/* CTA Button */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 justify-center animate-slide-up" style={{ animationDelay: "0.2s" }}>
          <Link
            to="/home"
            className="px-8 py-3 bg-white text-indigo-600 font-bold rounded-lg shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 dark:bg-gray-800 dark:text-indigo-400"
          >
            HOME
          </Link>
          <Link
            to="/info"
            className="px-8 py-3 bg-white text-indigo-600 font-bold rounded-lg shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 dark:bg-gray-800 dark:text-indigo-400"
          >
            {t('welcome.cta')}
          </Link>
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
