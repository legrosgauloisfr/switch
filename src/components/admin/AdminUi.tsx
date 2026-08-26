"use client";

import Link from "next/link";
import type { InputHTMLAttributes, TextareaHTMLAttributes, SelectHTMLAttributes } from "react";

export function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`bg-white rounded-2xl border border-border p-5 ${className}`}>{children}</div>;
}

export function PageHeader({
  title,
  subtitle,
  action,
}: {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex items-start justify-between gap-4 mb-6">
      <div>
        <h1 className="text-[24px] font-bold">{title}</h1>
        {subtitle && <p className="mt-1 text-[14px] text-ink-secondary">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

export function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="block text-[13px] font-semibold text-ink-secondary mb-1.5">{label}</span>
      {children}
      {hint && <span className="block mt-1 text-[12px] text-ink-tertiary">{hint}</span>}
    </label>
  );
}

const inputClass =
  "w-full rounded-lg border border-border-strong px-3 py-2.5 text-[14px] text-ink bg-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30";

export function TextInput(props: InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={`${inputClass} ${props.className ?? ""}`} />;
}

export function TextArea(props: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea {...props} className={`${inputClass} min-h-24 resize-y ${props.className ?? ""}`} />;
}

export function Select(props: SelectHTMLAttributes<HTMLSelectElement>) {
  return <select {...props} className={`${inputClass} ${props.className ?? ""}`} />;
}

export function StatusPill({ active }: { active: boolean }) {
  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold ${
        active ? "bg-emerald-100 text-emerald-700" : "bg-black/[0.06] text-ink-tertiary"
      }`}
    >
      {active ? "Actif" : "Inactif"}
    </span>
  );
}

export function PrimaryButton({
  children,
  ...rest
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...rest}
      className={`px-4 py-2.5 rounded-lg bg-primary text-white text-[14px] font-bold hover:bg-primary-hover transition-colors disabled:opacity-50 ${rest.className ?? ""}`}
    >
      {children}
    </button>
  );
}

export function SecondaryButton({
  children,
  ...rest
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...rest}
      className={`px-4 py-2.5 rounded-lg border border-border-strong bg-white text-ink text-[14px] font-semibold hover:border-primary/45 transition-colors ${rest.className ?? ""}`}
    >
      {children}
    </button>
  );
}

export function DangerButton({
  children,
  ...rest
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...rest}
      className={`px-4 py-2.5 rounded-lg border border-red-200 bg-white text-red-600 text-[14px] font-semibold hover:bg-red-50 transition-colors ${rest.className ?? ""}`}
    >
      {children}
    </button>
  );
}

export function DraftBanner({
  onRestore,
  onDismiss,
}: {
  onRestore: () => void;
  onDismiss: () => void;
}) {
  return (
    <div className="flex items-center justify-between gap-3 mb-5 px-4 py-3 rounded-xl bg-amber-50 border border-amber-200">
      <span className="text-[13.5px] text-amber-900">
        Un brouillon non enregistré a été trouvé pour cette fiche.
      </span>
      <div className="flex-none flex gap-2">
        <button
          type="button"
          onClick={onRestore}
          className="px-3 py-1.5 rounded-lg bg-amber-600 text-white text-[12.5px] font-bold hover:bg-amber-700"
        >
          Restaurer
        </button>
        <button
          type="button"
          onClick={onDismiss}
          className="px-3 py-1.5 rounded-lg text-amber-800 text-[12.5px] font-semibold hover:bg-amber-100"
        >
          Ignorer
        </button>
      </div>
    </div>
  );
}

export function AddLink({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="px-4 py-2.5 rounded-lg bg-primary text-white text-[14px] font-bold hover:bg-primary-hover transition-colors"
    >
      + {label}
    </Link>
  );
}
