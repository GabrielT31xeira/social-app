import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { postCreateProps } from '~/services/post/sevice';
import PostService from '~/services/post/sevice';

export default function PostCreate({ isOpen, onClose }: postCreateProps) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { t } = useTranslation();

    const [formData, setFormData] = useState({
        title: '',
        body: '',
        userId: 1
    });

    const handleChange = (e: any) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            // Chama o serviço
             await PostService.createPost(formData);

            // Limpa e fecha
            setFormData({ title: '', body: '', userId: 1 });
            onClose();
        } catch (err: any) {
            setError(err.response?.data?.message || 'Erro ao criar post');
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Overlay escuro */}
            <div
                className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="relative z-10 w-full max-w-md mx-4">
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden">
                    {/* Header da Modal */}
                    <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-6">
                        <div className="flex justify-between items-center">
                            <h2 className="text-2xl font-bold">{t("post.create.main")}</h2>
                            <button
                                onClick={onClose}
                                className="text-white/80 hover:text-white text-2xl font-bold transition-colors"
                            >
                                &times;
                            </button>
                        </div>
                        <p className="mt-2 opacity-90">{t("post.create.description")}</p>
                    </div>

                    {/* Formulário */}
                    <form onSubmit={handleSubmit} className="p-6 space-y-6">
                        {/* Input Title */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                {t("post.create.title")}
                            </label>
                            <input
                                type="text"
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                            />
                        </div>

                        {/* Input Body */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                {t("post.create.content")}
                            </label>
                            <input
                                type="text"
                                name="body"
                                value={formData.body}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                            />
                        </div>

                        {/* Botões */}
                        <div className="flex gap-4 pt-4">
                            <button
                                type="button"
                                onClick={onClose}
                                className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors font-medium"
                            >
                                {t("post.create.cancel")}
                            </button>
                            <button
                                type="submit"
                                className="flex-1 px-4 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg hover:from-green-600 hover:to-emerald-700 font-semibold transition-all transform hover:scale-[1.02] active:scale-95"
                            >
                                {t("post.create.submit")}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}