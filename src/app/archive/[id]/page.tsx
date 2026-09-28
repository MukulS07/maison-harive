import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Medallion } from "@/components/archive/Medallion";
import { BackButton } from "@/components/BackButton";
import { Logo, SiteHeader, HeaderEyebrow } from "@/components/SiteHeader";
import { ButtonLink, Eyebrow, GoldBackdrop } from "@/components/ui";
import { ProductBagButton } from "@/components/archive/ProductBagButton";
import { archiveSections, getProduct, products, productsFor, toNumeral } from "@/content/products";
import { site } from "@/content/site";

export function generateStaticParams() {
  return products.map((p) => ({ id: p.id }));
}

export async function generateMetadata({ params }: PageProps<"/archive/[id]">): Promise<Metadata> {
  const { id } = await params;
  const product = getProduct(id);
  return { title: product ? product.name : "The Archive" };
}

/** Placeholder product page (spec §5.2): one artefact, lit on black, until real pages are designed. */
export default async function ProductPage({ params }: PageProps<"/archive/[id]">) {
  const { id } = await params;
  const product = getProduct(id);
  if (!product) notFound();

  const section = archiveSections.find((s) => s.id === product.category);
  const inSection = product.featured ? productsFor("treasures") : productsFor(product.category);
  const idx = inSection.findIndex((p) => p.id === id);
  const numeral = toNumeral(idx >= 0 ? idx : 0);

  return (
    <main className="min-h-dvh">
      <SiteHeader
        left={<BackButton href="/archive" label="The Archive" />}
        center={
          <>
            <div className="hidden md:block">
              <HeaderEyebrow>{(section?.label ?? "The Archive").toUpperCase()}</HeaderEyebrow>
            </div>
            <Link
              href="/concierge"
              className="flex items-center gap-1.5 whitespace-nowrap rounded-pill border border-gold/50 bg-gold/10 px-3 py-1 font-display text-[10px] tracking-[0.22em] text-gold-bright uppercase transition-all duration-300 hover:border-gold hover:bg-gold/25 hover:text-gold-pale md:hidden"
            >
              THE CONCIERGE
            </Link>
          </>
        }
        centerOnMobile
        right={
          <div className="flex items-center gap-3">
            <Link
              href="/concierge"
              className="hidden items-center gap-1.5 rounded-pill border border-gold/50 bg-gold/10 px-3.5 py-1.5 font-display text-[11px] tracking-[0.25em] text-gold-bright uppercase transition-all duration-300 hover:border-gold hover:bg-gold/25 hover:text-gold-pale md:flex"
            >
              THE CONCIERGE
            </Link>
            <Logo className="hidden md:inline md:text-base" />
          </div>
        }
      />
      <section className="relative flex flex-col items-center gap-6 overflow-hidden px-5 py-16 text-center md:py-24">
        <GoldBackdrop scrim={0.8} />
        <span aria-hidden="true" className="relative h-16 w-px bg-gold" />
        <Medallion product={product} numeral={numeral} size={240} className="relative -mt-6 shadow-glow" />
        <Eyebrow className="relative mt-4">
          {site.brand.toUpperCase()} · {(product.typeLabel || "Artefact").toUpperCase()}
        </Eyebrow>
        <h1 className="km-gold-text relative font-display text-[clamp(40px,5vw,72px)] leading-none font-bold tracking-[0.06em] uppercase">
          {product.name}
        </h1>
        {product.tagline && (
          <p className="relative max-w-xl font-serif text-lg italic text-ivory/80 md:text-xl">
            &ldquo;{product.tagline}&rdquo;
          </p>
        )}
        {product.price && <p className="relative text-[24px] text-gold italic">{product.price}</p>}

        {/* Maison Authenticity Promise */}
        <div className="relative mt-2 max-w-xl rounded-md border border-gold/30 bg-surface/50 px-6 py-3.5 text-center backdrop-blur-sm">
          <p className="font-serif text-[13.5px] italic text-gold sm:text-[15px]">
            &ldquo;{site.archive.tagline}&rdquo;
          </p>
        </div>

        <div className="relative mt-4 flex flex-wrap justify-center items-center gap-4">
          <ButtonLink href={`/concierge?section=enquiry&product=${encodeURIComponent(product.name)}`}>
            REQUEST A PRIVATE VIEWING
          </ButtonLink>
          <ProductBagButton product={product} />
          <ButtonLink href="/archive" variant="secondary">
            RETURN TO THE ARCHIVE
          </ButtonLink>
        </div>
      </section>
    </main>
  );
}
