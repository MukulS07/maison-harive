import type { Metadata } from "next";
import Link from "next/link";
import { Logo, SiteHeader } from "@/components/SiteHeader";
import { Eyebrow, GoldBackdrop } from "@/components/ui";
import { site } from "@/content/site";

export const metadata: Metadata = {
  title: "Terms & Conditions",
  description:
    "Terms and conditions governing the use of the Maison Harivé website and services.",
};

export default function TermsPage() {
  return (
    <main className="relative flex min-h-dvh flex-col bg-black text-ivory">
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

      <article className="relative z-10 mx-auto max-w-3xl px-5 py-24">
        <Eyebrow className="mb-4">LEGAL</Eyebrow>
        <h1 className="km-gold-text font-display text-[clamp(32px,5vw,56px)] font-bold tracking-[0.06em] uppercase">
          Terms & Conditions
        </h1>
        <p className="mt-2 font-serif text-sm text-ivory-soft italic">
          Last updated: {new Date().toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}
        </p>

        <div className="legal-prose mt-12 space-y-8 font-serif text-[16px] leading-relaxed text-ivory-soft md:text-[18px]">
          <section>
            <h2 className="mb-3 font-display text-[14px] tracking-[0.2em] text-gold uppercase">
              1. About This Website
            </h2>
            <p>
              This website is operated by {site.brand}. By accessing and using
              this site, you agree to be bound by these terms. If you do not
              agree, please do not use this website.
            </p>
          </section>

          <section>
            <h2 className="mb-3 font-display text-[14px] tracking-[0.2em] text-gold uppercase">
              2. Products & Pricing
            </h2>
            <p>
              All products displayed are subject to availability. Prices shown
              are indicative and may change without prior notice. Final pricing,
              including taxes and shipping, will be confirmed during your private
              consultation with our concierge team.
            </p>
          </section>

          <section>
            <h2 className="mb-3 font-display text-[14px] tracking-[0.2em] text-gold uppercase">
              3. Bespoke Commissions
            </h2>
            <p>
              Custom and bespoke pieces are created upon request and subject to
              separate terms agreed upon during the commission process. All
              bespoke orders are final and non-refundable once production has
              commenced.
            </p>
          </section>

          <section>
            <h2 className="mb-3 font-display text-[14px] tracking-[0.2em] text-gold uppercase">
              4. Intellectual Property
            </h2>
            <p>
              All content on this website — including text, images, designs,
              logos, and videos — is the property of {site.brand} and is
              protected by applicable intellectual property laws. You may not
              reproduce, distribute, or use any content without our prior
              written consent.
            </p>
          </section>

          <section>
            <h2 className="mb-3 font-display text-[14px] tracking-[0.2em] text-gold uppercase">
              5. Appointments & Viewings
            </h2>
            <p>
              Private viewings and appointments are arranged through our
              Concierge service and are subject to availability. We reserve the
              right to reschedule or cancel appointments with reasonable notice.
            </p>
          </section>

          <section>
            <h2 className="mb-3 font-display text-[14px] tracking-[0.2em] text-gold uppercase">
              6. Limitation of Liability
            </h2>
            <p>
              {site.brand} shall not be liable for any indirect, incidental, or
              consequential damages arising from the use of this website. This
              site is provided &ldquo;as is&rdquo; without warranties of any
              kind.
            </p>
          </section>

          <section>
            <h2 className="mb-3 font-display text-[14px] tracking-[0.2em] text-gold uppercase">
              7. Governing Law
            </h2>
            <p>
              These terms are governed by and construed in accordance with the
              laws of India. Any disputes shall be subject to the exclusive
              jurisdiction of the courts in Jaipur, Rajasthan.
            </p>
          </section>

          <section>
            <h2 className="mb-3 font-display text-[14px] tracking-[0.2em] text-gold uppercase">
              8. Contact
            </h2>
            <p>
              For questions about these terms, contact us at{" "}
              <a
                href={`mailto:${site.contact.email}`}
                className="text-gold underline underline-offset-4 transition-colors hover:text-gold-bright"
              >
                {site.contact.email}
              </a>
              .
            </p>
          </section>
        </div>
      </article>

      <footer className="relative z-10 mt-auto border-t border-line/60 py-6 text-center">
        <p className="font-display text-micro tracking-[0.3em] text-gold/60 uppercase">
          {site.brand} · {site.tagline}
        </p>
      </footer>
    </main>
  );
}
