import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";

/* Shared building blocks from spec §0. */

export function Eyebrow({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <p className={`font-display text-[11px] tracking-eyebrow text-gold uppercase md:text-label ${className}`}>
      {children}
    </p>
  );
}

const buttonBase =
  "inline-flex max-w-full items-center justify-center gap-3 rounded-btn px-6 py-3.5 font-display text-[12px] tracking-[0.22em] text-center transition-[box-shadow,background-color,color] duration-300 sm:px-[34px] sm:py-4 sm:text-[13px] sm:tracking-[0.28em] md:text-[14px] md:tracking-[0.32em]";

const buttonVariants = {
  primary: `${buttonBase} bg-gold font-bold text-on-gold shadow-glow hover:bg-gold-bright hover:shadow-glow-strong`,
  secondary: `${buttonBase} border border-gold text-ivory hover:border-gold-bright hover:text-gold-bright`,
};

type ButtonVariant = keyof typeof buttonVariants;

export function ButtonLink({
  variant = "primary",
  className = "",
  ...props
}: ComponentProps<typeof Link> & { variant?: ButtonVariant }) {
  return <Link {...props} className={`${buttonVariants[variant]} ${className}`} />;
}

export function Button({
  variant = "primary",
  className = "",
  ...props
}: ComponentProps<"button"> & { variant?: ButtonVariant }) {
  return <button {...props} className={`${buttonVariants[variant]} cursor-pointer ${className}`} />;
}

/** Rounded section/filter pill (spec §0.4). */
export function pillClass(active: boolean, compact = false) {
  const size = compact ? "px-4 py-2 text-[14px]" : "px-5 py-2.5 text-[15px] md:text-nav";
  return `inline-flex shrink-0 items-center rounded-pill border-[1.5px] font-medium leading-tight whitespace-nowrap transition-all duration-300 backdrop-blur-md shadow-sm ${size} ${
    active
      ? "border-gold-bright bg-gold/25 text-gold-pale shadow-[0_0_16px_rgba(232,199,127,0.35)]"
      : "border-gold bg-black/60 text-ivory hover:border-gold-bright hover:bg-gold/20 hover:text-gold-bright hover:shadow-[0_0_16px_rgba(232,199,127,0.3)]"
  }`;
}

/** Double gold frame around a placeholder or photo (spec §0.6). */
export function FramedPlaceholder({
  caption,
  className = "",
  id,
  children,
}: {
  caption: string;
  className?: string;
  id?: string;
  children?: ReactNode;
}) {
  return (
    <div id={id} className={`border border-gold p-3 ${className}`}>
      <div className="relative flex h-full w-full items-center justify-center overflow-hidden border border-gold/40 bg-surface">
        {children ?? (
          <span className="px-4 text-center font-display text-[11px] tracking-[0.25em] text-muted md:text-xs">
            {caption}
          </span>
        )}
      </div>
    </div>
  );
}

/** Huge outlined Roman numeral. */
export function Numeral({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <span aria-hidden="true" className={`km-numeral font-display leading-none select-none ${className}`}>
      {children}
    </span>
  );
}

/** Small rotated-square ornament. */
export function Diamond({ className = "", filled = false }: { className?: string; filled?: boolean }) {
  return (
    <span
      aria-hidden="true"
      className={`inline-block rotate-45 border border-gold ${filled ? "bg-gold" : "bg-black"} ${className}`}
    />
  );
}

/** Moving gold background with a dark scrim over it. `scrim` is 0–1. */
export function GoldBackdrop({ scrim, className = "" }: { scrim: number; className?: string }) {
  return (
    <div aria-hidden="true" className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}>
      <div className="km-gold-motion absolute inset-0" />
      <div className="absolute inset-0 bg-black" style={{ opacity: scrim }} />
    </div>
  );
}
