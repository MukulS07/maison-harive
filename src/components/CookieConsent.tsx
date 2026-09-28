"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      if (!localStorage.getItem("km-cookie-consent")) {
        queueMicrotask(() => setVisible(true));
      }
    } catch {
      /* storage unavailable */
    }
  }, []);

  function accept() {
    try {
      localStorage.setItem("km-cookie-consent", "accepted");
    } catch {
      /* noop */
    }
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-label="Cookie consent"
      className="fixed inset-x-0 bottom-0 z-[9999] border-t border-gold/30 bg-black/95 px-5 py-4 backdrop-blur-sm"
    >
      <div className="mx-auto flex max-w-4xl flex-col items-center gap-4 sm:flex-row sm:justify-between">
        <p className="font-serif text-[14px] text-ivory-soft">
          We use only essential cookies for site functionality.{" "}
          <Link
            href="/privacy"
            className="text-gold underline underline-offset-4 transition-colors hover:text-gold-bright"
          >
            Privacy Policy
          </Link>
        </p>
        <button
          onClick={accept}
          className="shrink-0 border border-gold bg-transparent px-6 py-2 font-display text-[12px] tracking-[0.2em] text-gold uppercase transition-colors hover:bg-gold hover:text-black focus:outline-none focus-visible:ring-2 focus-visible:ring-gold"
        >
          Accept
        </button>
      </div>
    </div>
  );
}
