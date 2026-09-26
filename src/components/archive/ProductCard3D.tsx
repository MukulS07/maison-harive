"use client";

import { motion, useReducedMotion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import type { Product } from "@/content/products";
import { Medallion } from "./Medallion";

type ProductCard3DProps = {
  product: Product;
  numeral: string;
  index: number;
};

export function ProductCard3D({ product, numeral, index }: ProductCard3DProps) {
  const reduce = useReducedMotion() ?? false;
  const [isFlipped, setIsFlipped] = useState(false);

  const cardVariants = {
    front: {
      rotateY: 0,
      transition: { duration: 0.55, ease: [0.23, 1, 0.32, 1] as const },
    },
    back: {
      rotateY: 180,
      transition: { duration: 0.55, ease: [0.23, 1, 0.32, 1] as const },
    },
  };

  const backVariants = {
    front: {
      rotateY: 0,
      transition: { duration: 0.55, ease: [0.23, 1, 0.32, 1] as const },
    },
    back: {
      rotateY: -180,
      transition: { duration: 0.55, ease: [0.23, 1, 0.32, 1] as const },
    },
  };

  return (
    <motion.div
      className="group relative h-full min-h-[390px] w-full [perspective:1200px]"
      initial={reduce ? { opacity: 0 } : { opacity: 0, y: 25 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.5,
        delay: Math.min(index * 0.04, 0.35),
        ease: [0.2, 0.7, 0.1, 1],
      }}
      onMouseEnter={() => !reduce && setIsFlipped(true)}
      onMouseLeave={() => !reduce && setIsFlipped(false)}
    >
      <Link
        href={`/archive/${product.id}`}
        aria-label={`${product.name}, ${product.price ?? "Royal Piece"}`}
        onClick={(e) => {
          if (typeof window !== "undefined" && window.matchMedia("(hover: none)").matches && !isFlipped) {
            e.preventDefault();
            setIsFlipped(true);
          }
        }}
        className="block h-full w-full outline-none"
      >
        {/* Card Frame with 3D Preservation */}
        <div className="relative h-full min-h-[390px] w-full [transform-style:preserve-3d]">
          {/* ================= FRONT FACE: Editorial Medallion ================= */}
          <motion.div
            className="absolute inset-0 flex flex-col justify-between overflow-hidden rounded-md border border-gold/30 bg-surface/90 p-5 backdrop-blur-sm transition-colors duration-500 [backface-visibility:hidden] [transform-style:preserve-3d] group-hover:border-gold/80 group-hover:bg-surface-raised"
            animate={isFlipped ? "back" : "front"}
            variants={cardVariants}
            style={{
              boxShadow: isFlipped
                ? "none"
                : "0 12px 30px -10px rgba(0, 0, 0, 0.6), 0 0 1px 1px rgba(201, 164, 92, 0.15)",
            }}
          >
            {/* Geometric Gold Corner Brackets */}
            <span aria-hidden="true" className="pointer-events-none absolute top-2.5 left-2.5 size-2 border-t border-l border-gold/50 transition-colors duration-300 group-hover:border-gold-bright" />
            <span aria-hidden="true" className="pointer-events-none absolute top-2.5 right-2.5 size-2 border-t border-r border-gold/50 transition-colors duration-300 group-hover:border-gold-bright" />
            <span aria-hidden="true" className="pointer-events-none absolute bottom-2.5 left-2.5 size-2 border-b border-l border-gold/50 transition-colors duration-300 group-hover:border-gold-bright" />
            <span aria-hidden="true" className="pointer-events-none absolute bottom-2.5 right-2.5 size-2 border-b border-r border-gold/50 transition-colors duration-300 group-hover:border-gold-bright" />

            {/* Top Meta */}
            <div className="flex items-center justify-between text-xs">
              <span className="font-display text-[12px] font-semibold tracking-[0.25em] text-gold-bright/90">
                {numeral}
              </span>
              <span className="rounded-pill border border-gold/25 bg-black/40 px-2.5 py-0.5 font-display text-[10px] tracking-[0.22em] text-gold uppercase transition-colors duration-300 group-hover:border-gold/60 group-hover:text-gold-pale">
                {product.featured ? "Masterpiece" : product.category}
              </span>
            </div>

            {/* Center: Medallion Preview with aura */}
            <div className="relative my-4 flex items-center justify-center">
              <div
                aria-hidden="true"
                className="absolute size-28 rounded-full bg-gold/10 blur-xl transition-all duration-500 group-hover:bg-gold-bright/25 group-hover:blur-2xl"
              />
              <Medallion
                product={product}
                numeral={numeral}
                size={96}
                className="relative transition-all duration-400 group-hover:shadow-glow-strong"
              />
            </div>

            {/* Info: Name & Tagline */}
            <div className="flex flex-col items-center gap-1.5 text-center">
              <h3 className="font-display text-[14px] font-semibold tracking-[0.16em] text-ivory uppercase transition-colors duration-300 group-hover:text-gold-bright md:text-[15px]">
                {product.name}
              </h3>
              {product.tagline && (
                <p className="line-clamp-2 max-w-[230px] font-serif text-[13.5px] italic leading-snug tracking-normal text-ivory/75 transition-colors duration-300 group-hover:text-gold-pale">
                  &ldquo;{product.tagline}&rdquo;
                </p>
              )}
              {product.price && (
                <span className="text-[15px] text-gold italic transition-colors duration-300 group-hover:text-gold-pale">
                  {product.price}
                </span>
              )}
            </div>

            {/* Bottom prompt with flip indicator */}
            <div className="mt-3 flex items-center justify-center border-t border-gold/15 pt-2.5">
              <span className="inline-flex items-center gap-1.5 font-display text-[10.5px] tracking-[0.22em] text-gold/70 uppercase transition-all duration-300 group-hover:gap-2 group-hover:text-gold-bright">
                Reveal Actual Artefact <span className="text-gold-bright">↻</span>
              </span>
            </div>
          </motion.div>

          {/* ================= BACK FACE: Actual Full-Bleed Photograph ================= */}
          <motion.div
            className="absolute inset-0 flex flex-col justify-between overflow-hidden rounded-md border border-gold/70 bg-black p-4 [backface-visibility:hidden] [transform-style:preserve-3d]"
            initial={{ rotateY: -180 }}
            animate={isFlipped ? "front" : "back"}
            variants={backVariants}
            style={{
              boxShadow: isFlipped
                ? "0 24px 48px -12px rgba(0, 0, 0, 0.95), 0 0 35px -5px rgba(201, 164, 92, 0.35)"
                : "none",
            }}
          >
            {/* Full-bleed actual product photograph */}
            <div className="absolute inset-0 z-0 overflow-hidden bg-black">
              {product.image ? (
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  className="object-contain p-3 transition-transform duration-700 ease-soft group-hover:scale-105"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center">
                  <Medallion product={product} numeral={numeral} size={140} />
                </div>
              )}
              {/* Subtle top and bottom luxury vignette scrims */}
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/80" />
            </div>

            {/* Corner brackets on back */}
            <span aria-hidden="true" className="pointer-events-none absolute top-2.5 left-2.5 z-10 size-2.5 border-t border-l border-gold-bright" />
            <span aria-hidden="true" className="pointer-events-none absolute top-2.5 right-2.5 z-10 size-2.5 border-t border-r border-gold-bright" />
            <span aria-hidden="true" className="pointer-events-none absolute bottom-2.5 left-2.5 z-10 size-2.5 border-b border-l border-gold-bright" />
            <span aria-hidden="true" className="pointer-events-none absolute bottom-2.5 right-2.5 z-10 size-2.5 border-b border-r border-gold-bright" />

            {/* Back Header */}
            <div className="relative z-10 flex items-center justify-between">
              <span className="rounded-pill border border-gold/40 bg-black/75 px-2.5 py-0.5 font-display text-[10px] tracking-[0.2em] text-gold-bright uppercase backdrop-blur-sm">
                {numeral} · Artefact
              </span>
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setIsFlipped(false);
                }}
                className="flex items-center gap-1 rounded-pill border border-gold/40 bg-black/75 px-2.5 py-0.5 font-display text-[9px] tracking-[0.2em] text-gold-pale uppercase backdrop-blur-sm transition-colors hover:border-gold hover:text-gold-bright"
                title="Flip back to medallion"
              >
                <span>Photo</span>
                <span className="text-[10px]">↻</span>
              </button>
            </div>

            {/* Back Footer: Title & Inspect CTA */}
            <div className="relative z-10 flex flex-col items-center gap-1.5 px-2 text-center">
              <h4 className="font-display text-[13px] font-bold tracking-[0.16em] text-gold-bright uppercase drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]">
                {product.name}
              </h4>
              {product.tagline && (
                <p className="line-clamp-1 font-serif text-[12px] italic leading-snug tracking-normal text-ivory/80 drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)]">
                  &ldquo;{product.tagline}&rdquo;
                </p>
              )}
              <span className="mt-0.5 inline-flex items-center gap-1.5 rounded-pill border border-gold/80 bg-gold/20 px-3.5 py-1 font-display text-[10px] tracking-[0.22em] text-gold-pale uppercase backdrop-blur-md transition-all duration-300 hover:border-gold hover:bg-gold/35 hover:text-white">
                Inspect Artefact →
              </span>
            </div>
          </motion.div>
        </div>
      </Link>
    </motion.div>
  );
}
