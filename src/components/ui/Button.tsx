"use client";

import type { ButtonHTMLAttributes } from "react";

type Variant = "primary" | "secondary" | "ghost" | "disabled";

const VARIANT_CLASSES: Record<Variant, string> = {
  primary:
    "bg-primary text-white hover:bg-primary-hover active:scale-[0.99] transition-colors",
  secondary:
    "bg-surface text-ink border border-border-strong hover:border-primary/45 transition-colors",
  ghost: "bg-transparent text-ink-secondary hover:text-primary transition-colors",
  disabled: "bg-black/[0.06] text-ink-quaternary cursor-not-allowed",
};

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  fullWidth?: boolean;
  height?: number;
}

export default function Button({
  variant = "primary",
  fullWidth = true,
  height = 56,
  className = "",
  disabled,
  ...rest
}: Props) {
  const effectiveVariant = disabled ? "disabled" : variant;
  return (
    <button
      type="button"
      disabled={disabled}
      style={{ height }}
      className={`${fullWidth ? "w-full" : ""} rounded-2xl font-bold text-[16px] flex items-center justify-center ${VARIANT_CLASSES[effectiveVariant]} ${className}`}
      {...rest}
    />
  );
}
