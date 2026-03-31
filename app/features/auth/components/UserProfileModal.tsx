import { type ChangeEvent, useEffect, useId, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";
import { getReadableError } from "~/features/auth/auth-errors";
import { useAuth } from "~/features/auth/AuthProvider";
import { resolveAvatarUrl } from "~/features/auth/avatar-url";
import { RemoveAvatarConfirmModal } from "~/features/auth/components/RemoveAvatarConfirmModal";
import authService from "~/features/auth/auth-service";
import type { MeResponseData } from "~/features/auth/types";
import { Icon } from "~/shared/components/Icons";
import { ModalDialog } from "~/shared/components/ModalDialog";

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

function getInitials(name?: string, charName?: string) {
  const source = name || charName || "?";
  return source
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

export function UserProfileModal({ isOpen, onClose }: UserProfileModalProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [profile, setProfile] = useState<MeResponseData | null>(null);
  const [loading, setLoading] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isRemoveAvatarModalOpen, setIsRemoveAvatarModalOpen] = useState(false);
  const titleId = useId();
  const descriptionId = useId();

  const syncProfile = (data: MeResponseData) => {
    setProfile(data);
  };

  const reloadProfile = async () => {
    const result = await authService.getMe();

    if (result.success) {
      syncProfile(result.data);
      return true;
    }

    setError(result.message || t("profile.loadError"));
    return false;
  };

  const handleLogout = async () => {
    try {
      const result = await logout();

      if (!result.success) {
        toast.error(result.message || t("profile.logoutError"));
        return;
      }

      onClose();
      navigate("/home");
    } catch (err: unknown) {
      toast.error(getReadableError(err, t("profile.logoutError")));
    }
  };

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const loadProfile = async () => {
      setLoading(true);
      setError(null);

      try {
        await reloadProfile();
      } catch (err: unknown) {
        const message = getReadableError(err, t("profile.loadError"));
        setError(message);
        toast.error(message);
      } finally {
        setLoading(false);
      }
    };

    void loadProfile();
  }, [isOpen, t]);

  const handleAvatarChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    setUploadingAvatar(true);

    try {
      const result = await authService.uploadAvatar(file);

      if (!result.success) {
        toast.error(result.message || t("profile.avatar.uploadError"));
        return;
      }

      await reloadProfile();
      toast.success(result.message || t("profile.avatar.uploadSuccess"));
    } catch (err: unknown) {
      toast.error(getReadableError(err, t("profile.avatar.uploadError")));
    } finally {
      event.target.value = "";
      setUploadingAvatar(false);
    }
  };

  if (!isOpen) {
    return null;
  }

  return (
    <ModalDialog
      isOpen={isOpen}
      onClose={onClose}
      titleId={titleId}
      descriptionId={descriptionId}
      panelClassName="max-w-lg"
    >
      <div className="overflow-hidden rounded-2xl bg-white shadow-2xl dark:bg-gray-800">
        <div className="border-b border-gray-200 p-6 dark:border-gray-700">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 id={titleId} className="text-2xl font-bold text-gray-900 dark:text-white">
                {t("profile.title")}
              </h2>
              <p id={descriptionId} className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                {t("profile.subtitle")}
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              data-autofocus="true"
              className="text-gray-400 transition-colors hover:text-gray-600 dark:hover:text-gray-200"
              aria-label={t("profile.close")}
            >
              <Icon name="x" className="h-6 w-6" />
            </button>
          </div>
        </div>

        <div className="space-y-6 p-6">
          {loading && (
            <div className="space-y-4">
              <div className="mx-auto h-20 w-20 animate-pulse rounded-full bg-gray-200 dark:bg-gray-700" />
              <div className="h-5 w-1/2 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
              <div className="h-4 w-2/3 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
            </div>
          )}

          {error && !loading && (
            <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-800 dark:bg-red-900/20 dark:text-red-300">
              {error}
            </div>
          )}

          {!loading && !error && profile && (
            <>
              <div className="flex items-center gap-4">
                {profile.avatar_url ? (
                  <img
                    src={resolveAvatarUrl(profile.id, profile.avatar_url) ?? undefined}
                    alt={profile.char_name}
                    className="h-20 w-20 rounded-full border border-gray-200 object-cover dark:border-gray-700"
                  />
                ) : (
                  <div className="flex h-20 w-20 items-center justify-center rounded-full bg-indigo-100 text-xl font-bold text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300">
                    {getInitials(profile.name, profile.char_name)}
                  </div>
                )}

                <div className="min-w-0">
                  <h3 className="truncate text-xl font-bold text-gray-900 dark:text-white">
                    {profile.char_name}
                  </h3>
                  <p className="truncate text-sm text-gray-500 dark:text-gray-400">
                    {profile.name}
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap justify-start gap-3">
                <label
                  htmlFor="profile-avatar-upload"
                  className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-indigo-200 px-4 py-2 text-sm font-medium text-indigo-700 transition-colors hover:bg-indigo-50 dark:border-indigo-700 dark:text-indigo-300 dark:hover:bg-indigo-900/30"
                >
                  <Icon name="plusSquare" className="h-4 w-4" />
                  {uploadingAvatar
                    ? t("common.loading")
                    : profile.avatar_url
                      ? t("profile.avatar.change")
                      : t("profile.avatar.add")}
                </label>
                <input
                  id="profile-avatar-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  className="sr-only"
                />

                {profile.avatar_url && (
                  <button
                    type="button"
                    onClick={() => setIsRemoveAvatarModalOpen(true)}
                    className="inline-flex items-center gap-2 rounded-lg border border-red-200 px-4 py-2 text-sm font-medium text-red-700 transition-colors hover:bg-red-50 dark:border-red-800 dark:text-red-300 dark:hover:bg-red-900/30"
                  >
                    <Icon name="trash" className="h-4 w-4" />
                    {t("profile.avatar.remove")}
                  </button>
                )}
              </div>

              <div className="grid gap-4 rounded-xl bg-gray-50 p-4 dark:bg-gray-900/30">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                    {t("profile.fields.name")}
                  </p>
                  <p className="mt-1 text-sm text-gray-900 dark:text-gray-100">{profile.name}</p>
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                    {t("profile.fields.nickname")}
                  </p>
                  <p className="mt-1 text-sm text-gray-900 dark:text-gray-100">
                    {profile.char_name}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                    {t("profile.fields.email")}
                  </p>
                  <p className="mt-1 text-sm text-gray-900 dark:text-gray-100">{profile.email}</p>
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                    {t("profile.fields.createdAt")}
                  </p>
                  <p className="mt-1 text-sm text-gray-900 dark:text-gray-100">
                    {new Date(profile.created_at).toLocaleString()}
                  </p>
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => void handleLogout()}
                  className="inline-flex items-center justify-center gap-2 rounded-lg border border-red-200 px-4 py-3 font-medium text-red-700 transition-colors hover:bg-red-50 dark:border-red-800 dark:text-red-300 dark:hover:bg-red-900/30"
                >
                  <Icon name="logOut" className="h-4 w-4" />
                  {t("profile.logout")}
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      <RemoveAvatarConfirmModal
        isOpen={isRemoveAvatarModalOpen}
        onClose={() => setIsRemoveAvatarModalOpen(false)}
        onRemoved={() => {
          if (!profile) {
            return;
          }

          const nextProfile = { ...profile, avatar_url: null };
          setProfile(nextProfile);
          setIsRemoveAvatarModalOpen(false);
        }}
      />
    </ModalDialog>
  );
}
