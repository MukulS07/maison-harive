import Link from "next/link";
import { Logo, SiteHeader } from "@/components/SiteHeader";
import { ButtonLink, Eyebrow, GoldBackdrop } from "@/components/ui";
import { site } from "@/content/site";

export default function NotFound() {
  return (
    <main className="relative flex min-h-dvh flex-col justify-between bg-black text-ivory">
      <GoldBackdrop scrim={0.85} />

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

      <section className="relative z-10 mx-auto flex max-w-2xl flex-col items-center px-5 py-24 text-center">
        <span aria-hidden="true" className="h-16 w-px bg-gold/50" />
        <Eyebrow className="mt-6">CHAMBER UNCHARTED · 404</Eyebrow>
        <h1 className="km-gold-text mt-3 font-display text-[clamp(44px,6vw,80px)] font-bold tracking-[0.06em] uppercase">
          Lost to Time
        </h1>
        <p className="mt-4 max-w-lg font-serif text-[18px] text-ivory-soft italic md:text-[20px]">
          The threshold you seek does not exist within the current chronicles of the house.
        </p>

        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <ButtonLink href="/archive">EXPLORE THE ARCHIVE</ButtonLink>
          <ButtonLink href="/" variant="secondary">
            RETURN TO THE GATES
          </ButtonLink>
        </div>
      </section>

      <footer className="relative z-10 border-t border-line/60 py-6 text-center">
        <p className="font-display text-micro tracking-[0.3em] text-gold/60 uppercase">
          {site.brand} · {site.tagline}
        </p>
      </footer>
    </main>
  );
}
