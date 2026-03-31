import { useTranslation } from "react-i18next";
import type { PostSort } from "~/features/posts/types";
import { Icon } from "~/shared/components/Icons";

interface PostSortSelectProps {
  value: PostSort;
  onChange: (value: PostSort) => void;
}

export function PostSortSelect({ value, onChange }: PostSortSelectProps) {
  const { t } = useTranslation();

  return (
    <label className="flex items-center gap-2 text-sm font-medium text-gray-600 dark:text-gray-300">
      {t("post.feed.sortLabel")}
      <span className="relative">
        <select
          value={value}
          onChange={(event) => onChange(event.target.value as PostSort)}
          className="appearance-none rounded-lg border border-gray-200 bg-white px-3 py-2 pr-12 text-sm text-gray-700 outline-none transition-colors focus:border-indigo-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
        >
          <option value="recent">{t("post.feed.sort.recent")}</option>
          <option value="best_rated">{t("post.feed.sort.bestRated")}</option>
          <option value="worst_rated">{t("post.feed.sort.worstRated")}</option>
        </select>
        <span className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-gray-500 dark:text-gray-400">
          <Icon name="chevronDown" className="h-4 w-4" />
        </span>
      </span>
    </label>
  );
}
