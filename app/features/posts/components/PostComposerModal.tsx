import { type ChangeEvent, type FormEvent, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import { getFirstApiError } from "~/features/auth/auth-errors";
import { postService } from "~/features/posts/post-service";
import type { CreatePostPayload, PostModalProps } from "~/features/posts/types";

const initialFormState: CreatePostPayload = {
  title: "",
  content: "",
  type_id: 1,
};

export function PostComposerModal({ isOpen, onClose, onCreated }: PostModalProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<CreatePostPayload>(initialFormState);
  const { t } = useTranslation();

  const handleChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setLoading(true);

    try {
      const result = await postService.createPost(formData);

      if (result.success) {
        toast.success(result.message);
        setFormData(initialFormState);
        onClose();
        onCreated?.();
        return;
      }

      toast.error(getFirstApiError(result, t("post.error.create")));
    } catch (error: any) {
      toast.error(error.message || t("post.error.create"));
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      <div className="relative z-10 mx-4 w-full max-w-md">
        <div className="overflow-hidden rounded-2xl bg-white shadow-2xl dark:bg-gray-800">
          <div className="app-card-header p-6 text-white">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">{t("post.create.main")}</h2>
              <button
                onClick={onClose}
                className="text-2xl font-bold text-white/80 transition-colors hover:text-white"
              >
                &times;
              </button>
            </div>
            <p className="mt-2 opacity-90">{t("post.create.description")}</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6 p-6">
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                {t("post.create.title")}
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-3 outline-none transition-all focus:ring-2 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                {t("post.create.content")}
              </label>
              <textarea
                name="content"
                value={formData.content}
                onChange={handleChange}
                rows={5}
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
                className="flex-1 rounded-lg bg-gradient-to-r from-green-500 to-emerald-600 px-4 py-3 font-semibold text-white transition-all hover:from-green-600 hover:to-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? t("common.loading") : t("post.create.submit")}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
