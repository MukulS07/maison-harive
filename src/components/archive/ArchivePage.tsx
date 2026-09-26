"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import Link from "next/link";
import { useLayoutEffect, useRef, useState, type KeyboardEvent } from "react";
import { archiveSections, productsFor, toNumeral, type ArchiveSectionId, type Product } from "@/content/products";
import { site } from "@/content/site";
import { BackButton } from "../BackButton";
import { BagIcon, SearchIcon } from "../icons";
import { HeaderEyebrow, SiteHeader } from "../SiteHeader";
import { Eyebrow, GoldBackdrop } from "../ui";
import { Medallion } from "./Medallion";
import { AllTreasures3DSection } from "./AllTreasures3DSection";
import { ProductCard3D } from "./ProductCard3D";
import { SearchModal } from "./SearchModal";
import { BagModal } from "./BagModal";

/*
 * Necklace geometry (spec §5.2), in the mockup's 1440-wide space, measured from the top of
 * the section tabs (page y 290), so the page's y 356 hook point is local y 66.
 */
const W = 1440;
const H = 580;
const TABS_LEFT = 172;
const TAB_STEP = 224;
const HOOK_Y = 66;
const STRAND_Y = 70;
const DRAPE_Y = 170;
const DRAPE = `M260 ${DRAPE_Y} Q720 ${DRAPE_Y + 360} 1180 ${DRAPE_Y}`;
const JEWEL_X = [260, 490, 720, 950, 1180];

const hookX = (i: number) => TABS_LEFT + 100 + i * TAB_STEP;
const jewelTop = (x: number) => {
  const t = (x - 260) / 920;
  return DRAPE_Y + 720 * t * (1 - t);
};
const strands = (hx: number) => [
  `M${hx} ${STRAND_Y} Q${(hx + 260) / 2} ${DRAPE_Y} 260 ${DRAPE_Y}`,
  `M${hx} ${STRAND_Y} Q${(hx + 1180) / 2} ${DRAPE_Y} 1180 ${DRAPE_Y}`,
];

const HANG = { type: "spring" as const, stiffness: 210, damping: 14, mass: 0.9 };

import { useTreasuryBag } from "@/context/TreasuryBagContext";

