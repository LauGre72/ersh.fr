import type { ReactNode } from "react";
import type { AlerteNotification, CouleurPastel, OrientationEleve, ParcoursEleve } from "./types";

export const pastelClasses: Record<CouleurPastel, string> = {
  rose: "border-rose-200 bg-rose-50 text-rose-900",
  bleu: "border-sky-200 bg-sky-50 text-sky-900",
  vert: "border-emerald-200 bg-emerald-50 text-emerald-900",
  jaune: "border-amber-200 bg-amber-50 text-amber-950",
  orange: "border-orange-200 bg-orange-50 text-orange-900",
  violet: "border-violet-200 bg-violet-50 text-violet-900",
  gris: "border-gray-200 bg-gray-50 text-gray-900",
  menthe: "border-teal-200 bg-teal-50 text-teal-900",
  lavande: "border-indigo-200 bg-indigo-50 text-indigo-900",
  peche: "border-red-200 bg-red-50 text-red-900",
};

export function parcoursClass(parcours: ParcoursEleve) {
  return parcours === "Première demande"
    ? "border-l-4 border-l-emerald-500 bg-emerald-50"
    : "border-l-4 border-l-sky-500 bg-sky-50";
}

export function alerteClass(alerte?: AlerteNotification) {
  if (alerte === "expiree") return "ring-2 ring-red-500";
  if (alerte === "echeance_annee_scolaire") return "ring-2 ring-red-300";
  return "";
}

export function orientationIcon(orientation: OrientationEleve) {
  return orientation === "Ordinaire" ? "🏫" : "⛵";
}

export function Button({
  children,
  variant = "primary",
  className = "",
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "danger" | "ghost";
}) {
  const variants = {
    primary: "bg-blue-700 text-white hover:bg-blue-800",
    secondary: "border border-gray-300 bg-white text-gray-800 hover:bg-gray-50",
    danger: "bg-red-600 text-white hover:bg-red-700",
    ghost: "text-gray-700 hover:bg-gray-100",
  };

  return (
    <button
      type="button"
      className={`inline-flex items-center justify-center rounded-lg px-3 py-2 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-50 ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

export function TextInput({
  label,
  className = "",
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & { label: string }) {
  return (
    <label className="block text-sm font-medium text-gray-700">
      <span>{label}</span>
      <input
        className={`mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 ${className}`}
        {...props}
      />
    </label>
  );
}

export function SelectInput({
  label,
  children,
  className = "",
  ...props
}: React.SelectHTMLAttributes<HTMLSelectElement> & { label: string; children: ReactNode }) {
  return (
    <label className="block text-sm font-medium text-gray-700">
      <span>{label}</span>
      <select
        className={`mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 ${className}`}
        {...props}
      >
        {children}
      </select>
    </label>
  );
}

export function TextareaInput({
  label,
  className = "",
  ...props
}: React.TextareaHTMLAttributes<HTMLTextAreaElement> & { label: string }) {
  return (
    <label className="block text-sm font-medium text-gray-700">
      <span>{label}</span>
      <textarea
        className={`mt-1 min-h-24 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 ${className}`}
        {...props}
      />
    </label>
  );
}

export function StatusMessage({ type, children }: { type: "error" | "success" | "info"; children: ReactNode }) {
  const classes = {
    error: "border-red-200 bg-red-50 text-red-800",
    success: "border-emerald-200 bg-emerald-50 text-emerald-800",
    info: "border-blue-200 bg-blue-50 text-blue-800",
  };
  return <div className={`rounded-lg border px-4 py-3 text-sm ${classes[type]}`}>{children}</div>;
}
