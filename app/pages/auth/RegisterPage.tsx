import { type ChangeEvent, type FormEvent, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { getAllApiErrors } from "~/features/auth/auth-errors";
import { AuthInput } from "~/features/auth/components/AuthInput";
import { AuthPageShell } from "~/features/auth/components/AuthPageShell";
import authService from "~/features/auth/auth-service";
import type { RegisterPayload } from "~/features/auth/types";
import { Icon } from "~/shared/components/Icons";

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
          icon={<Icon name="user" className="h-5 w-5" />}
        />

        <AuthInput
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          label={t("register.email")}
          placeholder={t("register.emailPlaceholder")}
          icon={<Icon name="mail" className="h-5 w-5" />}
        />

        <AuthInput
          type="text"
          id="char_name"
          name="char_name"
          value={formData.char_name}
          onChange={handleChange}
          label={t("register.char_name")}
          placeholder={t("register.char_name")}
          icon={<Icon name="user" className="h-5 w-5" />}
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
          icon={<Icon name="lock" className="h-5 w-5" />}
        />

        <AuthInput
          type="password"
          id="password_confirmation"
          name="password_confirmation"
          value={formData.password_confirmation}
          onChange={handleChange}
          label={t("register.confirmPassword")}
          placeholder={t("register.confirmPlaceholder")}
          icon={<Icon name="lock" className="h-5 w-5" />}
        />

        <button
          type="submit"
          disabled={loading}
          className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 px-4 py-3 font-semibold text-white transition-all duration-300 hover:from-indigo-700 hover:to-purple-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Icon name="plusSquare" className="h-4 w-4" />
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
