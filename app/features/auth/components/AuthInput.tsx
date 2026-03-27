import type { InputHTMLAttributes, ReactNode } from "react";

interface AuthInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  icon: ReactNode;
}

export function AuthInput({ label, icon, ...props }: AuthInputProps) {
  return (
    <div>
      <label
        htmlFor={props.id}
        className="mb-2 block text-sm font-semibold uppercase tracking-wider text-gray-800 opacity-75 dark:text-gray-200"
      >
        {label}
      </label>
      <div className="relative">
        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500 dark:text-gray-400">
          {icon}
        </span>
        <input
          {...props}
          className="w-full rounded-lg border-2 border-gray-200 bg-transparent py-3 pl-10 pr-4 text-black transition-colors duration-300 focus:border-indigo-500 focus:outline-none dark:border-gray-700 dark:text-gray-100 dark:focus:border-indigo-400"
        />
      </div>
    </div>
  );
}
