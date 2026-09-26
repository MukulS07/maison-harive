import Link from "next/link";
import type { ReactNode } from "react";
import { site } from "@/content/site";

type SiteHeaderProps = {
  left?: ReactNode;
  center?: ReactNode;
  right?: ReactNode;
  /** Keep the centre zone on phones. By default it hides below md so the sides have room. */
  centerOnMobile?: boolean;
  className?: string;
};

/**
 * Three-zone header (spec §0.1). Each page decides what goes in each zone.
 * On desktop the side zones share the leftover width equally, so the centre stays centred.
 * On tablets (≥768px) and above, the grid layout activates. On mobile, flex layout.
 */
export function SiteHeader({
  left,
  center,
  right,
  centerOnMobile = false,
  className = "",
}: SiteHeaderProps) {
  return (
    <header
      className={`relative z-20 flex h-16 items-center justify-between gap-4 border-b border-line px-5 md:grid md:h-header md:grid-cols-[minmax(12rem,1fr)_auto_minmax(12rem,1fr)] md:px-gutter ${className}`}
    >
      <div className="flex min-w-0 items-center justify-start overflow-hidden">{left}</div>
      {center && (
        <div className={`min-w-0 items-center justify-center overflow-hidden ${centerOnMobile ? "flex" : "hidden md:flex"}`}>
          {center}
        </div>
      )}
      <div className="flex min-w-0 items-center justify-end overflow-hidden">{right}</div>
    </header>
  );
}

/** "MAISON HARIVÉ" wordmark: Cinzel 600, 18px, tracking 0.3em. */
export function Logo({ href = "/", className = "" }: { href?: string; className?: string }) {
  return (
    <Link
      href={href}
      aria-label={`${site.brand}, home`}
      className={`whitespace-nowrap font-display text-[15px] font-semibold tracking-[0.28em] text-ivory transition-colors duration-300 hover:text-gold-bright md:text-lg md:tracking-[0.3em] ${className}`}
    >
      {site.logo}
    </Link>
  );
}

/** Small centred label for the header, e.g. "I · THE LEGACY" (spec §0.5). */
export function HeaderEyebrow({ children }: { children: ReactNode }) {
  return (
    <p className="whitespace-nowrap font-display text-[11px] tracking-[0.3em] text-gold md:text-label md:tracking-[0.4em]">
      {children}
    </p>
  );
}
