import { useTranslation } from "react-i18next";
import { Link } from "react-router";
import { LanguageSwitcher } from "~/components/LanguageSwitcher";
import { ThemeSwitcher } from "~/components/ThemeSwitcher";

export function WelcomePage() {
  const { t } = useTranslation();

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 dark:bg-slate-900">
      <div className="absolute top-6 right-6 flex items-center gap-3">
        <LanguageSwitcher />
        <ThemeSwitcher />
      </div>

      <div className="w-full max-w-2xl">
        <div className="mb-12 animate-slide-up text-center">
          <h1 className="mb-4 text-5xl font-bold tracking-tight text-white">
            {t("welcome.title")}
          </h1>
          <p className="text-xl text-white/80">{t("welcome.subtitle")}</p>
        </div>

        <div className="mb-12 grid grid-cols-1 gap-6 animate-slide-up md:grid-cols-2" style={{ animationDelay: "0.1s" }}>
          <div className="rounded-lg bg-white p-6 shadow-lg dark:bg-gray-800">
            <h2 className="mb-3 text-lg font-bold text-gray-900 dark:text-white">
              {t("welcome.features.title")}
            </h2>
            <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-200">
              <li>{t("welcome.features.item1")}</li>
              <li>{t("welcome.features.item2")}</li>
              <li>{t("welcome.features.item3")}</li>
              <li>{t("welcome.features.item4")}</li>
            </ul>
          </div>

          <div className="rounded-lg bg-white p-6 shadow-lg dark:bg-gray-800">
            <h2 className="mb-3 text-lg font-bold text-gray-900 dark:text-white">
              {t("welcome.integration.title")}
            </h2>
            <p className="text-sm leading-relaxed text-gray-700 dark:text-gray-200">
              {t("welcome.integration.description")}
            </p>
            <a
              href="https://jsonplaceholder.typicode.com"
              target="_blank"
              rel="noreferrer"
              className="mt-4 inline-block text-sm font-medium text-indigo-600 transition-colors hover:text-purple-600 hover:underline dark:text-indigo-400 dark:hover:text-purple-400"
            >
              {t("welcome.integration.link")}
            </a>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 animate-slide-up justify-center md:grid-cols-2" style={{ animationDelay: "0.2s" }}>
          <Link
            to="/home"
            className="rounded-lg bg-white px-8 py-3 font-bold text-indigo-600 shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl dark:bg-gray-800 dark:text-indigo-400"
          >
            {t("welcome.home")}
          </Link>
          <Link
            to="/info"
            className="rounded-lg bg-white px-8 py-3 font-bold text-indigo-600 shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl dark:bg-gray-800 dark:text-indigo-400"
          >
            {t("welcome.cta")}
          </Link>
        </div>
      </div>
    </main>
  );
}
