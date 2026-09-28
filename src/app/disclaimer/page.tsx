import type { Metadata } from "next";
import Link from "next/link";
import { Logo, SiteHeader } from "@/components/SiteHeader";
import { Eyebrow, GoldBackdrop } from "@/components/ui";
import { MaisonFooter } from "@/components/MaisonFooter";

export const metadata: Metadata = {
  title: "Disclaimer · Maison Harivé",
  description:
    "Craftsmanship and delivery timelines for bespoke Maison Harivé creations.",
};

export default function DisclaimerPage() {
  return (
    <main className="relative flex min-h-dvh flex-col justify-between bg-black text-ivory">
      <GoldBackdrop scrim={0.92} />

      <SiteHeader
        left={<Logo className="text-base tracking-[0.3em]" />}
        right={
          <Link
            href="/archive"
            className="font-display text-[12px] tracking-[0.25em] text-gold-bright uppercase transition-colors hover:text-gold-pale"
          >
            The Archive
          </Link>
        }
      />

      <article className="relative z-10 mx-auto max-w-3xl px-5 py-20 md:py-28">
        <Eyebrow className="mb-4">HOUSE NOTICE · CRAFTSMANSHIP &amp; TIMELINE</Eyebrow>
        <h1 className="km-gold-text font-display text-[clamp(32px,5vw,56px)] font-bold tracking-[0.06em] uppercase">
          Disclaimer
        </h1>
        <p className="mt-2 font-serif text-sm text-ivory-soft italic">
          Bespoke Commission &amp; Handcrafting Policy
        </p>

        <div className="mt-12 rounded-xl border border-gold/30 bg-gold/[0.04] p-8 md:p-10 backdrop-blur-sm">
          <p className="font-serif text-[18px] md:text-[21px] leading-relaxed text-ivory-soft italic">
            &ldquo;Each Maison Hariv&eacute; piece is made especially for you upon request. Please allow up to 30 days for your piece to be crafted and delivered. As every creation is prepared individually, the delivery timeline begins once your order is confirmed.&rdquo;
          </p>
        </div>

        <div className="mt-12 space-y-6 font-serif text-[16px] leading-relaxed text-ivory/80 md:text-[17px]">
          <p>
            Every jewel, medallion, and ceremonial piece that leaves the Maison Hariv&eacute; atelier is individually cast, set, and finished by master artisans in Jaipur following centuries-old royal craftsmanship traditions.
          </p>
          <p>
            Because each artefact undergoes stringent quality inspection, gemstone certification, and hand-finishing, our dedicated 30-day preparation window guarantees the uncompromising standard of the house.
          </p>
          <p>
            For ceremonial requirements or private salon consultations, please connect directly with{" "}
            <Link href="/concierge" className="text-gold-bright underline hover:text-gold-pale">
              The Concierge
            </Link>{" "}
            or via our direct WhatsApp line.
          </p>
        </div>
      </article>

      <MaisonFooter />
    </main>
  );
}
