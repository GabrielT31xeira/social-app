import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { LanguageSwitcher } from '~/components/LanguageSwitcher';
import { ThemeSwitcher } from '~/components/ThemeSwitcher';
import { loginService } from '~/services/auth/loginService';
import type { LoginPayload } from '~/services/auth/loginService'

export function LoginPage() {
    const { t } = useTranslation();
    const navigate = useNavigate();

    // Estado do formulário
    const [formData, setFormData] = useState<LoginPayload>({
        char_name: '',
        password: '',
    });

    // Estados de UI
    const [loading, setLoading] = useState(false);

    // Atualiza os campos
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    // Submissão
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validação simples local
        if (!formData.char_name.trim() || !formData.password.trim()) {
            toast.error(t('login.fieldsRequired'));
            return;
        }

        setLoading(true);
        try {
            const result = await loginService.login(formData);

            if (result.success) {
                // Salva o token (ajuste conforme a estrutura da sua API)
                if (result.data?.token) {
                    localStorage.setItem('token', result.data.token);
                }
                toast.success(t('login.success'));
                // Redireciona para a página principal (ou para onde o usuário estava)
                setTimeout(() => navigate('/home'), 1500);
            } else {
                // Tratamento de erros da API
                if (result.errors && typeof result.errors === 'object') {
                    // Se houver erros por campo, mostra o primeiro
                    const firstError = Object.values(result.errors).flat()[0];
                    toast.error(firstError || result.message || t('login.errorGeneric'));
                } else {
                    toast.error(result.message || t('login.errorGeneric'));
                }
            }
        } catch (err: any) {
            toast.error(err.message || t('login.errorUnexpected'));
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 dark:bg-slate-900">
            {/* Controls */}
            <div className="absolute top-6 right-6 flex items-center gap-3">
                <LanguageSwitcher />
                <ThemeSwitcher />
            </div>

            <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-lg shadow-2xl overflow-hidden animate-slide-up">
                {/* Header */}
                <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-8 text-center dark:from-indigo-700 dark:to-purple-700">
                    <h1 className="text-3xl font-bold mb-2 tracking-tight">{t('login.title')}</h1>
                    <p className="text-lg opacity-90 font-medium">{t('login.subtitle')}</p>
                </div>

                {/* Form */}
                <div className="p-8">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* char_name */}
                        <div>
                            <label htmlFor="char_name" className="block text-sm font-semibold text-gray-800 dark:text-gray-200 uppercase tracking-wider opacity-75 mb-2">
                                {t('login.char_name')}
                            </label>
                            <div className="relative">
                                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500 dark:text-gray-400">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                                        <circle cx="12" cy="7" r="4" />
                                    </svg>
                                </span>
                                <input
                                    type="text"
                                    id="char_name"
                                    name="char_name"
                                    value={formData.char_name}
                                    onChange={handleChange}
                                    className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 dark:border-gray-700 rounded-lg bg-transparent dark:text-gray-100 focus:border-indigo-500 dark:focus:border-indigo-400 focus:outline-none transition-colors duration-300"
                                    placeholder={t('login.char_namePlaceholder')}
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div>
                            <label htmlFor="password" className="block text-sm font-semibold text-gray-800 dark:text-gray-200 uppercase tracking-wider opacity-75 mb-2">
                                {t('login.password')}
                            </label>
                            <div className="relative">
                                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500 dark:text-gray-400">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                                        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                                    </svg>
                                </span>
                                <input
                                    type="password"
                                    id="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 dark:border-gray-700 rounded-lg bg-transparent dark:text-gray-100 focus:border-indigo-500 dark:focus:border-indigo-400 focus:outline-none transition-colors duration-300"
                                    placeholder={t('login.passwordPlaceholder')}
                                />
                            </div>
                        </div>

                        {/* Forgot password link */}
                        <div className="text-right">
                            <a href="#" className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline hover:text-indigo-800 dark:hover:text-indigo-300 transition-colors">
                                {t('login.forgotPassword')}
                            </a>
                        </div>

                        {/* Submit button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3 px-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-lg hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? t('common.loading') : t('login.submit')}
                        </button>
                    </form>

                    {/* Sign up link */}
                    <p className="mt-6 text-center text-gray-600 dark:text-gray-400">
                        {t('login.noAccount')}{' '}
                        <a href="/register" className="text-indigo-600 dark:text-indigo-400 font-semibold hover:underline hover:text-indigo-800 dark:hover:text-indigo-300 transition-colors">
                            {t('login.signUp')}
                        </a>
                    </p>
                </div>
            </div>

            <style>{`
                @keyframes slide-up {
                    from {
                        opacity: 0;
                        transform: translateY(30px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                .animate-slide-up {
                    animation: slide-up 0.6s ease-out;
                }
                
                html.dark main {
                    background: linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%);
                }
            `}</style>
        </main>
    );
}