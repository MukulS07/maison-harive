"use client";

import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";
import { useTreasuryBag } from "@/context/TreasuryBagContext";
import { BagIcon, CloseIcon } from "../icons";
import { Eyebrow } from "../ui";

type BagModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export function BagModal({ isOpen, onClose }: BagModalProps) {
  const { bag, bagCount, removeFromBag, clearBag } = useTreasuryBag();

  useEffect(() => {
    if (isOpen) {
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Escape") onClose();
      };
      window.addEventListener("keydown", handleKeyDown);
      return () => window.removeEventListener("keydown", handleKeyDown);
    }
  }, [isOpen, onClose]);

  const conciergeLink = `/concierge?section=appointments&message=${encodeURIComponent(
    `Reserved artefacts for private viewing: ${bag.map((p) => p.name).join(", ")}`
  )}`;

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Your Treasury Bag"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
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
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.25, ease: [0.2, 0.7, 0.1, 1] }}
            className="relative z-10 flex max-h-[85vh] w-full max-w-lg flex-col overflow-hidden rounded-xl border border-gold/50 bg-[#0e0c0a] text-center shadow-2xl"
          >
            {/* Header */}
            <div className="relative border-b border-gold/25 p-6 pb-4 sm:p-8 sm:pb-5">
              <button
                type="button"
                onClick={onClose}
                aria-label="Close bag"
                className="absolute top-4 right-4 flex size-11 cursor-pointer items-center justify-center rounded-full border border-gold/30 text-ivory-soft transition-colors hover:border-gold hover:text-gold-bright"
              >
                <CloseIcon size={16} />
              </button>

              <div className="mx-auto mb-3 flex size-12 items-center justify-center rounded-full border border-gold bg-gold/15 text-gold-bright shadow-glow sm:size-14">
                <BagIcon size={24} />
              </div>

              <Eyebrow className="text-[10px] tracking-[0.3em] text-gold sm:text-[11px]">
                MAISON HARIVÉ · TREASURY
              </Eyebrow>
              <h2 className="km-gold-text mt-1.5 font-display text-[22px] font-bold tracking-[0.06em] uppercase sm:text-[26px]">
                Your Treasury Bag
              </h2>
              <p className="mt-1 font-serif text-[15px] text-ivory-soft italic">
                {bagCount === 0 ? (
                  "0 artefacts currently reserved."
                ) : (
                  <>
                    <span className="font-display font-bold text-gold-bright not-italic">{bagCount}</span>{" "}
                    {bagCount === 1 ? "artefact" : "artefacts"} reserved for private viewing.
                  </>
                )}
              </p>
            </div>

            {/* Content Body: List of reserved items or Empty State */}
            <div className="flex-1 overflow-y-auto p-5 sm:p-6 text-left">
              {bagCount === 0 ? (
                <div className="space-y-4 py-4 text-center">
                  <div className="rounded border border-gold/25 bg-surface/50 p-4 text-left">
                    <span className="font-display text-[10.5px] tracking-[0.25em] text-gold uppercase">
                      The Maison Promise
                    </span>
                    <p className="mt-1 font-serif text-[13.5px] leading-relaxed text-ivory/80 italic">
                      &ldquo;Every treasure from the MAISON comes with a special note, a gift to keep, and its Certificate of Authenticity.&rdquo;
                    </p>
                  </div>
                  <p className="text-[14px] text-ivory-soft/80 italic">
                    Browse the royal archive and select &ldquo;Reserve in Bag&rdquo; on any piece to prepare your private curation.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center justify-between pb-1">
                    <span className="font-display text-[11px] tracking-[0.2em] text-gold uppercase">
                      Selected Artefacts
                    </span>
                    <button
                      type="button"
                      onClick={clearBag}
                      className="font-display text-[10.5px] tracking-[0.15em] text-ivory-soft/60 hover:text-rose-300 uppercase transition-colors"
                    >
                      Clear All
                    </button>
                  </div>

                  <ul className="space-y-2.5">
                    {bag.map((item) => (
                      <li
                        key={item.id}
                        className="flex items-center justify-between gap-3 rounded-lg border border-gold/20 bg-surface/60 p-3"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="relative size-12 shrink-0 overflow-hidden rounded-full border border-gold/40 bg-black">
                            {item.image ? (
                              <Image
                                src={item.image}
                                alt={item.name}
                                fill
                                sizes="48px"
                                className="object-contain p-1"
                              />
                            ) : (
                              <span className="flex h-full w-full items-center justify-center font-display text-xs text-gold">
                                MH
                              </span>
                            )}
                          </div>
                          <div className="min-w-0">
                            <p className="truncate font-display text-[13px] font-semibold tracking-[0.1em] text-ivory uppercase">
                              {item.name}
                            </p>
                            <p className="font-serif text-[12px] text-gold italic">
                              {item.price || "Price Upon Request"}
                            </p>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => removeFromBag(item.id)}
                          aria-label={`Remove ${item.name} from bag`}
                          className="flex size-10 shrink-0 cursor-pointer items-center justify-center rounded-full text-ivory-soft/60 transition-colors hover:bg-gold/15 hover:text-rose-300"
                        >
                          <CloseIcon size={15} />
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Footer Actions */}
            <div className="border-t border-line/60 bg-black/50 p-5 sm:p-6 text-center">
              {bagCount > 0 ? (
                <div className="flex flex-col gap-2.5">
                  <Link
                    href={conciergeLink}
                    onClick={onClose}
                    className="inline-flex items-center justify-center rounded-btn bg-gold px-6 py-3.5 font-display text-[12px] font-bold tracking-[0.25em] text-on-gold shadow-glow hover:bg-gold-bright transition-all"
                  >
                    DISPATCH RESERVATIONS TO CONCIERGE
                  </Link>
                  <button
                    type="button"
                    onClick={onClose}
                    className="font-display text-[11px] tracking-[0.2em] text-gold-pale/80 hover:text-gold-bright py-1.5 uppercase transition-colors"
                  >
                    Continue Browsing
                  </button>
                </div>
              ) : (
                <div className="flex flex-col gap-2.5">
                  <Link
                    href="/chambers"
                    onClick={onClose}
                    className="inline-flex items-center justify-center rounded-btn bg-gold px-6 py-3 font-display text-[12px] font-bold tracking-[0.25em] text-on-gold shadow-glow hover:bg-gold-bright transition-all"
                  >
                    EXPLORE THE CHAMBERS
                  </Link>
                  <button
                    type="button"
                    onClick={onClose}
                    className="font-display text-[11px] tracking-[0.2em] text-gold-pale/80 hover:text-gold-bright py-1.5 uppercase transition-colors"
                  >
                    Close
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
