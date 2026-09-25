import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Medallion } from "@/components/archive/Medallion";
import { BackButton } from "@/components/BackButton";
import { Logo, SiteHeader, HeaderEyebrow } from "@/components/SiteHeader";
import { ButtonLink, Eyebrow, GoldBackdrop } from "@/components/ui";
import { archiveSections, getProduct, products, productsFor } from "@/content/products";
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
  const numeral = ["I", "II", "III", "IV", "V"][Math.max(0, inSection.findIndex((p) => p.id === id))];

  return (
    <main className="min-h-dvh">
      <SiteHeader
        left={<BackButton href="/archive" label="The Archive" />}
        center={<HeaderEyebrow>{(section?.label ?? "The Archive").toUpperCase()}</HeaderEyebrow>}
        right={<Logo className="hidden md:inline md:text-base" />}
      />
      <section className="relative flex flex-col items-center gap-6 overflow-hidden px-5 py-16 text-center md:py-24">
        <GoldBackdrop scrim={0.8} />
        <span aria-hidden="true" className="relative h-16 w-px bg-gold" />
        <Medallion product={product} numeral={numeral} size={240} className="relative -mt-6 shadow-glow" />
        <Eyebrow className="relative mt-4">{site.brand.toUpperCase()} · ARTEFACT</Eyebrow>
        <h1 className="km-gold-text relative font-display text-[clamp(40px,5vw,72px)] leading-none font-bold tracking-[0.06em] uppercase">
          {product.name}
        </h1>
        {product.price && <p className="relative text-[24px] text-gold italic">{product.price}</p>}
        <div className="relative mt-6 flex flex-wrap justify-center gap-4">
          <ButtonLink href={site.privateViewing.href}>REQUEST A PRIVATE VIEWING</ButtonLink>
          <ButtonLink href="/archive" variant="secondary">
            RETURN TO THE ARCHIVE
          </ButtonLink>
        </div>
      </section>
    </main>
  );
}
