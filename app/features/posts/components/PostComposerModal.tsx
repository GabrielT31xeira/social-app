import { type ChangeEvent, type FormEvent, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import { getFirstApiError, getReadableError } from "~/features/auth/auth-errors";
import { postService } from "~/features/posts/post-service";
import type { CreatePostPayload, PostModalProps } from "~/features/posts/types";
import { Icon } from "~/shared/components/Icons";

const initialFormState: CreatePostPayload = {
  title: "",
  contents: [""],
};

export function PostComposerModal({ isOpen, onClose, onCreated }: PostModalProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<CreatePostPayload>(initialFormState);
  const { t } = useTranslation();

  const handleChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
  };

  const handleContentChange = (index: number, value: string) => {
    setFormData((current) => ({
      ...current,
      contents: current.contents.map((content, currentIndex) =>
        currentIndex === index ? value : content,
      ),
    }));
  };

  const addContentBlock = () => {
    setFormData((current) => ({ ...current, contents: [...current.contents, ""] }));
  };

  const removeContentBlock = (index: number) => {
    setFormData((current) => ({
      ...current,
      contents:
        current.contents.length === 1
          ? current.contents
          : current.contents.filter((_, currentIndex) => currentIndex !== index),
    }));
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
    } catch (error: unknown) {
      toast.error(getReadableError(error, t("post.error.create")));
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
                className="text-white/80 transition-colors hover:text-white"
              >
                <Icon name="x" className="h-6 w-6" />
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
                {t("post.create.contents")}
              </label>
              <div className="space-y-4">
                {formData.contents.map((content, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                        {t("post.create.blockLabel", { index: index + 1 })}
                      </span>
                      {formData.contents.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeContentBlock(index)}
                          className="text-sm text-red-600 transition-colors hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                        >
                          {t("post.create.removeBlock")}
                        </button>
                      )}
                    </div>
                    <textarea
                      value={content}
                      onChange={(event) => handleContentChange(index, event.target.value)}
                      rows={4}
                      className="w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-3 outline-none transition-all focus:ring-2 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700"
                    />
                  </div>
                ))}

                <button
                  type="button"
                  onClick={addContentBlock}
                  className="inline-flex items-center gap-2 rounded-lg border border-indigo-200 px-4 py-2 text-sm font-medium text-indigo-700 transition-colors hover:bg-indigo-50 dark:border-indigo-700 dark:text-indigo-300 dark:hover:bg-indigo-900/30"
                >
                  <Icon name="plusSquare" className="h-4 w-4" />
                  {t("post.create.addBlock")}
                </button>
              </div>
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
                className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-green-500 to-emerald-600 px-4 py-3 font-semibold text-white transition-all hover:from-green-600 hover:to-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <Icon name="send" className="h-4 w-4" />
                {loading ? t("common.loading") : t("post.create.submit")}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
