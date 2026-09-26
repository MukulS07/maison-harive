"use client";

import { useTreasuryBag } from "@/context/TreasuryBagContext";
import type { Product } from "@/content/products";
import { BagIcon, CheckIcon } from "../icons";

export function ProductBagButton({ product }: { product: Product }) {
  const { isInBag, toggleBag } = useTreasuryBag();
  const reserved = isInBag(product.id);

  return (
    <button
      type="button"
      onClick={() => toggleBag(product)}
      className={`inline-flex items-center justify-center gap-2 rounded-btn px-6 py-3.5 font-display text-[12px] font-semibold tracking-[0.25em] uppercase transition-all duration-300 ${
        reserved
          ? "border border-gold bg-gold/25 text-gold-bright shadow-glow hover:bg-gold/15"
          : "border border-gold/60 bg-black/60 text-ivory hover:border-gold hover:bg-gold/15 hover:text-gold-pale"
      }`}
    >
      {reserved ? <CheckIcon size={16} className="text-gold-bright" /> : <BagIcon size={16} />}
      {reserved ? "IN TREASURY BAG ✓" : "RESERVE IN BAG"}
    </button>
  );
}
