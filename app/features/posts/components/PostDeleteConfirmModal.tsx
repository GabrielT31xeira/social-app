import { useId, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import { getFirstApiError, getReadableError } from "~/features/auth/auth-errors";
import { postService } from "~/features/posts/post-service";
import { Icon } from "~/shared/components/Icons";
import { ModalDialog } from "~/shared/components/ModalDialog";

interface PostDeleteConfirmModalProps {
  isOpen: boolean;
  postId: string | null;
  postTitle?: string;
  onClose: () => void;
  onDeleted?: () => void;
}

export function PostDeleteConfirmModal({
  isOpen,
  postId,
  postTitle,
  onClose,
  onDeleted,
}: PostDeleteConfirmModalProps) {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const titleId = useId();
  const descriptionId = useId();

  const handleDelete = async () => {
    if (!postId) {
      return;
    }

    setLoading(true);

    try {
      const result = await postService.deletePost(postId);

      if (result.success) {
        toast.success(result.message || t("post.delete.success"));
        onClose();
        onDeleted?.();
        return;
      }

      toast.error(getFirstApiError(result, t("post.delete.error")));
    } catch (error: unknown) {
      toast.error(getReadableError(error, t("post.delete.error")));
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || !postId) {
    return null;
  }

  return (
    <ModalDialog
      isOpen={isOpen}
      onClose={onClose}
      titleId={titleId}
      descriptionId={descriptionId}
      panelClassName="max-w-md"
    >
      <div className="overflow-hidden rounded-2xl bg-white shadow-2xl dark:bg-gray-800">
        <div className="border-b border-gray-200 p-6 dark:border-gray-700">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 id={titleId} className="inline-flex items-center gap-2 text-xl font-bold text-gray-900 dark:text-white">
                <Icon name="alertTriangle" className="h-5 w-5 text-red-500" />
                {t("post.delete.title")}
              </h2>
              <p id={descriptionId} className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                {t("post.delete.description", { title: postTitle || t("post.feed.badge") })}
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="text-gray-400 transition-colors hover:text-gray-600 dark:hover:text-gray-200"
              aria-label={t("post.delete.close")}
            >
              <Icon name="x" className="h-6 w-6" />
            </button>
          </div>
        </div>

        <div className="p-6">
          <p className="inline-flex items-center gap-2 text-sm text-red-600 dark:text-red-400">
            <Icon name="trash" className="h-4 w-4" />
            {t("post.delete.warning")}
          </p>

          <div className="mt-6 flex gap-4">
            <button
              type="button"
              onClick={onClose}
              data-autofocus="true"
              disabled={loading}
              className="flex-1 rounded-lg border border-gray-300 px-4 py-3 font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
            >
              {t("post.delete.cancel")}
            </button>
            <button
              type="button"
              onClick={() => void handleDelete()}
              disabled={loading}
              className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-red-600 px-4 py-3 font-semibold text-white transition-colors hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Icon name="trash" className="h-4 w-4" />
              {loading ? t("common.loading") : t("post.delete.confirm")}
            </button>
          </div>
        </div>
      </div>
    </ModalDialog>
  );
}
