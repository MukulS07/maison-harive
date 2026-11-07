import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { BackButton } from "@/components/BackButton";
import { Logo, SiteHeader, HeaderEyebrow } from "@/components/SiteHeader";
import { ButtonLink, Eyebrow, GoldBackdrop, Numeral } from "@/components/ui";
import { ProductBagButton } from "@/components/archive/ProductBagButton";
import { archiveSections, products, toNumeral } from "@/content/products";
import { site } from "@/content/site";
import { getStoreProducts } from "@/lib/products-store";

export const dynamicParams = true;
export const revalidate = 30;

export function generateStaticParams() {
  return products.map((p) => ({ id: p.id }));
}

export async function generateMetadata({ params }: PageProps<"/archive/[id]">): Promise<Metadata> {
  const { id } = await params;
  const all = await getStoreProducts();
  const product = all.find((p) => p.id === id);
  return { title: product ? product.name : "The Archive" };
}

export default async function ProductPage({ params }: PageProps<"/archive/[id]">) {
  redirect("/chambers");
  const { id } = await params;
  const all = await getStoreProducts();
  const product = all.find((p) => p.id === id);
  if (!product) notFound();

  const section = archiveSections.find((s) => s.id === product.category);
  const inSection = product.featured ? all.filter((p) => p.featured) : all.filter((p) => p.category === product.category);
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

      <section className="relative overflow-hidden px-5 py-12 md:py-16">
        <GoldBackdrop scrim={0.88} />

        <div className="relative mx-auto grid max-w-6xl gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.85fr)] lg:items-start lg:gap-16">
          {/* Hero image — the product, large and unobstructed */}
          <div className="lg:sticky lg:top-24">
            <div className="border border-gold p-2 sm:p-3">
              <div
                className="group relative flex aspect-square w-full items-center justify-center overflow-hidden border border-gold/40 sm:aspect-[4/5]"
                style={{
                  background:
                    "radial-gradient(circle at 35% 30%, color-mix(in srgb, var(--km-gold-deep) 40%, var(--km-black)), var(--km-black) 72%)",
                }}
              >
                {product.image ? (
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    priority
                    sizes="(min-width: 1024px) 50vw, 100vw"
                    className="object-contain p-6 transition-transform duration-500 ease-out group-hover:scale-[1.04] sm:p-10"
                  />
                ) : (
                  <span style={{ fontSize: 160 }}>
                    <Numeral>{numeral}</Numeral>
                  </span>
                )}
              </div>
            </div>
            <p className="mt-3 text-center font-display text-[10px] tracking-[0.25em] text-muted uppercase">
              {site.brand} &middot; {(product.typeLabel || "Artefact").toUpperCase()} &middot; No. {numeral}
            </p>
          </div>

          {/* Details + booking path */}
          <div className="flex flex-col gap-6 lg:pt-4">
            <div>
              <Eyebrow>
                {site.brand.toUpperCase()} &middot; {(product.typeLabel || "Artefact").toUpperCase()}
              </Eyebrow>
              <h1 className="km-gold-text mt-3 font-display text-[clamp(32px,4vw,52px)] leading-[1.05] font-bold tracking-[0.03em] uppercase">
                {product.name}
              </h1>
              {product.tagline && (
                <p className="mt-3 font-serif text-lg italic text-ivory/80">&ldquo;{product.tagline}&rdquo;</p>
              )}
            </div>

            {product.price && (
              <p className="font-display text-2xl text-gold italic">
                {product.price === "Inquire" ? "Price on Request" : product.price}
              </p>
            )}

            <div className="rounded-md border border-gold/30 bg-surface/50 px-6 py-4 backdrop-blur-sm">
              <p className="font-serif text-[14px] italic text-gold sm:text-[15px]">&ldquo;{site.archive.tagline}&rdquo;</p>
            </div>

            {/* Primary booking path */}
            <div className="mt-2 flex flex-col gap-3 border-t border-gold/20 pt-6">
              <p className="font-display text-[11px] tracking-[0.22em] text-muted uppercase">
                Reserve This Piece
              </p>
              <ButtonLink
                href={`/concierge?section=enquiry&product=${encodeURIComponent(product.name)}`}
                className="w-full justify-center py-4 text-center"
              >
                REQUEST A PRIVATE VIEWING
              </ButtonLink>
              <p className="text-center font-serif text-[13px] italic text-ivory/60">
                Or reserve it now and arrange details with your concierge.
              </p>
              <ProductBagButton product={product} className="w-full py-4" />
            </div>

            <ButtonLink href="/archive" variant="secondary" className="mt-2 w-full justify-center py-3 text-center">
              RETURN TO THE ARCHIVE
            </ButtonLink>
          </div>
        </div>
      </section>
    </main>
  );
}
