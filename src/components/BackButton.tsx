import Link from "next/link";
import { ArrowLeft } from "./icons";

type BackButtonProps = {
  href: string;
  label: string;
  /** Plain arrow + label with no circle (e.g. "← The Gate" on the Chambers page). */
  bare?: boolean;
  className?: string;
};

/**
 * Header-left back control (spec §0.2): a 44px gold-ringed circle with a left arrow,
 * followed by an italic label. On phones the label is visually hidden but still announced.
 */
export function BackButton({ href, label, bare = false, className = "" }: BackButtonProps) {
  return (
    <Link
      href={href}
      className={`group inline-flex items-center gap-3.5 whitespace-nowrap text-nav italic text-ivory transition-colors duration-300 hover:text-gold-bright ${className}`}
    >
      {bare ? (
        <ArrowLeft className="text-gold-bright transition-transform duration-300 ease-royal group-hover:-translate-x-1" />
      ) : (
        <span className="flex size-11 shrink-0 items-center justify-center rounded-pill border border-gold text-gold-bright transition-shadow duration-300 group-hover:shadow-glow">
          <ArrowLeft className="transition-transform duration-300 ease-royal group-hover:-translate-x-0.5" />
        </span>
      )}
      <span className={bare ? "" : "max-sm:sr-only"}>{label}</span>
    </Link>
  );
}
