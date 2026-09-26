import type { Metadata, Viewport } from "next";
import { Cinzel, Cormorant_Garamond } from "next/font/google";
import { site } from "@/content/site";
import { TreasuryBagProvider } from "@/context/TreasuryBagContext";
import "./globals.css";

const cinzel = Cinzel({
  variable: "--font-cinzel",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  display: "swap",
});

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["400", "500"],
  style: ["normal", "italic"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://maisonharive.com"),
  title: {
    default: `${site.brand} · ${site.tagline}`,
    template: `%s · ${site.brand}`,
  },
  description: site.description,
  keywords: [
    "Maison Harivé",
    "Royal Jewellery for Men",
    "Jaipur Heritage Craft",
    "Sherwani Buttons",
    "Royal Kalangi",
    "Ceremonial Brooches",
    "Indian High Jewellery",
  ],
  authors: [{ name: "Harshi & Ritvi Gilara" }],
  creator: site.brand,
  openGraph: {
    title: `${site.brand} · ${site.tagline}`,
    description: site.description,
    url: "https://maisonharive.com",
    siteName: site.brand,
    images: [
      {
        url: "/media/heritage-portrait.jpg",
        width: 1200,
        height: 630,
        alt: `${site.brand} · Heritage seen through a new lens`,
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.brand} · ${site.tagline}`,
    description: site.description,
    images: ["/media/heritage-portrait.jpg"],
  },
};

export const viewport: Viewport = {
  themeColor: "#0a0806",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${cinzel.variable} ${cormorant.variable}`}>
      <body className="min-h-dvh">
        <TreasuryBagProvider>{children}</TreasuryBagProvider>
      </body>
    </html>
  );
}
