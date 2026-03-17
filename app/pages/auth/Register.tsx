import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';
import { toast } from 'react-toastify';
import { LanguageSwitcher } from '../../components/LanguageSwitcher';
import { ThemeSwitcher } from '../../components/ThemeSwitcher';
import type {RegisterPayload} from '~/services/auth/login'; // ajuste o caminho
// ajuste o caminho
import { loginService } from '~/services/auth/login';
import apiClient from "~/services/api/client";

export function Register() {
    const { t } = useTranslation();
    const navigate = useNavigate();

    const [formData, setFormData] = useState<RegisterPayload>({
        name: '',
        email: '',
        char_name: '',
        password: '',
        password_confirmation: '',
    });

    const [loading, setLoading] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (formData.password !== formData.password_confirmation) {
            toast.error(t('register.passwordMismatch'));
            return;
        }

        setLoading(true);
        try {
            const result = await loginService.register(formData);
            if (result.success) {
                toast.success(t('register.success'));
                setTimeout(() => navigate('/login'), 1500);
            } else {
                if (result.errors && typeof result.errors === 'object') {
                    const allErrors = Object.values(result.errors).flat();
                    const errorList = allErrors.map((msg, idx) => <div key={idx}>• {msg}</div>);
                    toast.error(<div>{errorList}</div>);
                } else {
                    toast.error(result.message || t('register.errorGeneric'));
                }
            }
        } catch (err: any) {
            toast.error(err.message || t('register.errorUnexpected'));
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 dark:bg-slate-900">
            <div className="absolute top-6 right-6 flex items-center gap-3">
                <LanguageSwitcher />
                <ThemeSwitcher />
            </div>

            <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-lg shadow-2xl overflow-hidden animate-slide-up">
                <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-8 text-center dark:from-indigo-700 dark:to-purple-700">
                    <h1 className="text-3xl font-bold mb-2 tracking-tight">{t('register.title')}</h1>
                    <p className="text-lg opacity-90 font-medium">{t('register.subtitle')}</p>
                </div>

                <div className="p-8">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Nome completo */}
                        <div>
                            <label htmlFor="name" className="block text-sm font-semibold text-gray-800 dark:text-gray-200 uppercase tracking-wider opacity-75 mb-2">
                                {t('register.name')}
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
                                    id="name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 dark:border-gray-700 rounded-lg bg-transparent dark:text-gray-100 focus:border-indigo-500 dark:focus:border-indigo-400 focus:outline-none transition-colors duration-300"
                                    placeholder={t('register.namePlaceholder')}
                                />
                            </div>
                        </div>

                        {/* E-mail */}
                        <div>
                            <label htmlFor="email" className="block text-sm font-semibold text-gray-800 dark:text-gray-200 uppercase tracking-wider opacity-75 mb-2">
                                {t('register.email')}
                            </label>
                            <div className="relative">
                                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500 dark:text-gray-400">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                                        <polyline points="22,6 12,13 2,6" />
                                    </svg>
                                </span>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 dark:border-gray-700 rounded-lg bg-transparent dark:text-gray-100 focus:border-indigo-500 dark:focus:border-indigo-400 focus:outline-none transition-colors duration-300"
                                    placeholder={t('register.emailPlaceholder')}
                                />
                            </div>
                        </div>

                        {/* Nome do personagem */}
                        <div>
                            <label htmlFor="char_name" className="block text-sm font-semibold text-gray-800 dark:text-gray-200 uppercase tracking-wider opacity-75 mb-2">
                                {t('register.char_name')}
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
                                    placeholder={t('register.char_name')}
                                />
                            </div>
                        </div>

                        {/* Senha */}
                        <div>
                            <label htmlFor="password" className="block text-sm font-semibold text-gray-800 dark:text-gray-200 uppercase tracking-wider opacity-75 mb-2">
                                {t('register.password')}
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
                                    minLength={6}
                                    className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 dark:border-gray-700 rounded-lg bg-transparent dark:text-gray-100 focus:border-indigo-500 dark:focus:border-indigo-400 focus:outline-none transition-colors duration-300"
                                    placeholder={t('register.passwordPlaceholder')}
                                />
                            </div>
                        </div>

                        {/* Confirmar senha */}
                        <div>
                            <label htmlFor="password_confirmation" className="block text-sm font-semibold text-gray-800 dark:text-gray-200 uppercase tracking-wider opacity-75 mb-2">
                                {t('register.confirmPassword')}
                            </label>
                            <div className="relative">
                                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500 dark:text-gray-400">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                                        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                                        <line x1="17" y1="17" x2="7" y2="17" />
                                    </svg>
                                </span>
                                <input
                                    type="password"
                                    id="password_confirmation"
                                    name="password_confirmation"
                                    value={formData.password_confirmation}
                                    onChange={handleChange}
                                    className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 dark:border-gray-700 rounded-lg bg-transparent dark:text-gray-100 focus:border-indigo-500 dark:focus:border-indigo-400 focus:outline-none transition-colors duration-300"
                                    placeholder={t('register.confirmPlaceholder')}
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3 px-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-lg hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? t('register.loading') : t('register.submit')}
                        </button>
                    </form>

                    <p className="mt-6 text-center text-gray-600 dark:text-gray-400">
                        {t('register.haveAccount')}{' '}
                        <a href="/login" className="text-indigo-600 dark:text-indigo-400 font-semibold hover:underline hover:text-indigo-800 dark:hover:text-indigo-300 transition-colors">
                            {t('register.signIn')}
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