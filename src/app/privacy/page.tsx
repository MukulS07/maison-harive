import type { Metadata } from "next";
import Link from "next/link";
import { Logo, SiteHeader } from "@/components/SiteHeader";
import { Eyebrow } from "@/components/ui";
import { site } from "@/content/site";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "How Maison Harivé collects, uses, and protects your personal information.",
};

export default function PrivacyPage() {
  return (
    <main className="relative flex min-h-dvh flex-col bg-black text-ivory">

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

      <article className="mx-auto max-w-3xl px-5 py-12 md:py-24">
        <Eyebrow className="mb-4">LEGAL</Eyebrow>
        <h1 className="km-gold-text font-display text-[clamp(32px,5vw,56px)] font-bold tracking-[0.06em] uppercase">
          Privacy Policy
        </h1>
        <p className="mt-2 font-serif text-sm text-ivory-soft italic">
          Last updated: {new Date().toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}
        </p>

        <div className="legal-prose mt-12 space-y-8 font-serif text-[16px] leading-relaxed text-ivory-soft md:text-[18px]">
          <section>
            <h2 className="mb-3 font-display text-[14px] tracking-[0.2em] text-gold uppercase">
              1. Information We Collect
            </h2>
            <p>
              When you use our Concierge service or contact us, we may collect
              your name, email address, phone number, preferred appointment
              details, and any additional notes you provide. We do not collect
              payment information through this website.
            </p>
          </section>

          <section>
            <h2 className="mb-3 font-display text-[14px] tracking-[0.2em] text-gold uppercase">
              2. How We Use Your Information
            </h2>
            <p>
              Your information is used solely to respond to your enquiries,
              arrange private viewings and appointments, fulfil bespoke
              commissions, and communicate updates about {site.brand} services.
              We will never sell or share your personal data with third parties
              for marketing purposes.
            </p>
          </section>

          <section>
            <h2 className="mb-3 font-display text-[14px] tracking-[0.2em] text-gold uppercase">
              3. Data Storage & Security
            </h2>
            <p>
              Your data is transmitted securely via HTTPS and processed through
              our trusted service providers (email dispatch, notification
              webhooks). We retain your information only as long as necessary to
              fulfil the purpose for which it was collected.
            </p>
          </section>

          <section>
            <h2 className="mb-3 font-display text-[14px] tracking-[0.2em] text-gold uppercase">
              4. Cookies
            </h2>
            <p>
              This website uses only essential cookies required for site
              functionality. We do not use tracking cookies or third-party
              advertising cookies. If analytics are enabled in future, we will
              update this policy and request your consent.
            </p>
          </section>

          <section>
            <h2 className="mb-3 font-display text-[14px] tracking-[0.2em] text-gold uppercase">
              5. Your Rights
            </h2>
            <p>
              You may request access to, correction of, or deletion of your
              personal data at any time by contacting us at{" "}
              <a
                href={`mailto:${site.contact.email}`}
                className="text-gold underline underline-offset-4 transition-colors hover:text-gold-bright"
              >
                {site.contact.email}
              </a>
              .
            </p>
          </section>

          <section>
            <h2 className="mb-3 font-display text-[14px] tracking-[0.2em] text-gold uppercase">
              6. Contact
            </h2>
            <p>
              For any privacy-related queries, write to us at{" "}
              <a
                href={`mailto:${site.contact.email}`}
                className="text-gold underline underline-offset-4 transition-colors hover:text-gold-bright"
              >
                {site.contact.email}
              </a>{" "}
              or call{" "}
              <a
                href={`tel:${site.contact.phones[0].raw}`}
                className="text-gold underline underline-offset-4 transition-colors hover:text-gold-bright"
              >
                {site.contact.phones[0].display}
              </a>
              .
            </p>
          </section>
        </div>
      </article>

      <footer className="mt-auto border-t border-line/60 py-6 text-center">
        <p className="font-display text-micro tracking-[0.3em] text-gold/60 uppercase">
          {site.brand} · {site.tagline}
        </p>
      </footer>
    </main>
  );
}
