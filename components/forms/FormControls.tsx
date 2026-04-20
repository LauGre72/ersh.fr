import type { InputHTMLAttributes, ReactNode, SelectHTMLAttributes, TextareaHTMLAttributes } from "react";

export type FormTheme = "blue" | "cyan" | "emerald";

const themeClasses: Record<FormTheme, {
  sectionHover: string;
  focus: string;
  checkbox: string;
  primary: string;
  primaryHover: string;
  primaryGradient: string;
  primaryGradientHover: string;
}> = {
  blue: {
    sectionHover: "hover:border-blue-200",
    focus: "focus:border-blue-500 focus:ring-blue-100",
    checkbox: "text-blue-600",
    primary: "bg-blue-600",
    primaryHover: "hover:bg-blue-700",
    primaryGradient: "from-blue-600 to-blue-700",
    primaryGradientHover: "hover:from-blue-700 hover:to-blue-800",
  },
  cyan: {
    sectionHover: "hover:border-cyan-200",
    focus: "focus:border-cyan-500 focus:ring-cyan-100",
    checkbox: "text-cyan-600",
    primary: "bg-cyan-600",
    primaryHover: "hover:bg-cyan-700",
    primaryGradient: "from-cyan-600 to-cyan-700",
    primaryGradientHover: "hover:from-cyan-700 hover:to-cyan-800",
  },
  emerald: {
    sectionHover: "hover:border-emerald-200",
    focus: "focus:border-emerald-500 focus:ring-emerald-100",
    checkbox: "text-emerald-600",
    primary: "bg-emerald-600",
    primaryHover: "hover:bg-emerald-700",
    primaryGradient: "from-emerald-600 to-emerald-700",
    primaryGradientHover: "hover:from-emerald-700 hover:to-emerald-800",
  },
};

export function FormHeader({
  title,
  description,
  theme = "blue",
}: {
  title: string;
  description: string;
  theme?: FormTheme;
}) {
  const gradient = {
    blue: "from-blue-600 to-blue-800",
    cyan: "from-cyan-600 to-cyan-800",
    emerald: "from-emerald-600 to-emerald-800",
  }[theme];

  return (
    <div className={`mb-8 rounded-lg bg-gradient-to-r ${gradient} p-6 text-white shadow-md`}>
      <h2 className="text-3xl font-bold text-white">{title}</h2>
      <p className="mt-2 text-white/90">{description}</p>
    </div>
  );
}

export function FormSection({
  title,
  children,
  theme = "blue",
}: {
  title: string;
  children: ReactNode;
  theme?: FormTheme;
}) {
  return (
    <section className={`rounded-xl border-2 border-gray-200 bg-gradient-to-br from-gray-50 to-white p-6 transition ${themeClasses[theme].sectionHover}`}>
      <h3 className="mb-4 text-lg font-bold text-gray-900">{title}</h3>
      {children}
    </section>
  );
}

export function FormLabel({ children }: { children: ReactNode }) {
  return <label className="mb-2 block text-sm font-semibold text-gray-700">{children}</label>;
}

export function FormInput({
  label,
  theme = "blue",
  ...props
}: { label: string; theme?: FormTheme } & InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className="block">
      <FormLabel>{label}</FormLabel>
      <input
        {...props}
        className={`w-full rounded-lg border-2 border-gray-200 px-4 py-2 outline-none transition focus:ring-2 ${themeClasses[theme].focus}`}
      />
    </label>
  );
}

export function FormSelect({
  label,
  options,
  theme = "blue",
  ...props
}: {
  label: string;
  options: { value: string; label: string }[];
  theme?: FormTheme;
} & SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <label className="block">
      <FormLabel>{label}</FormLabel>
      <select
        {...props}
        className={`w-full rounded-lg border-2 border-gray-200 bg-white px-4 py-2 outline-none transition focus:ring-2 ${themeClasses[theme].focus}`}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}

export function FormTextarea({
  label,
  theme = "blue",
  className = "",
  ...props
}: { label: string; theme?: FormTheme } & TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <label className="block">
      <FormLabel>{label}</FormLabel>
      <textarea
        {...props}
        className={`min-h-24 w-full rounded-lg border-2 border-gray-200 px-4 py-3 outline-none transition focus:ring-2 ${themeClasses[theme].focus} ${className}`}
      />
    </label>
  );
}

export function FormCheckbox({
  label,
  theme = "blue",
  ...props
}: { label: string; theme?: FormTheme } & InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className="flex cursor-pointer items-center gap-3 rounded-lg p-2 transition hover:bg-gray-100">
      <input
        type="checkbox"
        {...props}
        className={`h-5 w-5 cursor-pointer rounded border-gray-300 ${themeClasses[theme].checkbox}`}
      />
      <span className="text-sm text-gray-700">{label}</span>
    </label>
  );
}

export function SubmitButton({
  children = "✨ Générer le PDF",
  theme = "blue",
}: {
  children?: ReactNode;
  theme?: FormTheme;
}) {
  const classes = themeClasses[theme];

  return (
    <button
      type="submit"
      className={`w-full rounded-lg bg-gradient-to-r ${classes.primaryGradient} px-6 py-4 text-lg font-bold text-white shadow-lg transition ${classes.primaryGradientHover} hover:shadow-xl`}
    >
      {children}
    </button>
  );
}

export function AddButton({
  children,
  onClick,
  theme = "blue",
}: {
  children: ReactNode;
  onClick: () => void;
  theme?: FormTheme;
}) {
  const classes = themeClasses[theme];

  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full rounded-lg ${classes.primary} px-4 py-3 font-semibold text-white shadow-sm transition ${classes.primaryHover}`}
    >
      {children}
    </button>
  );
}

export function MoveButton({
  direction,
  disabled,
  onClick,
}: {
  direction: "up" | "down";
  disabled?: boolean;
  onClick: () => void;
}) {
  const label = direction === "up" ? "Monter" : "Descendre";

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      title={label}
      className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-gray-200 text-gray-800 transition hover:bg-gray-300 disabled:cursor-not-allowed disabled:opacity-40 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
    >
      <span aria-hidden="true">{direction === "up" ? "↑" : "↓"}</span>
    </button>
  );
}

export function DeleteIconButton({
  label,
  onClick,
}: {
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      title={label}
      className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-red-700 text-white shadow-sm transition hover:bg-red-800 focus:outline-none focus:ring-2 focus:ring-red-300 focus:ring-offset-2"
    >
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        className="h-4 w-4"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M3 6h18" />
        <path d="M8 6V4h8v2" />
        <path d="M19 6l-1 14H6L5 6" />
        <path d="M10 11v5" />
        <path d="M14 11v5" />
      </svg>
    </button>
  );
}
