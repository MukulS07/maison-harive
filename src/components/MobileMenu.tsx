"use client";

import Link from "next/link";
import { useRef } from "react";
import { site } from "@/content/site";
import { CloseIcon, MenuIcon } from "./icons";

const doors = [
  { label: "The Chambers", href: "/chambers" },
  ...site.nav,
];

/**
 * Phone / tablet navigation (spec §7): a 44px round button that opens a full-screen list of
 * doors. Built on <dialog>, so focus is trapped and Escape closes it.
 */
export function MobileMenu({ className = "" }: { className?: string }) {
  const ref = useRef<HTMLDialogElement>(null);
  const close = () => ref.current?.close();

  return (
    <>
      <button
        type="button"
        aria-label="Open menu"
        aria-haspopup="dialog"
        onClick={() => ref.current?.showModal()}
        className={`flex size-11 cursor-pointer items-center justify-center rounded-pill border border-gold/40 text-ivory transition-colors duration-300 hover:border-gold hover:text-gold-bright ${className}`}
      >
        <MenuIcon />
      </button>

      <dialog
        ref={ref}
        aria-label="Menu"
        className="m-0 h-dvh max-h-none w-screen max-w-none bg-black text-ivory backdrop:bg-black/80 open:flex open:flex-col"
      >
        <div className="flex h-16 items-center justify-between border-b border-line px-5">
          <span className="font-display text-[15px] font-semibold tracking-[0.28em]">{site.logo}</span>
          <button
            type="button"
            aria-label="Close menu"
            onClick={close}
            className="flex size-11 cursor-pointer items-center justify-center rounded-pill border border-gold/40 hover:text-gold-bright"
          >
            <CloseIcon />
          </button>
        </div>
        <nav aria-label="Main" className="flex flex-1 flex-col items-center justify-center gap-1 px-5">
          {doors.map((door, i) => (
            <Link
              key={`${door.label}-${i}`}
              href={door.href}
              onClick={close}
              className="px-4 py-3 text-center text-[26px] italic transition-colors duration-300 hover:text-gold-bright"
            >
              {door.label}
            </Link>
          ))}
          <span aria-hidden="true" className="my-6 inline-block size-2.5 rotate-45 border border-gold" />
          <Link
            href={site.privateViewing.href}
            onClick={close}
            className="font-display text-xs tracking-[0.35em] text-gold-bright uppercase"
          >
            {site.privateViewing.label}
          </Link>
        </nav>
      </dialog>
    </>
  );
}
