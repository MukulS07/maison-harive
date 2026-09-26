"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useMemo, useState } from "react";
import { products, toNumeral, type ProductCategory, type Product } from "@/content/products";
import { ProductCard3D } from "./ProductCard3D";

type FilterId = "all" | "featured" | ProductCategory;

const filterTabs: { id: FilterId; label: string }[] = [
  { id: "all", label: "All Pieces" },
  { id: "featured", label: "Featured" },
  { id: "buttons", label: "Buttons" },
  { id: "brooches", label: "Brooches" },
  { id: "kalangi", label: "Kalangi" },
  { id: "pendant", label: "Pendants" },
];

export function AllTreasures3DSection() {
  const [activeFilter, setActiveFilter] = useState<FilterId>("all");

  const filteredProducts = useMemo(() => {
    if (activeFilter === "all") return products;
    if (activeFilter === "featured") return products.filter((p) => p.featured);
    return products.filter((p) => p.category === activeFilter && !p.featured);
  }, [activeFilter]);

  const getProductNumeral = (product: Product, index: number) => {
    if (product.featured) {
      const featuredIdx = products.filter((p) => p.featured).findIndex((p) => p.id === product.id);
      return toNumeral(featuredIdx >= 0 ? featuredIdx : index);
    }
    const catIdx = products
      .filter((p) => p.category === product.category && !p.featured)
      .findIndex((p) => p.id === product.id);
    return toNumeral(catIdx >= 0 ? catIdx : index);
  };

  return (
    <section id="every-piece" className="relative mx-auto w-full max-w-km px-5 pt-6 pb-24">
      {/* Maison Treasure Promise */}
      <div className="mb-6 flex justify-center text-center">
        <p className="max-w-5xl font-serif text-[13.5px] italic text-gold/85 sm:text-[15px] md:text-[16px] md:whitespace-nowrap">
          &ldquo;Every treasure from the MAISON comes with a special note, a gift to keep, and its Certificate of Authenticity&rdquo;
        </p>
      </div>

      {/* Category filter pills */}
      <div className="mb-10 flex flex-wrap items-center justify-center gap-2 md:gap-3">
        {filterTabs.map((tab) => {
          const count =
            tab.id === "all"
              ? products.length
              : tab.id === "featured"
                ? products.filter((p) => p.featured).length
                : products.filter((p) => p.category === tab.id && !p.featured).length;
          const isSelected = activeFilter === tab.id;

          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveFilter(tab.id)}
              className={`group relative cursor-pointer rounded-pill px-4 py-2 font-display text-[12px] tracking-[0.22em] uppercase transition-all duration-300 md:px-5 md:py-2.5 md:text-[13px] ${
                isSelected
                  ? "text-gold-bright shadow-[0_0_20px_rgba(201,164,92,0.3)]"
                  : "text-ivory/65 hover:text-ivory"
              }`}
            >
              {isSelected && (
                <motion.span
                  layoutId="treasuresFilterPill"
                  className="absolute inset-0 rounded-pill border border-gold bg-gold/15"
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
              {!isSelected && (
                <span className="absolute inset-0 rounded-pill border border-gold/20 bg-surface/40 transition-colors duration-300 group-hover:border-gold/50 group-hover:bg-surface/70" />
              )}
              <span className="relative z-10 flex items-center gap-1.5">
                <span>{tab.label}</span>
                <span className="text-[10px] text-gold/60 group-hover:text-gold-bright/80">({count})</span>
              </span>
            </button>
          );
        })}
      </div>

      {/* Product Grid with minimal 3D motion */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeFilter}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -15 }}
          transition={{ duration: 0.3 }}
          className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5"
        >
          {filteredProducts.map((product, i) => (
            <ProductCard3D
              key={product.id}
              product={product}
              numeral={getProductNumeral(product, i)}
              index={i}
            />
          ))}
        </motion.div>
      </AnimatePresence>
    </section>
  );
}
