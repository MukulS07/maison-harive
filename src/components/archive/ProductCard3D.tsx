"use client";

import { motion, useMotionValue, useSpring, useTransform, useReducedMotion } from "framer-motion";
import Link from "next/link";
import { type MouseEvent, useRef, useState } from "react";
import type { Product } from "@/content/products";
import { Medallion } from "./Medallion";

type ProductCard3DProps = {
  product: Product;
  numeral: string;
  index: number;
};

export function ProductCard3D({ product, numeral, index }: ProductCard3DProps) {
  const reduce = useReducedMotion() ?? false;
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  // Normalized mouse coordinates from -0.5 to 0.5
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Smooth physical spring response
  const springConfig = { stiffness: 260, damping: 22, mass: 0.6 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  // Subtle 3D tilt: ±9 degrees for minimal luxury motion
  const rotateX = useTransform(smoothY, [-0.5, 0.5], ["9deg", "-9deg"]);
  const rotateY = useTransform(smoothX, [-0.5, 0.5], ["-9deg", "9deg"]);

  // Dynamic specular light reflection that glints across the card surface
  const glareX = useTransform(smoothX, [-0.5, 0.5], ["15%", "85%"]);
  const glareY = useTransform(smoothY, [-0.5, 0.5], ["15%", "85%"]);
  const glareBg = useTransform(
    [glareX, glareY],
    ([gx, gy]) =>
      `radial-gradient(420px circle at ${gx} ${gy}, rgba(251, 231, 184, 0.18), rgba(201, 164, 92, 0.05) 45%, transparent 75%)`
  );

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (reduce) return;
    const rect = cardRef.current?.getBoundingClientRect();
    if (!rect) return;
    const xPct = (e.clientX - rect.left) / rect.width - 0.5;
    const yPct = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(xPct);
    mouseY.set(yPct);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <motion.div
      ref={cardRef}
      className="group relative h-full w-full [perspective:1100px]"
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      initial={reduce ? { opacity: 0 } : { opacity: 0, y: 30, rotateX: 12 }}
      animate={{ opacity: 1, y: 0, rotateX: 0 }}
      transition={{
        duration: 0.6,
        delay: Math.min(index * 0.04, 0.4),
        ease: [0.2, 0.7, 0.1, 1],
      }}
    >
      <Link
        href={`/archive/${product.id}`}
        aria-label={`${product.name}, ${product.price ?? "Royal Piece"}`}
        className="block h-full outline-none"
      >
        <motion.div
          className="relative flex h-full min-h-[360px] flex-col justify-between overflow-hidden rounded-md border border-gold/30 bg-surface/85 p-6 backdrop-blur-sm transition-colors duration-500 group-hover:border-gold/80 group-hover:bg-surface-raised"
          style={{
            rotateX: reduce ? 0 : rotateX,
            rotateY: reduce ? 0 : rotateY,
            transformStyle: "preserve-3d",
            boxShadow: isHovered
              ? "0 24px 48px -12px rgba(0, 0, 0, 0.8), 0 0 35px -5px rgba(201, 164, 92, 0.28)"
              : "0 12px 30px -10px rgba(0, 0, 0, 0.6), 0 0 1px 1px rgba(201, 164, 92, 0.15)",
          }}
          whileHover={reduce ? undefined : { scale: 1.02 }}
          transition={{ type: "spring", stiffness: 300, damping: 24 }}
        >
          {/* Moving Specular Gold Glare Layer */}
          {!reduce && (
            <motion.div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 z-30 transition-opacity duration-300"
              style={{
                background: glareBg,
                opacity: isHovered ? 1 : 0,
              }}
            />
          )}

          {/* Delicate Geometric Gold Corner Brackets */}
          <span aria-hidden="true" className="pointer-events-none absolute top-2.5 left-2.5 size-2 border-t border-l border-gold/50 transition-colors duration-300 group-hover:border-gold-bright" />
          <span aria-hidden="true" className="pointer-events-none absolute top-2.5 right-2.5 size-2 border-t border-r border-gold/50 transition-colors duration-300 group-hover:border-gold-bright" />
          <span aria-hidden="true" className="pointer-events-none absolute bottom-2.5 left-2.5 size-2 border-b border-l border-gold/50 transition-colors duration-300 group-hover:border-gold-bright" />
          <span aria-hidden="true" className="pointer-events-none absolute bottom-2.5 right-2.5 size-2 border-b border-r border-gold/50 transition-colors duration-300 group-hover:border-gold-bright" />

          {/* Layer 1: Header / Category Meta (3D depth: 20px) */}
          <div
            className="flex items-center justify-between text-xs transition-transform duration-300"
            style={{ transform: isHovered && !reduce ? "translateZ(20px)" : "translateZ(0px)" }}
          >
            <span className="font-display text-[12px] font-semibold tracking-[0.25em] text-gold-bright/90">
              {numeral}
            </span>
            <span className="rounded-pill border border-gold/25 bg-black/40 px-2.5 py-0.5 font-display text-[10px] tracking-[0.22em] text-gold uppercase transition-colors duration-300 group-hover:border-gold/60 group-hover:text-gold-pale">
              {product.featured ? "Masterpiece" : product.category}
            </span>
          </div>

          {/* Layer 2: 3D Floating Medallion (3D depth: 40px) */}
          <div
            className="relative my-6 flex items-center justify-center transition-transform duration-400 ease-soft"
            style={{
              transform: isHovered && !reduce ? "translateZ(40px) scale(1.06)" : "translateZ(0px) scale(1)",
            }}
          >
            {/* Ambient gold aura behind medallion */}
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

          {/* Layer 3: Product Info (3D depth: 25px) */}
          <div
            className="flex flex-col items-center gap-1.5 text-center transition-transform duration-300"
            style={{ transform: isHovered && !reduce ? "translateZ(25px)" : "translateZ(0px)" }}
          >
            <h3 className="font-display text-[14px] font-semibold tracking-[0.16em] text-ivory uppercase transition-colors duration-300 group-hover:text-gold-bright md:text-[15px]">
              {product.name}
            </h3>
            {product.price && (
              <span className="text-[17px] text-gold italic transition-colors duration-300 group-hover:text-gold-pale">
                {product.price}
              </span>
            )}
          </div>

          {/* Layer 4: Micro Action Prompt (3D depth: 15px) */}
          <div
            className="mt-4 flex items-center justify-center border-t border-gold/15 pt-3 transition-transform duration-300"
            style={{ transform: isHovered && !reduce ? "translateZ(15px)" : "translateZ(0px)" }}
          >
            <span className="inline-flex items-center gap-1.5 font-display text-[11px] tracking-[0.28em] text-gold/70 uppercase transition-all duration-300 group-hover:gap-2.5 group-hover:text-gold-bright">
              Inspect Artefact <span className="text-gold-bright">→</span>
            </span>
          </div>
        </motion.div>
      </Link>
    </motion.div>
  );
}
