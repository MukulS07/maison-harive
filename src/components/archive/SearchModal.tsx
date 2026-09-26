"use client";

import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { products, type Product } from "@/content/products";
import { CloseIcon, SearchIcon } from "../icons";
import { Eyebrow } from "../ui";

type SearchModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Escape") onClose();
      };
      window.addEventListener("keydown", handleKeyDown);
      return () => window.removeEventListener("keydown", handleKeyDown);
    }
  }, [isOpen, onClose]);

  const filtered = query.trim()
    ? products.filter(
        (p) =>
          p.name.toLowerCase().includes(query.toLowerCase()) ||
          p.category.toLowerCase().includes(query.toLowerCase()) ||
          (p.tagline && p.tagline.toLowerCase().includes(query.toLowerCase())) ||
          (p.typeLabel && p.typeLabel.toLowerCase().includes(query.toLowerCase()))
      )
    : products.slice(0, 8); // show first 8 as curations

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Search the Royal Archive"
          className="fixed inset-0 z-50 flex flex-col items-center justify-start p-4 pt-16 sm:pt-24"
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/90 backdrop-blur-md"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.98 }}
            transition={{ duration: 0.25, ease: [0.2, 0.7, 0.1, 1] }}
            className="relative z-10 flex w-full max-w-2xl flex-col overflow-hidden rounded-xl border border-gold/50 bg-[#0e0c0a] shadow-2xl"
          >
            {/* Search Input Bar */}
            <div className="flex items-center gap-3 border-b border-gold/30 px-5 py-4">
              <span className="text-gold-bright">
                <SearchIcon size={20} />
              </span>
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by name, motif, or category (e.g. Amber, Brooch, Kalangi)..."
                className="flex-1 bg-transparent font-display text-[16px] tracking-[0.04em] text-ivory placeholder:text-ivory-soft/40 focus:outline-none"
              />
              <button
                type="button"
                onClick={onClose}
                aria-label="Close search"
                className="flex size-11 cursor-pointer items-center justify-center rounded-full border border-gold/30 text-ivory-soft transition-colors hover:border-gold hover:text-gold-bright"
              >
                <CloseIcon size={16} />
              </button>
            </div>

            {/* Results / Suggestions */}
            <div className="max-h-[60vh] overflow-y-auto p-4 sm:p-5">
              <div className="mb-3 flex items-center justify-between px-1">
                <Eyebrow className="text-[10px] tracking-[0.3em] text-gold">
                  {query.trim()
                    ? `${filtered.length} ${filtered.length === 1 ? "ARTEFACT FOUND" : "ARTEFACTS FOUND"}`
                    : "CURATED SELECTIONS FROM THE ARCHIVE"}
                </Eyebrow>
                <span className="font-display text-[10px] tracking-[0.2em] text-ivory-soft/60 uppercase">
                  ESC to close
                </span>
              </div>

              {filtered.length === 0 ? (
                <div className="py-12 text-center">
                  <p className="font-serif text-[17px] text-ivory-soft italic">
                    No royal artefacts matched &ldquo;{query}&rdquo;
                  </p>
                  <p className="mt-2 font-display text-[11px] tracking-[0.2em] text-gold/70 uppercase">
                    Try searching for Buttons, Brooches, Kalangi, or Pendants
                  </p>
                </div>
              ) : (
                <ul className="space-y-2">
                  {filtered.map((item) => (
                    <SearchResultItem key={item.id} product={item} onSelect={onClose} />
                  ))}
                </ul>
              )}
            </div>

            {/* Footer */}
            <div className="border-t border-line/60 bg-black/40 px-5 py-3 text-center sm:text-left">
              <p className="font-display text-[10.5px] tracking-[0.2em] text-gold-pale/70 uppercase">
                {products.length} Authenticated Pieces in The Royal Collection
              </p>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

function SearchResultItem({ product, onSelect }: { product: Product; onSelect: () => void }) {
  return (
    <li>
      <Link
        href={`/archive/${product.id}`}
        onClick={onSelect}
        className="group flex items-center gap-4 rounded-lg border border-transparent p-2.5 transition-all duration-200 hover:border-gold/40 hover:bg-gold/10 focus-visible:border-gold focus-visible:outline-none"
      >
        <div className="relative size-12 shrink-0 overflow-hidden rounded-full border border-gold/40 bg-black">
          {product.image ? (
            <Image
              src={product.image}
              alt={product.name}
              fill
              sizes="48px"
              className="object-contain p-1 transition-transform group-hover:scale-110"
            />
          ) : (
            <span className="flex h-full w-full items-center justify-center font-display text-xs text-gold">
              MH
            </span>
          )}
        </div>
        <div className="min-w-0 flex-1 text-left">
          <div className="flex items-center gap-2">
            <span className="truncate font-display text-[13px] font-semibold tracking-[0.12em] text-ivory uppercase group-hover:text-gold-bright sm:text-[14px]">
              {product.name}
            </span>
            <span className="rounded-pill border border-gold/30 bg-gold/5 px-2 py-0.5 font-display text-[9.5px] tracking-[0.15em] text-gold uppercase">
              {product.category}
            </span>
          </div>
          {product.tagline && (
            <p className="truncate font-serif text-[12.5px] text-ivory-soft/75 italic">
              {product.tagline}
            </p>
          )}
        </div>
        {product.price && (
          <span className="shrink-0 font-serif text-[14px] text-gold italic">
            {product.price}
          </span>
        )}
      </Link>
    </li>
  );
}
