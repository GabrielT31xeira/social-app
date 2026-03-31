import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate } from "react-router";
import { resolveAvatarUrl } from "~/features/auth/avatar-url";
import { useAuth } from "~/features/auth/AuthProvider";
import { UserProfileModal } from "~/features/auth/components/UserProfileModal";
import { PostComposerModal } from "~/features/posts/components/PostComposerModal";
import { PostFeed } from "~/features/posts/components/PostFeed";
import { Icon } from "~/shared/components/Icons";
import { PageControls } from "~/shared/components/PageControls";

function getInitials(name?: string, charName?: string) {
  const source = name || charName || "?";
  return source
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

export default function HomePage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [postsReloadKey, setPostsReloadKey] = useState(0);
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();

  const refreshPosts = () => {
    setPostsReloadKey((current) => current + 1);
  };

  const openPostComposer = () => {
    if (user) {
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
            <div>
              {user ? (
                <button
                  onClick={() => setIsProfileModalOpen(true)}
                  className="inline-flex items-center gap-3 rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-left transition-colors hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-900/30 dark:hover:bg-gray-900/60"
                >
                  {user.avatar_url ? (
                    <img
                      src={resolveAvatarUrl(user.id, user.avatar_url) ?? undefined}
                      alt={user.char_name}
                      className="h-11 w-11 rounded-full object-cover"
                    />
                  ) : (
                    <div className="flex h-11 w-11 items-center justify-center rounded-full bg-indigo-100 font-semibold text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300">
                      {getInitials(user.name, user.char_name)}
                    </div>
                  )}

                  <div className="flex flex-col items-start">
                    <span className="text-xl font-bold text-gray-800 dark:text-white">
                      {user.char_name}
                    </span>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {t("profile.open")}
                    </span>
                  </div>
                  <Icon name="chevronDown" className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                </button>
              ) : (
                <h1 className="text-xl font-bold text-gray-800 dark:text-white">
                  {t("home.guest")}
                </h1>
              )}
            </div>

            <div className="flex items-center gap-4">
              <button
                onClick={refreshPosts}
                className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2.5 font-medium text-gray-700 shadow-sm transition-colors hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900/30 dark:text-gray-200 dark:hover:bg-gray-900/60"
              >
                <Icon name="refreshCw" className="h-4 w-4" />
                {t("home.reloadPosts")}
              </button>
              <button
                onClick={openPostComposer}
                className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-green-500 to-emerald-600 px-5 py-2.5 font-medium text-white shadow-md transition-all hover:from-green-600 hover:to-emerald-700 hover:shadow-lg"
              >
                <Icon name="plusSquare" className="h-4 w-4" />
                {t("home.createPost")}
              </button>
              <PageControls />
            </div>
          </div>
        </div>
      </header>

      <PostComposerModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCreated={refreshPosts}
      />

      <UserProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
      />

      <PostFeed maxPosts={15} reloadKey={postsReloadKey} />

      <footer className="mt-12 border-t border-gray-200 bg-white py-6 dark:border-gray-700 dark:bg-gray-800">
        <div className="mx-auto max-w-2xl px-4 text-center">
          <p className="text-gray-600 dark:text-gray-400">
            {t("home.footer", {
              year: new Date().getFullYear(),
              name: user ? user.char_name : "",
            })}
          </p>
        </div>
      </footer>
    </div>
  );
}
