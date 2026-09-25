"use client";

import Link from "next/link";
import { useState } from "react";
import { featuredProducts, toNumeral } from "@/content/products";
import { site } from "@/content/site";
import { Eyebrow, GoldBackdrop, Numeral, pillClass } from "../ui";

type Card = { id: string; name: string; price?: string; href?: string };

/** Chamber II, opened (spec §3.2): the collection grid. */
export function CollectionChamber() {
  const c = site.chambers.collection;
  const filters = site.collection.filters;
  const [filter, setFilter] = useState<string>(filters[0]);

  // Pieces are not tagged with these placeholder categories yet, so only "All pieces" lists them.
  const cards: Card[] =
    filter === filters[0]
      ? [
          ...featuredProducts.map((p) => ({ id: p.id, name: p.name, price: p.price, href: `/archive/${p.id}` })),
          { id: "next", name: site.collection.nextArtefact },
        ]
      : [];

  return (
    <>
      <section className="relative flex flex-col items-center gap-4 overflow-hidden px-5 pt-12 pb-14 text-center md:min-h-[calc(440px-var(--km-header-h))] md:pt-[52px]">
        <GoldBackdrop scrim={0.66} />
        <Eyebrow className="relative">{c.eyebrow}</Eyebrow>
        <h1 className="km-gold-text relative font-display text-[clamp(48px,7vw,100px)] leading-none font-bold tracking-[0.02em]">
          {c.title}
        </h1>
        <div
          role="group"
          aria-label="Filter pieces"
          className="km-scroll-x relative -mx-5 mt-5 flex max-w-[calc(100%+40px)] gap-2.5 overflow-x-auto px-5"
        >
          {filters.map((f) => (
            <button
              key={f}
              type="button"
              aria-pressed={filter === f}
              onClick={() => setFilter(f)}
              className={`${pillClass(filter === f)} cursor-pointer px-5`}
            >
              {f}
            </button>
          ))}
        </div>
      </section>
      {/* The short gold cord hanging from the band. */}
      <span aria-hidden="true" className="mx-auto block h-10 w-px bg-gold" />

      <section aria-live="polite" className="mx-auto max-w-[1280px] px-5 pt-10 pb-24 md:px-10 xl:px-0">
        {cards.length === 0 ? (
          <p className="py-16 text-center text-body text-muted italic">No pieces in {filter} yet.</p>
        ) : (
          <ul className="grid grid-cols-1 gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
            {cards.map((card, i) => (
              <li key={card.id}>
                <CollectionCard card={card} numeral={toNumeral(i)} />
              </li>
            ))}
          </ul>
        )}
      </section>
    </>
  );
}

function CollectionCard({ card, numeral }: { card: Card; numeral: string }) {
  const body = (
    <>
      <div className="relative flex h-[300px] items-center justify-center overflow-hidden border border-gold/45 bg-surface transition-colors duration-500 group-hover:border-gold-bright md:h-[340px]">
        <Numeral className="text-[200px] transition-transform duration-700 ease-royal group-hover:scale-105">
          {numeral}
        </Numeral>
        <span className="absolute inset-x-0 bottom-4 text-center font-display text-micro tracking-[0.25em] text-muted">
          {site.collection.photo}
        </span>
      </div>
      <div className="flex items-baseline justify-between gap-4">
        <span className="font-display text-[18px] tracking-[0.12em] text-ivory uppercase md:text-[20px]">
          {card.name}
        </span>
        {card.price && <span className="shrink-0 text-[18px] text-gold">{card.price}</span>}
      </div>
      {card.href && (
        <span className="text-[18px] text-muted italic transition-colors duration-300 group-hover:text-gold-bright">
          View the artefact →
        </span>
      )}
    </>
  );

  return card.href ? (
    <Link href={card.href} className="group flex flex-col gap-3.5">
      {body}
    </Link>
  ) : (
    <div className="flex flex-col gap-3.5 opacity-70">{body}</div>
  );
}
