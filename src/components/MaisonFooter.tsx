import Image from "next/image";
import Link from "next/link";
import { site } from "@/content/site";
import {
  InstagramIcon,
  LinkedInIcon,
  MailIcon,
  MapPinIcon,
  PhoneIcon,
  WhatsAppIcon,
} from "./icons";

type MaisonFooterProps = {
  className?: string;
};

export function MaisonFooter({ className = "" }: MaisonFooterProps) {
  return (
    <footer
      className={`relative z-10 border-t border-gold/20 bg-[#0a0806] text-ivory ${className}`}
    >
      {/* Subtle top ambient gold shimmer */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold/40 to-transparent"
      />

      <div className="mx-auto max-w-7xl px-6 py-16 md:px-12 md:py-20">
        {/* 3-Column Balanced Grid */}
        <div className="grid grid-cols-1 gap-10 md:grid-cols-3 lg:gap-14 items-start">
          {/* Column 1: Brand & Tagline */}
          <div>
            <Link href="/" className="inline-block group">
              <div className="flex flex-col items-start gap-3">
                <Image
                  src="/media/WebsiteLogo/Websitelogo1.png"
                  alt="Maison Harivé"
                  width={100}
                  height={100}
                  className="rounded-lg object-contain shadow-[0_4px_24px_rgba(201,164,92,0.2)] transition-transform duration-300 group-hover:scale-105"
                  priority
                />
                <span className="font-display text-[11px] tracking-[0.25em] text-gold/80 uppercase">
                  Jaipur · Paris
                </span>
              </div>
            </Link>

            <p className="mt-4 font-serif text-[16px] leading-relaxed text-ivory-soft italic">
              Jewellery that transcends time. Celebrate your legacy, one exquisite piece at a time.
            </p>

            <p className="mt-3 font-serif text-[13.5px] leading-relaxed text-ivory/60">
              Rooted in five generations of Jaipur heritage craft, reimagined with the refinement and restraint of French high jewellery.
            </p>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h3 className="font-serif text-[20px] font-normal text-ivory tracking-[0.02em] whitespace-nowrap">
              Quick Links
            </h3>
            <ul className="mt-5 space-y-2.5 font-serif text-[15px] text-ivory/70">
              <li>
                <Link href="/" className="transition-colors hover:text-gold-bright">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/archive" className="transition-colors hover:text-gold-bright">
                  The Archive
                </Link>
              </li>
              <li>
                <Link href="/treasures" className="transition-colors hover:text-gold-bright">
                  All Treasures
                </Link>
              </li>
              <li>
                <Link href="/chambers" className="transition-colors hover:text-gold-bright">
                  The Chambers
                </Link>
              </li>
              <li>
                <Link href="/concierge" className="transition-colors hover:text-gold-bright">
                  The Concierge
                </Link>
              </li>
              <li>
                <Link href="/sisters" className="transition-colors hover:text-gold-bright">
                  The Sisters
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Connect */}
          <div>
            <h3 className="font-serif text-[20px] font-normal text-ivory tracking-[0.02em] whitespace-nowrap">
              Connect
            </h3>

            <div className="mt-5 space-y-3.5 font-serif text-[14px] text-ivory/75">
              {/* Jaipur */}
              <div className="flex items-start gap-2.5">
                <MapPinIcon size={16} className="mt-1 shrink-0 text-gold" />
                <div className="leading-snug">
                  <span className="block font-medium text-ivory">Jaipur</span>
                  <span className="text-ivory/65">
                    Pearl premier-4, opposite raj mahal palace, c scheme - 302001
                  </span>
                </div>
              </div>

              {/* Gurugram */}
              <div className="flex items-start gap-2.5">
                <MapPinIcon size={16} className="mt-1 shrink-0 text-gold" />
                <div className="leading-snug">
                  <span className="block font-medium text-ivory">Gurugram</span>
                  <span className="text-ivory/65">
                    The Oberoi Centre, DLF Phase 2, Sector 24, 122002
                  </span>
                </div>
              </div>

              {/* Direct Lines */}
              <div className="flex items-start gap-2.5 pt-0.5">
                <PhoneIcon size={16} className="mt-1 shrink-0 text-gold" />
                <div className="leading-snug">
                  <span className="block font-medium text-ivory">Direct Lines</span>
                  <div className="mt-0.5 flex flex-wrap items-center gap-1.5 font-display text-[12px] tracking-wider text-ivory/90">
                    <a
                      href="tel:+918890022244"
                      className="transition-colors hover:text-gold-bright"
                    >
                      +91 88900 22244
                    </a>
                    <span className="text-gold/40">/</span>
                    <a
                      href="tel:+919829122444"
                      className="transition-colors hover:text-gold-bright"
                    >
                      +91 9829122444
                    </a>
                  </div>
                </div>
              </div>

              {/* Direct Email */}
              <div className="flex items-start gap-2.5">
                <MailIcon size={16} className="mt-1 shrink-0 text-gold" />
                <div className="leading-snug">
                  <span className="block font-medium text-ivory">Direct Email</span>
                  <a
                    href="mailto:Maison.harive@gmail.com"
                    className="mt-0.5 block font-serif text-[14px] text-gold-bright hover:underline"
                  >
                    Maison.harive@gmail.com
                  </a>
                </div>
              </div>
            </div>

            {/* Follow Us */}
            <div className="mt-6 pt-4 border-t border-line/40">
              <span className="block font-serif text-[15px] text-ivory/90 mb-3">
                Follow us
              </span>
              <div className="flex items-center gap-3">
                <a
                  href="https://www.instagram.com/maisonharive?stkn=NXZidDFtc2l4N3Zw&utm_source=qr"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                  className="flex size-9 cursor-pointer items-center justify-center rounded-full border border-gold/30 bg-surface/50 text-ivory transition-all duration-300 hover:border-gold hover:bg-gold/15 hover:text-gold-bright hover:scale-105"
                >
                  <InstagramIcon size={16} />
                </a>

                <a
                  href="https://www.linkedin.com/company/maison-harive/"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="LinkedIn"
                  className="flex size-9 cursor-pointer items-center justify-center rounded-full border border-gold/30 bg-surface/50 text-ivory transition-all duration-300 hover:border-gold hover:bg-gold/15 hover:text-gold-bright hover:scale-105"
                >
                  <LinkedInIcon size={16} />
                </a>

                <a
                  href="https://wa.me/918890022244?text=Hello%20Maison%20Hariv%C3%A9%2C%20I%20would%20like%20to%20connect%20with%20The%20Concierge."
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="WhatsApp"
                  className="flex size-9 cursor-pointer items-center justify-center rounded-full border border-gold/30 bg-surface/50 text-ivory transition-all duration-300 hover:border-gold hover:bg-gold/15 hover:text-gold-bright hover:scale-105"
                >
                  <WhatsAppIcon size={16} />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Disclaimer Note */}
        <div className="mt-14 border-t border-line/40 pt-7">
          <p className="font-serif text-[14px] leading-relaxed text-ivory/65 italic text-center sm:text-left max-w-4xl">
            <span className="font-display not-italic text-[10px] tracking-[0.2em] text-gold uppercase mr-2.5">
              Disclaimer ·
            </span>
            Each Maison Hariv&eacute; piece is made especially for you upon request. Please allow up to 30 days for your piece to be crafted and delivered. As every creation is prepared individually, the delivery timeline begins once your order is confirmed.
          </p>
        </div>

        {/* Bottom Bar: Copyright & Clean Links */}
        <div className="mt-7 flex flex-col items-center justify-between gap-4 border-t border-line/40 pt-7 text-center sm:flex-row sm:text-left">
          <p className="font-serif text-[13px] text-ivory/55">
            Copyright &copy; 2026 {site.brand}. All rights reserved.
          </p>

          <div className="flex items-center gap-6 font-display text-[10px] tracking-[0.25em] text-gold/70 uppercase">
            <Link href="/disclaimer" className="transition-colors hover:text-gold-bright">
              Disclaimer
            </Link>
            <span className="text-gold/30">·</span>
            <Link href="/privacy" className="transition-colors hover:text-gold-bright">
              Privacy Policy
            </Link>
          </div>
        </div>

        {/* Developer Credit (Reveals on hovering below & redirects to website) */}
        <div className="mt-8 pt-4 pb-2 text-center group/dev">
          <a
            href="https://mukulsharmaworks.online"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block font-display text-[10px] tracking-[0.28em] text-gold/80 uppercase opacity-0 transition-all duration-500 group-hover/dev:opacity-100 hover:opacity-100 hover:text-gold-bright hover:underline cursor-pointer select-none"
          >
            Developed by Maytrix (Mukul Sharma)
          </a>
        </div>
      </div>
    </footer>
  );
}
