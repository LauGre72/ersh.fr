import type { ReactNode } from "react";
import type { AlerteNotification, CouleurPastel, OrientationEleve, ParcoursEleve } from "./types";

export const pastelClasses: Record<CouleurPastel, string> = {
  rose: "border-[#FF7F7F]/35 bg-[#FF7F7F]/10 text-[#153A5B]",
  bleu: "border-[#2A6F97]/30 bg-[#2A6F97]/10 text-[#153A5B]",
  vert: "border-[#6FBF73]/35 bg-[#6FBF73]/10 text-[#153A5B]",
  jaune: "border-[#FFC857]/45 bg-[#FFC857]/20 text-[#153A5B]",
  orange: "border-orange-200 bg-orange-50 text-orange-900",
  violet: "border-[#9D8DF1]/35 bg-[#9D8DF1]/15 text-[#153A5B]",
  gris: "border-[#D6E2EA] bg-[#F7FAFC] text-[#153A5B]",
  menthe: "border-[#4CC9C9]/35 bg-[#4CC9C9]/10 text-[#153A5B]",
  lavande: "border-[#9D8DF1]/30 bg-[#9D8DF1]/10 text-[#153A5B]",
  peche: "border-[#FF7F7F]/30 bg-[#FF7F7F]/10 text-[#153A5B]",
};

export function parcoursClass(parcours: ParcoursEleve) {
  return parcours === "Première demande"
    ? "border-[#2A6F97]/35 bg-[#2A6F97]/15 text-[#153A5B]"
    : "border-[#6FBF73]/45 bg-[#6FBF73]/20 text-[#153A5B]";
}

export function alerteClass(alerte?: AlerteNotification) {
  if (alerte === "expiree") return "ring-2 ring-[#FF7F7F]";
  if (alerte === "echeance_annee_scolaire") return "ring-2 ring-[#FFC857]";
  return "";
}

export function orientationIcon(orientation: OrientationEleve) {
  return orientation === "Ordinaire" ? "O" : "D";
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
    primary: "bg-[#2A6F97] text-white hover:bg-[#235D80]",
    secondary: "border border-[#D6E2EA] bg-white text-[#153A5B] hover:bg-[#F7FAFC]",
    danger: "bg-[#FF7F7F] text-[#153A5B] hover:bg-[#F26F6F]",
    ghost: "text-[#153A5B] hover:bg-[#E6EDF2]",
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
    <label className="block text-sm font-medium text-[#153A5B]">
      <span>{label}</span>
      <input
        className={`mt-1 w-full rounded-lg border border-[#D6E2EA] bg-white px-3 py-2 text-gray-900 outline-none transition focus:border-[#2A6F97] focus:ring-2 focus:ring-[#2A6F97]/15 ${className}`}
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
    <label className="block text-sm font-medium text-[#153A5B]">
      <span>{label}</span>
      <select
        className={`mt-1 w-full rounded-lg border border-[#D6E2EA] bg-white px-3 py-2 text-gray-900 outline-none transition focus:border-[#2A6F97] focus:ring-2 focus:ring-[#2A6F97]/15 ${className}`}
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
    <label className="block text-sm font-medium text-[#153A5B]">
      <span>{label}</span>
      <textarea
        className={`mt-1 min-h-24 w-full rounded-lg border border-[#D6E2EA] bg-white px-3 py-2 text-gray-900 outline-none transition focus:border-[#2A6F97] focus:ring-2 focus:ring-[#2A6F97]/15 ${className}`}
        {...props}
      />
    </label>
  );
}

export function StatusMessage({ type, children }: { type: "error" | "success" | "info"; children: ReactNode }) {
  const classes = {
    error: "border-[#FF7F7F]/40 bg-[#FF7F7F]/10 text-red-900",
    success: "border-[#6FBF73]/35 bg-[#6FBF73]/15 text-emerald-900",
    info: "border-[#2A6F97]/20 bg-[#2A6F97]/10 text-[#153A5B]",
  };
  return <div className={`rounded-lg border px-4 py-3 text-sm ${classes[type]}`}>{children}</div>;
}
