import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate } from "react-router";
import authService from "~/features/auth/auth-service";
import { PostComposerModal } from "~/features/posts/components/PostComposerModal";
import { PostFeed } from "~/features/posts/components/PostFeed";
import { PageControls } from "~/shared/components/PageControls";

export default function HomePage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const userData = authService.getUser();

  const openPostComposer = () => {
    if (userData) {
      setIsModalOpen(true);
      return;
    }

    navigate("/login", { state: { from: location.pathname } });
  };

  return (
    <div className="app-gradient-bg min-h-screen">
      <header className="animate-slide-up bg-white shadow-lg dark:bg-gray-800">
        <div className="mx-auto max-w-7xl px-4 py-5">
          <div className="flex items-center justify-between gap-4">
            <div className="flex flex-col items-start gap-1">
              <h1 className="text-xl font-bold text-gray-800 dark:text-white">
                {userData ? userData.char_name : t("home.guest", { defaultValue: "Visitante" })}
              </h1>

              {userData && (
                <button
                  onClick={() => {
                    void authService.logout();
                    navigate("/home");
                  }}
                  className="px-2 py-1 text-sm text-blue-600 hover:underline"
                >
                  logout
                </button>
              )}
            </div>

            <div className="flex items-center gap-4">
              <button
                onClick={openPostComposer}
                className="rounded-lg bg-gradient-to-r from-green-500 to-emerald-600 px-5 py-2.5 font-medium text-white shadow-md transition-all hover:from-green-600 hover:to-emerald-700 hover:shadow-lg"
              >
                + Criar Post
              </button>
              <PageControls />
            </div>
          </div>
        </div>
      </header>

      <PostComposerModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />

      <PostFeed maxPosts={15} />

      <footer className="mt-12 border-t border-gray-200 bg-white py-6 dark:border-gray-700 dark:bg-gray-800">
        <div className="mx-auto max-w-2xl px-4 text-center">
          <p className="text-gray-600 dark:text-gray-400">
            (c) {new Date().getFullYear()} {userData ? userData.char_name : ""} Blog
          </p>
        </div>
      </footer>
    </div>
  );
}
