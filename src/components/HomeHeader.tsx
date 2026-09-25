import Link from "next/link";
import { site } from "@/content/site";
import { MobileMenu } from "./MobileMenu";
import { Logo, SiteHeader } from "./SiteHeader";
import { pillClass } from "./ui";

/**
 * Home header (spec §1.1): logo, five pills, Private Viewing.
 * Below xl the pills move into a scrollable row under the header and a menu button appears (spec §7).
 */
export function HomeHeader() {
  const pills = (compact: boolean) =>
    site.nav.map((item, i) => (
      <Link key={item.label} href={item.href} className={pillClass(i === 0, compact)}>
        {item.label}
      </Link>
    ));

  return (
    <>
      <SiteHeader
        left={<Logo />}
        center={
          <nav aria-label="Main" className="hidden gap-2 xl:flex">
            {pills(false)}
          </nav>
        }
        right={
          <>
            <Link
              href={site.privateViewing.href}
              className="hidden text-nav text-gold-bright italic transition-colors duration-300 hover:text-gold-pale xl:inline"
            >
              {site.privateViewing.label}
            </Link>
            <MobileMenu className="xl:hidden" />
          </>
        }
      />
      <nav aria-label="Sections" className="km-scroll-x flex gap-2 overflow-x-auto px-5 pt-2 xl:hidden">
        {pills(true)}
      </nav>
    </>
  );
}
