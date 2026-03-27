import { type ChangeEvent, type FormEvent, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { getAllApiErrors } from "~/features/auth/auth-errors";
import { AuthInput } from "~/features/auth/components/AuthInput";
import { AuthPageShell } from "~/features/auth/components/AuthPageShell";
import authService from "~/features/auth/auth-service";
import type { RegisterPayload } from "~/features/auth/types";

export function RegisterPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [formData, setFormData] = useState<RegisterPayload>({
    name: "",
    email: "",
    char_name: "",
    password: "",
    password_confirmation: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    if (formData.password !== formData.password_confirmation) {
      toast.error(t("register.passwordMismatch"));
      return;
    }

    setLoading(true);

    try {
      const result = await authService.register(formData);

      if (result.success) {
        toast.success(t("register.success"));
        setTimeout(() => navigate("/login"), 1500);
        return;
      }

      const messages = getAllApiErrors(result);
      toast.error(
        messages.length > 0 ? (
          <div>{messages.map((message, index) => <div key={index}>{message}</div>)}</div>
        ) : (
          t("register.errorGeneric")
        ),
      );
    } catch (error: any) {
      toast.error(error.message || t("register.errorUnexpected"));
    } finally {
      setLoading(false);
    }
  };

  const userIcon = (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );

  const lockIcon = (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );

  return (
    <AuthPageShell title={t("register.title")} subtitle={t("register.subtitle")}>
      <form onSubmit={handleSubmit} className="space-y-6">
        <AuthInput
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          label={t("register.name")}
          placeholder={t("register.namePlaceholder")}
          icon={userIcon}
        />

        <AuthInput
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          label={t("register.email")}
          placeholder={t("register.emailPlaceholder")}
          icon={
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
              <polyline points="22,6 12,13 2,6" />
            </svg>
          }
        />

        <AuthInput
          type="text"
          id="char_name"
          name="char_name"
          value={formData.char_name}
          onChange={handleChange}
          label={t("register.char_name")}
          placeholder={t("register.char_name")}
          icon={userIcon}
        />

        <AuthInput
          type="password"
          id="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          minLength={6}
          label={t("register.password")}
          placeholder={t("register.passwordPlaceholder")}
          icon={lockIcon}
        />

        <AuthInput
          type="password"
          id="password_confirmation"
          name="password_confirmation"
          value={formData.password_confirmation}
          onChange={handleChange}
          label={t("register.confirmPassword")}
          placeholder={t("register.confirmPlaceholder")}
          icon={lockIcon}
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 px-4 py-3 font-semibold text-white transition-all duration-300 hover:from-indigo-700 hover:to-purple-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? t("register.loading") : t("register.submit")}
        </button>
      </form>

      <p className="mt-6 text-center text-gray-600 dark:text-gray-400">
        {t("register.haveAccount")}{" "}
        <Link
          to="/login"
          className="font-semibold text-indigo-600 transition-colors hover:text-indigo-800 hover:underline dark:text-indigo-400 dark:hover:text-indigo-300"
        >
          {t("register.signIn")}
        </Link>
      </p>
    </AuthPageShell>
  );
}
