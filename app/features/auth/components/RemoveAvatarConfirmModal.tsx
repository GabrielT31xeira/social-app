import { useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import authService from "~/features/auth/auth-service";
import { Icon } from "~/shared/components/Icons";

interface RemoveAvatarConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRemoved?: () => void;
}

export function RemoveAvatarConfirmModal({
  isOpen,
  onClose,
  onRemoved,
}: RemoveAvatarConfirmModalProps) {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);

  const handleRemove = async () => {
    setLoading(true);

    try {
      const result = await authService.removeAvatar();

      if (result.success) {
        toast.success(result.message || t("profile.avatar.removeSuccess"));
        onClose();
        onRemoved?.();
        return;
      }

      toast.error(result.message || t("profile.avatar.removeError"));
    } catch (error: any) {
      toast.error(error.message || t("profile.avatar.removeError"));
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      <div className="relative z-10 mx-4 w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl dark:bg-gray-800">
        <div className="border-b border-gray-200 p-6 dark:border-gray-700">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="inline-flex items-center gap-2 text-xl font-bold text-gray-900 dark:text-white">
                <Icon name="alertTriangle" className="h-5 w-5 text-red-500" />
                {t("profile.avatar.removeTitle")}
              </h2>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                {t("profile.avatar.removeDescription")}
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 transition-colors hover:text-gray-600 dark:hover:text-gray-200"
              aria-label={t("profile.avatar.close")}
            >
              <Icon name="x" className="h-6 w-6" />
            </button>
          </div>
        </div>

        <div className="p-6">
          <p className="inline-flex items-center gap-2 text-sm text-red-600 dark:text-red-400">
            <Icon name="trash" className="h-4 w-4" />
            {t("profile.avatar.removeWarning")}
          </p>

          <div className="mt-6 flex justify-end gap-4">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="rounded-lg border border-gray-300 px-4 py-3 font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
            >
              {t("profile.avatar.cancel")}
            </button>
            <button
              type="button"
              onClick={() => void handleRemove()}
              disabled={loading}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-red-600 px-4 py-3 font-semibold text-white transition-colors hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Icon name="trash" className="h-4 w-4" />
              {loading ? t("common.loading") : t("profile.avatar.remove")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
