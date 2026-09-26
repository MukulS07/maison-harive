"use client";

import { useState } from "react";
import Link from "next/link";
import { products, type ProductCategory, toNumeral } from "@/content/products";
import { BackButton } from "../BackButton";
import { BagIcon, SearchIcon } from "../icons";
import { HeaderEyebrow, SiteHeader } from "../SiteHeader";
import { ButtonLink, Eyebrow, GoldBackdrop } from "../ui";
import { Medallion } from "../archive/Medallion";
import { ProductCard3D } from "../archive/ProductCard3D";
import { SearchModal } from "../archive/SearchModal";
import { BagModal } from "../archive/BagModal";
import { useTreasuryBag } from "@/context/TreasuryBagContext";

type FilterId = "all" | ProductCategory;

const filters: { id: FilterId; label: string }[] = [
  { id: "all", label: "All Pieces" },
  { id: "buttons", label: "Buttons" },
  { id: "brooches", label: "Brooches" },
  { id: "kalangi", label: "Kalangi" },
  { id: "pendant", label: "Pendants" },
];

export function TreasuresView() {
  const [activeFilter, setActiveFilter] = useState<FilterId>("all");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isBagOpen, setIsBagOpen] = useState(false);
  const { bagCount } = useTreasuryBag();

  const filteredProducts =
    activeFilter === "all" ? products : products.filter((p) => p.category === activeFilter);

  const featured = products.filter((p) => p.featured);

  return (
    <main className="min-h-dvh bg-black text-ivory">
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
      <BagModal isOpen={isBagOpen} onClose={() => setIsBagOpen(false)} />

      {/* Hero Banner */}
      <section className="relative overflow-hidden border-b border-line">
        <GoldBackdrop scrim={0.7} />
        <SiteHeader
          left={<BackButton href="/archive" label="The Archive" />}
          center={<HeaderEyebrow>THE ROYAL VAULT</HeaderEyebrow>}
          right={
            <div className="flex items-center gap-2.5 md:gap-4">
              <Link
                href="/concierge"
                className="flex items-center gap-1.5 rounded-pill border border-gold/50 bg-gold/10 px-3.5 py-1.5 font-display text-[11px] tracking-[0.25em] text-gold-bright uppercase transition-all duration-300 hover:border-gold hover:bg-gold/25 hover:text-gold-pale"
              >
                THE CONCIERGE
              </Link>
              <button
                type="button"
                onClick={() => setIsSearchOpen(true)}
                aria-label="Search the Vault"
                className="flex size-11 cursor-pointer items-center justify-center text-ivory transition-colors duration-300 hover:text-gold-bright"
              >
                <SearchIcon />
              </button>
              <button
                type="button"
                onClick={() => setIsBagOpen(true)}
                aria-label={`Your treasury bag, ${bagCount} pieces`}
                className="flex h-11 cursor-pointer items-center gap-2 px-1 font-display text-label tracking-[0.2em] text-ivory transition-colors duration-300 hover:text-gold-bright"
              >
                <BagIcon />
                <span className="font-display text-[12px] text-gold-bright">{bagCount}</span>
              </button>
            </div>
          }
        />
        <div className="relative mx-auto flex max-w-4xl flex-col items-center gap-4 px-5 pt-12 pb-16 text-center">
          <Eyebrow>MAISON HARIVÉ · THE COMPLETE CATALOGUE</Eyebrow>
          <h1 className="km-gold-text font-display text-[clamp(48px,7vw,96px)] leading-none font-bold tracking-[0.04em]">
            ALL TREASURES
          </h1>
          <p className="max-w-xl text-[20px] text-ivory-soft italic md:text-[24px]">
            Every royal artefact in the Maison, crafted for distinction and timeless elegance.
          </p>
        </div>
      </section>

      {/* Featured Masterpieces Strand Section */}
      <section className="relative border-b border-line px-5 py-14">
        <div className="mx-auto max-w-km">
          <div className="mb-8 text-center">
            <Eyebrow className="mb-2">THE CROWN ARTEFACTS</Eyebrow>
            <h2 className="font-display text-[24px] font-semibold tracking-[0.1em] text-ivory uppercase md:text-[28px]">
              Masterpieces of the House
            </h2>
          </div>

          <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-5">
            {featured.map((p, i) => (
              <Link
                key={p.id}
                href={`/archive/${p.id}`}
                className="group flex flex-col items-center rounded-lg border border-gold/30 bg-surface/50 p-5 text-center transition-all duration-300 hover:-translate-y-1.5 hover:border-gold hover:shadow-glow"
              >
                <Medallion
                  product={p}
                  numeral={toNumeral(i)}
                  size={100}
                  className="mb-4 transition-transform duration-300 group-hover:scale-105"
                />
                <span className="font-display text-[13px] font-semibold tracking-[0.16em] text-ivory uppercase transition-colors duration-300 group-hover:text-gold-bright">
                  {p.name}
                </span>
                <span className="mt-1 text-[15px] text-gold italic">{p.price}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Catalogue Inventory Grid */}
      <section className="mx-auto max-w-km px-5 py-16">
        {/* Category Filters */}
        <div className="mb-12 flex flex-wrap items-center justify-center gap-3">
          {filters.map((f) => {
            const active = activeFilter === f.id;
            return (
              <button
                key={f.id}
                type="button"
                onClick={() => setActiveFilter(f.id)}
                className={`cursor-pointer rounded-pill border px-5 py-2.5 font-display text-[13px] tracking-[0.2em] uppercase transition-colors duration-300 ${
                  active
                    ? "border-gold bg-gold/20 font-bold text-gold-bright shadow-glow"
                    : "border-gold/30 text-ivory/70 hover:border-gold/60 hover:text-ivory"
                }`}
              >
                {f.label}
              </button>
            );
          })}
        </div>

        {/* Product Grid with Minimal 3D Motion */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {filteredProducts.map((p, i) => (
            <ProductCard3D
              key={`${p.id}-${i}`}
              product={p}
              numeral={toNumeral(i)}
              index={i}
            />
          ))}
        </div>

        {/* Private Viewing CTA */}
        <div className="mt-20 flex flex-col items-center gap-5 border-t border-line pt-14 text-center">
          <Eyebrow>BESPOKE ARTISANRY</Eyebrow>
          <p className="max-w-md text-[18px] text-ivory-soft italic">
            Looking for a custom piece or wish to view the treasures in private?
          </p>
          <ButtonLink href="/chambers/atelier" className="px-8">
            REQUEST PRIVATE VIEWING
          </ButtonLink>
        </div>
      </section>
    </main>
  );
}
