import type { ReactNode } from "react";
import { LanguageSwitcher } from "~/components/LanguageSwitcher";
import { ThemeSwitcher } from "~/components/ThemeSwitcher";

interface AuthPageShellProps {
  title: string;
  subtitle: string;
  children: ReactNode;
}

export function AuthPageShell({ title, subtitle, children }: AuthPageShellProps) {
  return (
    <main className="app-gradient-bg min-h-screen px-4 py-10">
      <div className="absolute right-6 top-6 flex items-center gap-3">
        <LanguageSwitcher />
        <ThemeSwitcher />
      </div>

      <div className="mx-auto flex min-h-screen w-full max-w-md items-center justify-center">
        <div className="app-card animate-slide-up w-full overflow-hidden rounded-lg shadow-2xl">
          <div className="app-card-header p-8 text-center text-white">
            <h1 className="mb-2 text-3xl font-bold tracking-tight">{title}</h1>
            <p className="text-lg font-medium opacity-90">{subtitle}</p>
          </div>
          <div className="p-8">{children}</div>
        </div>
      </div>
    </main>
  );
}