/** Page 4 (spec §5): the shop, where each section hangs as a necklace from its tab. */
export function ArchivePage({ initialSection = "buttons" }: { initialSection?: ArchiveSectionId }) {
  const [active, setActive] = useState<ArchiveSectionId>(initialSection);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isBagOpen, setIsBagOpen] = useState(false);
  const { bagCount } = useTreasuryBag();
  const index = archiveSections.findIndex((s) => s.id === active);
  const section = archiveSections[index];
  const pieces = productsFor(active);

  return (
    <main className="min-h-dvh">
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
      <BagModal isOpen={isBagOpen} onClose={() => setIsBagOpen(false)} />

      <section className="relative overflow-hidden">
        <GoldBackdrop scrim={0.72} />
        <SiteHeader
          left={<BackButton href="/sisters" label="The Sisters" />}
          center={<HeaderEyebrow>THE ARCHIVE</HeaderEyebrow>}
          right={
            <div className="flex items-center gap-2.5 md:gap-4">
              <Link
                href="/concierge"
                className="hidden items-center gap-1.5 rounded-pill border border-gold/50 bg-gold/10 px-3.5 py-1.5 font-display text-[11px] tracking-[0.25em] text-gold-bright uppercase transition-all duration-300 hover:border-gold hover:bg-gold/25 hover:text-gold-pale sm:flex"
              >
                THE CONCIERGE
              </Link>
              <button
                type="button"
                onClick={() => setIsSearchOpen(true)}
                aria-label="Search the Archive"
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
        <div className="relative flex flex-col items-center gap-2.5 px-5 pt-8 pb-10 text-center md:min-h-[calc(290px-var(--km-header-h))] md:pt-[30px]">
          <Eyebrow>{site.archive.eyebrow}</Eyebrow>
          <h1 className="km-gold-text font-display text-[clamp(36px,6vw,92px)] leading-none font-bold tracking-[0.03em]">
            {active === "treasures" ? "ALL TREASURES" : site.archive.title}
          </h1>
          <p className="mt-2 max-w-5xl font-serif text-[13.5px] italic text-gold-pale/85 sm:text-[15px] md:text-[16px] md:whitespace-nowrap">
            &ldquo;Every treasure from the MAISON comes with a special note, a gift to keep, and its Certificate of Authenticity&rdquo;
          </p>
        </div>
      </section>

      <NecklaceDesktop active={index} onSelect={setActive} pieces={pieces} />
      <NecklaceStrand active={index} onSelect={setActive} pieces={pieces} />

      {active !== "treasures" ? (
        <>
          <div className="flex flex-col items-center gap-2 px-5 pt-4 pb-16 text-center lg:pt-0">
            <p aria-live="polite" className="text-body text-ivory-soft italic">
              {section.caption}
            </p>
            <a
              href="#every-piece"
              className="mt-1 border-b border-gold py-1.5 font-display text-xs tracking-[0.35em] text-gold-bright uppercase transition-colors duration-300 hover:text-gold-pale"
            >
              See every piece in {section.label} →
            </a>
          </div>

          <section id="every-piece" aria-label={`Every piece in ${section.label}`} className="scroll-mt-8 px-5 pb-24">
            <div className="mx-auto max-w-km">
              <div className="mb-10 flex flex-col items-center justify-between gap-4 border-b border-gold/20 pb-6 text-center sm:flex-row sm:text-left">
                <div>
                  <Eyebrow>MAISON HARIVÉ · THE ARCHIVE</Eyebrow>
                  <h2 className="km-gold-text mt-1 font-display text-2xl font-bold tracking-[0.16em] uppercase md:text-3xl">
                    The {section.label} Collection
                  </h2>
                  <p className="mt-1 font-serif text-sm italic text-ivory/70 md:text-base">
                    {section.caption} · {pieces.length} Handcrafted Medallions & Artefacts
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="rounded-pill border border-gold/40 bg-gold/10 px-4 py-1.5 font-display text-[11px] tracking-[0.25em] text-gold-bright uppercase">
                    {pieces.length} {pieces.length === 1 ? "MEDALLION" : "MEDALLIONS"}
                  </span>
                </div>
              </div>

              {/* Visual Medallions Grid for ALL items in this category */}
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
                {pieces.map((product, i) => (
                  <ProductCard3D
                    key={product.id}
                    product={product}
                    numeral={toNumeral(i)}
                    index={i}
                  />
                ))}
              </div>
            </div>
          </section>
        </>
      ) : (
        <AllTreasures3DSection />
      )}
    </main>
  );
}

type NecklaceProps = {
  active: number;
  onSelect: (id: ArchiveSectionId) => void;
  pieces: Product[];
};

/** Tabs are real buttons; hover, focus or tap hangs that section, arrow keys move between them. */
function useTabKeys(active: number, onSelect: (id: ArchiveSectionId) => void) {
  const refs = useRef<(HTMLButtonElement | null)[]>([]);
  const onKeyDown = (e: KeyboardEvent<HTMLButtonElement>) => {
    const n = archiveSections.length;
    const next =
      e.key === "ArrowRight"
        ? (active + 1) % n
        : e.key === "ArrowLeft"
          ? (active - 1 + n) % n
          : e.key === "Home"
            ? 0
            : e.key === "End"
              ? n - 1
              : -1;
    if (next < 0) return;
    e.preventDefault();
    onSelect(archiveSections[next].id);
    refs.current[next]?.focus();
  };
  return { refs, onKeyDown };
}

function Hook({ on }: { on: boolean }) {
  return (
    <span
      aria-hidden="true"
      className={`block size-3 rounded-full border-[1.5px] border-gold transition-[background-color,box-shadow] duration-300 ${
        on ? "bg-gold-bright shadow-[0_0_18px_rgba(255,200,110,0.9)]" : "bg-black"
      }`}
    />
  );
}

