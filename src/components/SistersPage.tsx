"use client";

import { motion, useReducedMotion } from "framer-motion";
import Link from "next/link";
import { site } from "@/content/site";
import { BackButton } from "./BackButton";
import { ArrowRight } from "./icons";
import { HeaderEyebrow, Logo, SiteHeader } from "./SiteHeader";
import { ButtonLink, Eyebrow, GoldBackdrop } from "./ui";

const ROYAL = [0.2, 0.7, 0.1, 1] as const;

/** Page 3 (spec §4): the two founders, split by a gold line that carries their words. */
export function SistersPage() {
  const reduce = useReducedMotion() ?? false;
  const [harshi, ritvi] = site.founders;

  const rise = (i: number) => ({
    initial: reduce ? { opacity: 0 } : { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 1, delay: 0.3 + i * 0.2, ease: ROYAL },
  });

  return (
    <main className="min-h-dvh">
      <section className="relative overflow-hidden">
        <GoldBackdrop scrim={0.7} />
        <SiteHeader
          left={<BackButton href="/chambers" label="The Chambers" />}
          center={<HeaderEyebrow>{"THE WOMEN BEHIND THE DOOR"}</HeaderEyebrow>}
          right={
            <div className="flex items-center gap-3">
              <Link
                href="/concierge"
                className="hidden items-center gap-1.5 rounded-pill border border-gold/40 px-3.5 py-1.5 font-display text-[11px] tracking-[0.25em] text-gold-bright uppercase transition-all duration-300 hover:border-gold hover:bg-gold/15 md:inline-flex"
              >
                THE CONCIERGE
              </Link>
              <Logo className="md:text-base" />
            </div>
          }
        />
        <div className="relative flex flex-col items-center gap-3.5 px-5 pt-12 pb-14 text-center md:min-h-[calc(340px-var(--km-header-h))] md:pt-[52px]">
          <Eyebrow>{site.sisters.eyebrow}</Eyebrow>
          <h1 className="km-gold-text font-display text-[clamp(56px,7.8vw,112px)] leading-none font-bold tracking-[0.03em]">
            {site.sisters.title}
          </h1>
        </div>
      </section>

      <div className="mx-auto grid max-w-km grid-cols-1 px-5 pt-12 md:grid-cols-[minmax(0,1fr)_48px_minmax(0,1fr)] md:px-0 md:pt-10">
        <motion.div {...rise(0)}>
          <Founder founder={harshi} />
        </motion.div>
        <FoundersDivider reduce={reduce} />
        <motion.div {...rise(1)}>
          <Founder founder={ritvi} />
        </motion.div>
      </div>

      <div className="flex justify-center px-5 pt-12 pb-20 md:pt-10">
        <ButtonLink href="/archive" className="py-[18px]">
          ARCHIVE
          <ArrowRight strokeWidth={1.8} />
        </ButtonLink>
      </div>
    </main>
  );
}

function Founder({ founder }: { founder: (typeof site.founders)[number] }) {
  const paragraphs = founder.story.split("\n\n").filter(Boolean);

  return (
    <section aria-label={founder.name} className="flex flex-col items-center w-full">
      {/* Name Headline & Role */}
      <div className="w-full max-w-[540px] text-left border-b border-gold/30 pb-5">
        <Eyebrow className="tracking-[0.4em] text-gold">{founder.role}</Eyebrow>
        <h2 className="km-gold-text mt-2 font-display text-[clamp(32px,3.2vw,46px)] font-bold tracking-[0.08em] leading-tight">
          {founder.name}
        </h2>
      </div>

      {/* Realigned Narrative Body */}
      <div className="w-full max-w-[540px] pt-6 flex flex-col gap-5 text-left">
        {paragraphs.map((para, idx) => {
          const isPoetic =
            para.includes("The values came from") ||
            para.includes("Honouring the roots") ||
            para.includes("A curious mind. An artist’s eye");
          return (
            <p
              key={idx}
              className={`whitespace-pre-line text-[16px] leading-[1.8] md:text-[17px] ${
                isPoetic
                  ? "text-gold font-display text-[15px] md:text-[16px] tracking-[0.04em] pl-4 border-l border-gold/50 my-1 not-italic"
                  : "text-ivory-soft italic"
              }`}
            >
              {para}
            </p>
          );
        })}

        {founder.origin ? (
          <p className="whitespace-pre-line text-[16px] leading-[1.8] text-ivory-soft italic md:text-[17px] pt-2">
            {founder.origin}
          </p>
        ) : null}
      </div>
    </section>
  );
}

/**
 * The gold line between the sisters. It draws downward, breaks, and carries
 * "WORDS FROM THE FOUNDERS" in the gap, with a diamond at each end of the break.
 * On phones it lies flat between the two stacked sisters.
 */
function FoundersDivider({ reduce }: { reduce: boolean }) {
  const words = (
    <motion.span
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.9, delay: reduce ? 0.2 : 1.5, ease: "easeOut" }}
      className="font-display text-[10px] tracking-[0.2em] whitespace-nowrap text-gold-bright sm:text-xs sm:tracking-[0.35em] md:text-sm md:tracking-[0.4em] md:[writing-mode:vertical-rl]"
    >
      {site.sisters.divider}
    </motion.span>
  );
  const diamond = <span aria-hidden="true" className="size-[8px] sm:size-[9px] shrink-0 rotate-45 border border-gold bg-black" />;
  const draw = reduce
    ? { initial: { opacity: 0 }, animate: { opacity: 1 } }
    : { initial: { clipPath: "inset(0 0 100% 0)" }, animate: { clipPath: "inset(0 0 0% 0)" } };
  const drawFlat = reduce
    ? draw
    : { initial: { clipPath: "inset(0 100% 0 0)" }, animate: { clipPath: "inset(0 0% 0 0)" } };

  return (
    <div role="separator" aria-label={site.sisters.divider} className="flex items-center justify-center py-12 md:py-0">
      {/* Phones: a horizontal line with the words in the middle. */}
      <motion.div
        {...drawFlat}
        transition={{ duration: 1.3, delay: 0.5, ease: ROYAL }}
        className="flex w-full items-center gap-2 sm:gap-3 md:hidden"
      >
        <span className="h-px flex-1 bg-gold" />
        {diamond}
        {words}
        {diamond}
        <span className="h-px flex-1 bg-gold" />
      </motion.div>

      {/* Desktop: the vertical line, 760px tall, drawing downward. */}
      <motion.div
        {...draw}
        transition={{ duration: 1.4, delay: 0.5, ease: ROYAL }}
        className="hidden h-[760px] flex-col items-center md:flex"
      >
        <span className="h-[150px] w-px bg-gold" />
        {diamond}
        <span className="flex flex-1 items-center py-6">{words}</span>
        {diamond}
        <span className="h-[200px] w-px bg-gold" />
      </motion.div>
    </div>
  );
}
