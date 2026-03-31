import { type ChangeEvent, type FormEvent, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router";
import { toast } from "react-toastify";
import { getAllApiErrors, getReadableError } from "~/features/auth/auth-errors";
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
    avatar: null,
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value, files } = event.target;

    if (name === "avatar") {
      setFormData((current) => ({ ...current, avatar: files?.[0] ?? null }));
      return;
    }

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
    } catch (error: unknown) {
      toast.error(getReadableError(error, t("register.errorUnexpected")));
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

        <div>
          <label
            htmlFor="avatar"
            className="mb-2 block text-sm font-semibold uppercase tracking-wider text-gray-800 opacity-75 dark:text-gray-200"
          >
            {t("register.avatar")}
          </label>
          <label
            htmlFor="avatar"
            className="flex cursor-pointer items-center gap-3 rounded-lg border-2 border-dashed border-gray-300 px-4 py-3 text-sm text-gray-600 transition-colors hover:border-indigo-400 hover:text-indigo-600 dark:border-gray-700 dark:text-gray-300 dark:hover:border-indigo-400 dark:hover:text-indigo-300"
          >
            <Icon name="user" className="h-5 w-5" />
            <span>{formData.avatar?.name ?? t("register.avatarPlaceholder")}</span>
          </label>
          <input
            type="file"
            id="avatar"
            name="avatar"
            accept="image/*"
            onChange={handleChange}
            className="sr-only"
          />
        </div>

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
