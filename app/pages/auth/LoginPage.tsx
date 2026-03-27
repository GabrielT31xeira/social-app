import { type ChangeEvent, type FormEvent, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { getFirstApiError } from "~/features/auth/auth-errors";
import { AuthInput } from "~/features/auth/components/AuthInput";
import { AuthPageShell } from "~/features/auth/components/AuthPageShell";
import authService from "~/features/auth/auth-service";
import type { LoginPayload } from "~/features/auth/types";

export function LoginPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [formData, setFormData] = useState<LoginPayload>({
    char_name: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setLoading(true);

    try {
      const result = await authService.login(formData);

      if (result.success) {
        toast.success(t("login.success"));
        setTimeout(() => navigate("/home"), 1500);
        return;
      }

      toast.error(getFirstApiError(result, t("login.errorGeneric")));
    } catch (error: any) {
      toast.error(error.message || t("login.errorUnexpected"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthPageShell title={t("login.title")} subtitle={t("login.subtitle")}>
      <form onSubmit={handleSubmit} className="space-y-6">
        <AuthInput
          type="text"
          id="char_name"
          name="char_name"
          value={formData.char_name}
          onChange={handleChange}
          label={t("login.char_name")}
          placeholder={t("login.char_namePlaceholder")}
          icon={
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          }
        />

        <AuthInput
          type="password"
          id="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          label={t("login.password")}
          placeholder={t("login.passwordPlaceholder")}
          icon={
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
          }
        />

        <div className="text-right">
          <a href="#" className="text-sm text-indigo-600 transition-colors hover:text-indigo-800 hover:underline dark:text-indigo-400 dark:hover:text-indigo-300">
            {t("login.forgotPassword")}
          </a>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 px-4 py-3 font-semibold text-white transition-all duration-300 hover:from-indigo-700 hover:to-purple-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? t("common.loading") : t("login.submit")}
        </button>
      </form>

      <p className="mt-6 text-center text-gray-600 dark:text-gray-400">
        {t("login.noAccount")}{" "}
        <Link
          to="/register"
          className="font-semibold text-indigo-600 transition-colors hover:text-indigo-800 hover:underline dark:text-indigo-400 dark:hover:text-indigo-300"
        >
          {t("login.signUp")}
        </Link>
      </p>
    </AuthPageShell>
  );
}
