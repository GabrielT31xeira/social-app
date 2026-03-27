import { type ChangeEvent, type FormEvent, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import { getFirstApiError } from "~/features/auth/auth-errors";
import { postService } from "~/features/posts/post-service";
import type { CommentModalProps, CreateCommentPayload } from "~/features/posts/types";

const emptyFormState = {
  description: "",
};

export function PostCommentModal({ isOpen, postId, onClose, onCreated }: CommentModalProps) {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [description, setDescription] = useState(emptyFormState.description);

  useEffect(() => {
    if (!isOpen) {
      setDescription(emptyFormState.description);
    }
  }, [isOpen]);

  const handleChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setDescription(event.target.value);
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    if (!postId) {
      return;
    }

    const payload: CreateCommentPayload = {
      description,
      post_id: postId,
    };

    setLoading(true);

    try {
      const result = await postService.createComment(payload);

      if (result.success) {
        toast.success(result.message || t("post.comments.success"));
        onCreated?.();
        onClose();
        return;
      }

      toast.error(getFirstApiError(result, t("post.comments.error")));
    } catch (error: any) {
      toast.error(error.message || t("post.comments.error"));
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || !postId) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      <div className="relative z-10 mx-4 w-full max-w-md">
        <div className="overflow-hidden rounded-2xl bg-white shadow-2xl dark:bg-gray-800">
          <div className="app-card-header p-6 text-white">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">{t("post.comments.title")}</h2>
              <button
                onClick={onClose}
                className="text-2xl font-bold text-white/80 transition-colors hover:text-white"
              >
                &times;
              </button>
            </div>
            <p className="mt-2 opacity-90">{t("post.comments.description")}</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6 p-6">
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                {t("post.comments.fieldLabel")}
              </label>
              <textarea
                name="description"
                value={description}
                onChange={handleChange}
                rows={5}
                placeholder={t("post.comments.placeholder")}
                className="w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-3 outline-none transition-all focus:ring-2 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700"
              />
            </div>

            <div className="flex gap-4 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 rounded-lg border border-gray-300 px-4 py-3 font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
              >
                {t("post.create.cancel")}
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 rounded-lg bg-gradient-to-r from-indigo-600 to-blue-600 px-4 py-3 font-semibold text-white transition-all hover:from-indigo-700 hover:to-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? t("common.loading") : t("post.comments.submit")}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
