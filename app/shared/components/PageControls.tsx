import { LanguageSwitcher } from "~/components/LanguageSwitcher";
import { ThemeSwitcher } from "~/components/ThemeSwitcher";

export function PageControls() {
  return (
    <div className="flex items-center gap-3">
      <LanguageSwitcher />
      <ThemeSwitcher />
    </div>
  );
}
