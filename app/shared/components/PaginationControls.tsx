import type { ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { Icon } from "~/shared/components/Icons";

interface PaginationControlsProps {
  summary: ReactNode;
  currentPage: number;
  onPrevious: () => void;
  onNext: () => void;
  hasPrevious: boolean;
  hasNext: boolean;
  className?: string;
}

export function PaginationControls({
  summary,
  currentPage,
  onPrevious,
  onNext,
  hasPrevious,
  hasNext,
  className = "",
}: PaginationControlsProps) {
  const { t } = useTranslation();

  return (
    <div
      className={`flex flex-col items-center justify-between gap-4 rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800 sm:flex-row ${className}`.trim()}
    >
      <div className="text-sm text-gray-600 dark:text-gray-400">{summary}</div>

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onPrevious}
          disabled={!hasPrevious}
          className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 px-4 py-2 text-gray-700 transition-all disabled:cursor-not-allowed disabled:opacity-40 hover:bg-gray-100 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
        >
          <Icon name="chevronLeft" className="h-4 w-4" />
          {t("common.previous")}
        </button>

        <div className="rounded-lg bg-indigo-50 px-3 py-2 text-sm font-medium text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300">
          {currentPage}
        </div>

        <button
          type="button"
          onClick={onNext}
          disabled={!hasNext}
          className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 font-medium text-white transition-all disabled:cursor-not-allowed disabled:opacity-40 hover:bg-indigo-700"
        >
          {t("common.next")}
          <Icon name="chevronRight" className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
