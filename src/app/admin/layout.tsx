import type { Metadata } from "next";
import Link from "next/link";
import { type ReactNode } from "react";

export const metadata: Metadata = {
  title: "Maison Harivé · Private Office & Vault Control",
  description: "Administrative console for concierge approvals, royal appointments, and product catalogue pricing.",
};

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-[#0a0806] text-[#efe6d2] font-sans antialiased selection:bg-[#c9a45c] selection:text-black">
      {/* Top Royal Admin Banner */}
      <header className="sticky top-0 z-50 border-b border-[#2e261d] bg-[#0d0b08]/90 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-6">
            <Link href="/admin" className="flex items-center gap-3 group">
              <span className="flex size-9 items-center justify-center rounded-lg border border-[#c9a45c]/40 bg-[#c9a45c]/10 text-lg font-serif text-[#e8c77f] shadow-[0_0_15px_rgba(201,164,92,0.15)] group-hover:border-[#c9a45c]">
                MH
              </span>
              <div>
                <span className="font-serif text-[15px] font-bold tracking-[0.2em] text-[#e8c77f] uppercase block leading-none">
                  Maison Harivé
                </span>
                <span className="text-[10px] tracking-[0.25em] text-[#a89878] uppercase font-sans mt-0.5 block">
                  Private Office & Vault
                </span>
              </div>
            </Link>

            {/* Nav links */}
            <nav className="hidden md:flex items-center gap-1 pl-4 border-l border-[#2e261d]">
              <Link
                href="/admin"
                className="px-3.5 py-1.5 rounded-md text-[13px] font-medium tracking-wide text-[#efe6d2]/80 hover:text-[#e8c77f] hover:bg-[#c9a45c]/10 transition-colors"
              >
                Dashboard
              </Link>
              <Link
                href="/admin/concierge"
                className="px-3.5 py-1.5 rounded-md text-[13px] font-medium tracking-wide text-[#efe6d2]/80 hover:text-[#e8c77f] hover:bg-[#c9a45c]/10 transition-colors flex items-center gap-1.5"
              >
                Concierge Requests
                <span className="size-2 rounded-full bg-amber-400 animate-pulse" />
              </Link>
              <Link
                href="/admin/products"
                className="px-3.5 py-1.5 rounded-md text-[13px] font-medium tracking-wide text-[#efe6d2]/80 hover:text-[#e8c77f] hover:bg-[#c9a45c]/10 transition-colors"
              >
                Catalogue & Pricing
              </Link>
              <Link
                href="/admin/settings"
                className="px-3.5 py-1.5 rounded-md text-[13px] font-medium tracking-wide text-[#efe6d2]/80 hover:text-[#e8c77f] hover:bg-[#c9a45c]/10 transition-colors"
              >
                Cloud Sync
              </Link>
            </nav>
          </div>

          <div className="flex items-center gap-4">
            <Link
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-[#c9a45c]/40 bg-[#c9a45c]/10 px-4 py-1.5 text-[12px] font-medium tracking-[0.1em] text-[#e8c77f] uppercase hover:bg-[#c9a45c]/20 hover:border-[#c9a45c] transition-all"
            >
              <span>Public Store</span>
              <span className="text-xs">↗</span>
            </Link>
          </div>
        </div>

        {/* Mobile Nav strip */}
        <div className="flex md:hidden overflow-x-auto border-t border-[#2e261d]/60 px-4 py-2 gap-2 text-xs">
          <Link href="/admin" className="px-3 py-1 rounded bg-[#c9a45c]/10 text-[#e8c77f] whitespace-nowrap">
            Dashboard
          </Link>
          <Link href="/admin/concierge" className="px-3 py-1 rounded bg-[#c9a45c]/10 text-[#e8c77f] whitespace-nowrap">
            Concierge
          </Link>
          <Link href="/admin/products" className="px-3 py-1 rounded bg-[#c9a45c]/10 text-[#e8c77f] whitespace-nowrap">
            Catalogue
          </Link>
          <Link href="/admin/settings" className="px-3 py-1 rounded bg-[#c9a45c]/10 text-[#e8c77f] whitespace-nowrap">
            Settings
          </Link>
        </div>
      </header>

      {/* Main Admin Content Body */}
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  );
}