/** Desktop: one 1440-wide stage, scaled to fit, with the necklace hanging from the active hook. */
function NecklaceDesktop({ active, onSelect, pieces }: NecklaceProps) {
  const reduce = useReducedMotion() ?? false;
  const boxRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const [strandIndex, setStrandIndex] = useState(0);
  const [prevActive, setPrevActive] = useState(active);
  if (prevActive !== active) {
    setPrevActive(active);
    setStrandIndex(0);
  }
  const { refs, onKeyDown } = useTabKeys(active, onSelect);
  const hx = hookX(active);
  const [left, right] = strands(hx);
  const sectionId = archiveSections[active].id;

  useLayoutEffect(() => {
    const el = boxRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => setScale(Math.min(1, el.clientWidth / W)));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const isTreasures = archiveSections[active].id === "treasures";
  const stageHeight = isTreasures ? 84 * scale : H * scale;
  const totalStrands = Math.ceil(pieces.length / 5);
  const currentPieces = pieces.slice(strandIndex * 5, strandIndex * 5 + 5);

  return (
    <div ref={boxRef} className="relative mx-auto hidden w-full max-w-km lg:block" style={{ height: stageHeight }}>
      <div className="absolute top-0 left-0 origin-top-left" style={{ width: W, height: isTreasures ? 84 : H, transform: `scale(${scale})` }}>
        {/* Strand switcher when a category has multiple strands of medallions */}
        {!isTreasures && totalStrands > 1 && (
          <div
            className="absolute z-30 flex items-center gap-2.5 rounded-pill border border-gold/40 bg-black/85 px-3.5 py-1.5 shadow-[0_4px_20px_rgba(0,0,0,0.8)] backdrop-blur-md"
            style={{ right: 48, top: 76 }}
          >
            <button
              type="button"
              onClick={() => setStrandIndex((prev) => (prev - 1 + totalStrands) % totalStrands)}
              className="flex size-6 cursor-pointer items-center justify-center rounded-full text-gold transition-colors hover:bg-gold/25 hover:text-gold-bright"
              title="Previous strand of medallions"
              aria-label="Previous strand"
            >
              ←
            </button>
            <span className="font-display text-[10px] tracking-[0.25em] text-gold-pale uppercase">
              STRAND {toNumeral(strandIndex)} / {toNumeral(totalStrands - 1)}
            </span>
            <button
              type="button"
              onClick={() => setStrandIndex((prev) => (prev + 1) % totalStrands)}
              className="flex size-6 cursor-pointer items-center justify-center rounded-full text-gold transition-colors hover:bg-gold/25 hover:text-gold-bright"
              title="Next strand of medallions"
              aria-label="Next strand"
            >
              →
            </button>
          </div>
        )}

        <div
          role="group"
          aria-label="Sections"
          className="absolute z-20 grid grid-cols-5 gap-6"
          style={{ left: TABS_LEFT, width: W - 2 * TABS_LEFT, top: 6 }}
        >
          {archiveSections.map((s, i) => {
            const on = i === active;
            return (
              <button
                key={s.id}
                ref={(el) => {
                  refs.current[i] = el;
                }}
                type="button"
                aria-pressed={on}
                aria-controls={isTreasures ? undefined : "necklace"}
                onClick={() => onSelect(s.id)}
                onKeyDown={onKeyDown}
                className="group flex flex-col items-center cursor-pointer outline-none"
              >
                <span
                  className={`flex h-12 w-full items-center justify-center border-b pl-[0.28em] font-display text-[15px] font-semibold tracking-[0.28em] uppercase transition-colors duration-300 ${
                    on ? "border-gold text-gold-bright" : "border-gold/25 text-ivory/70 group-hover:text-gold-bright"
                  }`}
                >
                  {s.label}
                </span>
                <span className="mt-1.5">
                  <Hook on={on} />
                </span>
              </button>
            );
          })}
        </div>

        {/* The necklace sways gently around the hook it hangs from (only for categories, not 'treasures') */}
        {!isTreasures && (
          <motion.div
            id="necklace"
            className="absolute inset-0 pointer-events-none"
            style={{ transformOrigin: `${hx}px ${HOOK_Y}px` }}
            animate={reduce ? { rotate: 0 } : { rotate: [-0.6, 0.6] }}
            transition={
              reduce ? { duration: 0 } : { duration: 3.5, ease: "easeInOut", repeat: Infinity, repeatType: "mirror" }
            }
          >
            <svg aria-hidden="true" width={W} height={H} viewBox={`0 0 ${W} ${H}`} className="absolute inset-0 overflow-visible pointer-events-none">
              <motion.path
                className="km-chain"
                fill="none"
                stroke="var(--km-gold)"
                strokeWidth={2}
                strokeLinecap="round"
                initial={false}
                animate={{ d: left }}
                transition={reduce ? { duration: 0 } : { type: "spring", duration: 0.5, bounce: 0.2 }}
              />
              <motion.path
                className="km-chain"
                fill="none"
                stroke="var(--km-gold)"
                strokeWidth={2}
                strokeLinecap="round"
                initial={false}
                animate={{ d: right }}
                transition={reduce ? { duration: 0 } : { type: "spring", duration: 0.5, bounce: 0.2 }}
              />
              <path className="km-chain" d={DRAPE} fill="none" stroke="var(--km-gold-bright)" strokeWidth={2.4} strokeLinecap="round" />
            </svg>

            <ul aria-label={`${archiveSections[active].label}`}>
              <AnimatePresence initial={false} mode="wait">
                <motion.div key={`${sectionId}-strand-${strandIndex}`} className="contents">
                  {currentPieces.map((p, i) => {
                    const total = currentPieces.length;
                    const x =
                      total === 1
                        ? 720
                        : total === 2
                          ? [490, 950][i] ?? 720
                          : total === 3
                            ? [380, 720, 1060][i] ?? 720
                            : total === 4
                              ? [320, 580, 860, 1120][i] ?? 720
                              : JEWEL_X[i] ?? 720;
                    const top = jewelTop(x);
                    const featured = total >= 3 ? i === Math.floor(total / 2) : false;
                    const globalIndex = strandIndex * 5 + i;
                    return (
                      <motion.li
                        key={`${sectionId}-${p.id}`}
                        className="absolute w-[180px] pointer-events-auto"
                        style={{ left: x - 90, top }}
                        initial={
                          reduce
                            ? { opacity: 0 }
                            : { opacity: 0, x: hx - x, y: HOOK_Y - top - 10, scale: 0.35 }
                        }
                        animate={{ opacity: 1, x: 0, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: reduce ? 0 : 20, transition: { duration: 0.2 } }}
                        transition={
                          reduce
                            ? { duration: 0.4 }
                            : { ...HANG, delay: 0.06 * i, opacity: { duration: 0.25, delay: 0.06 * i } }
                        }
                      >
                        <Jewel product={p} numeral={toNumeral(globalIndex)} size={featured ? 132 : 108} />
                      </motion.li>
                    );
                  })}
                </motion.div>
              </AnimatePresence>
            </ul>
          </motion.div>
        )}
      </div>
    </div>
  );
}

function Jewel({ product, numeral, size }: { product: Product; numeral: string; size: number }) {
  return (
    <Link
      href={`/archive/${product.id}`}
      aria-label={`${product.name}${product.price ? `, ${product.price}` : ""}`}
      className="group flex flex-col items-center outline-none"
    >
      <span className="flex flex-col items-center transition-transform duration-300 ease-soft group-hover:translate-y-2 group-hover:scale-[1.08] group-focus-visible:translate-y-2 group-focus-visible:scale-[1.08]">
        <span aria-hidden="true" className="h-3.5 w-px bg-gold" />
        <span aria-hidden="true" className="-mt-0.5 size-3 rounded-full border-[1.5px] border-gold" />
        <Medallion
          product={product}
          numeral={numeral}
          size={size}
          className="group-hover:shadow-glow-strong group-focus-visible:shadow-glow-strong group-focus-visible:outline-2 group-focus-visible:outline-offset-4 group-focus-visible:outline-gold-bright"
        />
        <span className="mt-3.5 px-1 text-center font-display text-[11.5px] tracking-[0.14em] text-ivory uppercase transition-colors duration-300 group-hover:text-gold-bright sm:text-[13px] sm:tracking-[0.18em]">
          {product.name}
        </span>
        {product.price && <span className="mt-1 text-[15px] text-gold italic sm:text-[16px]">{product.price}</span>}
      </span>
    </Link>
  );
}

/**
 * Phones and tablets (spec §7): a scrollable row of tabs with hooks, and the necklace as a
 * horizontal strand you swipe along, three jewels in view, re-hung whenever a tab is tapped.
 */
function NecklaceStrand({ active, onSelect, pieces }: NecklaceProps) {
  const reduce = useReducedMotion() ?? false;
  const { refs, onKeyDown } = useTabKeys(active, onSelect);
  const sectionId = archiveSections[active].id;
  const n = pieces.length;
  const sag = 46;

  const isTreasures = archiveSections[active].id === "treasures";

  return (
    <div className="lg:hidden">
      <div role="group" aria-label="Sections" className="km-scroll-x flex gap-1 overflow-x-auto px-5 pt-6">
        {archiveSections.map((s, i) => {
          const on = i === active;
          return (
            <button
              key={s.id}
              ref={(el) => {
                refs.current[i] = el;
              }}
              type="button"
              aria-pressed={on}
              onClick={() => onSelect(s.id)}
              onKeyDown={onKeyDown}
              className="group flex shrink-0 flex-col items-center cursor-pointer outline-none"
            >
              <span
                className={`flex h-11 items-center justify-center border-b px-3 font-display text-[13px] font-semibold tracking-[0.24em] uppercase transition-colors duration-300 ${
                  on ? "border-gold text-gold-bright" : "border-gold/25 text-ivory/70 group-hover:text-gold-bright"
                }`}
              >
                {s.label}
              </span>
              <span className="mt-1.5">
                <Hook on={on} />
              </span>
            </button>
          );
        })}
      </div>

      {!isTreasures && (
        <ul
          aria-label={archiveSections[active].label}
          className="km-scroll-x relative mt-2 flex snap-x snap-mandatory overflow-x-auto pt-2 pb-6"
        >
          {/* The strand itself, a gentle arc across the whole swipeable row. */}
          <li aria-hidden="true" className="pointer-events-none absolute top-2 left-0 h-24" style={{ width: `${(n / 3) * 100}%` }}>
            <svg viewBox="0 0 1000 100" preserveAspectRatio="none" className="h-full w-full overflow-visible">
              <path
                className="km-chain"
                d={`M0 4 Q500 ${4 + sag * 2} 1000 4`}
                fill="none"
                stroke="var(--km-gold-bright)"
                strokeWidth={2}
                vectorEffect="non-scaling-stroke"
              />
            </svg>
          </li>
          <AnimatePresence initial={false} mode="popLayout">
            {pieces.map((p, i) => {
              const t = (i + 0.5) / n;
              const drop = 4 + sag * 4 * t * (1 - t);
              return (
                <motion.li
                  key={`${sectionId}-${p.id}`}
                  className="relative flex w-[140px] shrink-0 snap-start justify-center sm:w-1/3"
                  style={{ paddingTop: drop }}
                  initial={reduce ? { opacity: 0 } : { opacity: 0, y: -40, scale: 0.6 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: reduce ? 0 : 16, transition: { duration: 0.2 } }}
                  transition={reduce ? { duration: 0.4 } : { ...HANG, delay: 0.06 * i }}
                >
                  <Jewel product={p} numeral={toNumeral(i)} size={i === 2 ? 96 : 84} />
                </motion.li>
              );
            })}
          </AnimatePresence>
        </ul>
      )}
    </div>
  );
}

