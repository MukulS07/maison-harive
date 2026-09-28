import Image from "next/image";
import Link from "next/link";
import { Fragment } from "react";
import { featuredProducts } from "@/content/products";
import { site } from "@/content/site";
import { ButtonLink, Diamond, Eyebrow, FramedPlaceholder, GoldBackdrop } from "../ui";

/** Chamber I, opened (spec §3.1). */
export function LegacyChamber() {
  const c = site.chambers.legacy;
  return (
    <>
      <section className="relative overflow-hidden">
        <GoldBackdrop scrim={0.72} />
        {/* The gold edge this chamber slid in from. */}
        <span aria-hidden="true" className="absolute inset-y-0 left-0 hidden w-px bg-gold md:block" />
        <div className="relative mx-auto flex max-w-km flex-col-reverse gap-12 px-5 py-14 md:px-gutter lg:min-h-[calc(900px-var(--km-header-h))] lg:flex-row lg:items-center lg:justify-between lg:gap-16 lg:py-20 lg:pl-[120px]">
          <div className="flex max-w-[640px] flex-col gap-[22px]">
            <Eyebrow>{c.eyebrow}</Eyebrow>
            <h1 className="km-gold-text font-display text-[clamp(56px,7.5vw,108px)] leading-none font-bold tracking-[0.02em] lg:w-max lg:whitespace-nowrap">
              {c.title}
            </h1>
            <p className="text-[clamp(24px,2.2vw,32px)] text-ivory italic">{site.legacy.lead}</p>
            <p className="mt-2 max-w-[560px] text-[19px] leading-[1.55] text-ivory-soft md:text-body whitespace-pre-line">
              {site.legacy.body}
            </p>
            <div className="mt-[18px] flex flex-wrap gap-4">
              <ButtonLink href="/chambers/atelier" className="px-7 md:text-[13px] md:tracking-[0.28em]">
                CHAMBER II · NEW CHAPTER
              </ButtonLink>
              <ButtonLink href="/sisters" variant="secondary" className="px-7 md:text-[13px] md:tracking-[0.28em]">
                THE SISTERS
              </ButtonLink>
            </div>
          </div>
          <FramedPlaceholder
            id="heritage-film"
            caption={site.legacy.portrait}
            className="aspect-[460/620] w-full max-w-[460px] shrink-0 scroll-mt-28 self-center"
          >
            {site.legacy.image ? (
              <Image
                src={site.legacy.image}
                alt="Heritage Portrait · The Founders"
                fill
                sizes="(max-width: 1024px) 100vw, 460px"
                className="object-cover"
                priority
              />
            ) : undefined}
          </FramedPlaceholder>
        </div>
      </section>

      <section className="flex flex-col items-center justify-center gap-[22px] border-t border-line px-5 py-20 text-center md:min-h-[400px]">
        <Eyebrow>{site.legacy.conceptEyebrow}</Eyebrow>
        <h2 className="max-w-4xl text-[clamp(32px,3.6vw,52px)] leading-tight font-normal italic">
          {site.legacy.concept}
        </h2>
        <nav
          aria-label="The artefacts"
          className="mt-[18px] flex flex-wrap items-center justify-center gap-x-7 gap-y-4 font-display text-[13px] tracking-[0.25em] md:text-[14px]"
        >
          {featuredProducts.map((p, i) => (
            <Fragment key={p.id}>
              {i > 0 && <Diamond filled className="size-1.5" />}
              <Link
                href={`/archive/${p.id}`}
                className="uppercase transition-colors duration-300 hover:text-gold-bright"
              >
                {p.name}
              </Link>
            </Fragment>
          ))}
        </nav>
      </section>
    </>
  );
}
