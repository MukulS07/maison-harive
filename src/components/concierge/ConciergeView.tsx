"use client";

import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { useEffect, useState, type FormEvent } from "react";
import { products } from "@/content/products";
import { site } from "@/content/site";
import {
  CheckIcon,
  ClockIcon,
  CloseIcon,
  MailIcon,
  MapPinIcon,
  PhoneIcon,
  SearchIcon,
  WhatsAppIcon,
} from "../icons";
import { Button, Eyebrow, GoldBackdrop } from "../ui";
import { MaisonFooter } from "../MaisonFooter";

export type ConciergeSectionId =
  | "appointments"
  | "custom"
  | "enquiry"
  | "styling"
  | "whatsapp"
  | "orders"
  | "contact";

export const conciergeSections: { id: ConciergeSectionId; label: string; short: string }[] = [
  { id: "appointments", label: "Private Appointments", short: "Appointments" },
  { id: "custom", label: "Custom Orders", short: "Custom" },
  { id: "enquiry", label: "Product Enquiry", short: "Enquiry" },
  { id: "styling", label: "Styling", short: "Styling" },
  { id: "whatsapp", label: "WhatsApp Consultation", short: "WhatsApp" },
  { id: "orders", label: "Order History", short: "Orders" },
  { id: "contact", label: "Contact Us", short: "Contact" },
];

type ConciergeViewProps = {
  initialSection?: ConciergeSectionId;
  initialProduct?: string;
  onClose?: () => void;
  isModal?: boolean;
};

export function ConciergeView({
  initialSection = "appointments",
  initialProduct,
  onClose,
  isModal = false,
}: ConciergeViewProps) {
  const [activeTab, setActiveTab] = useState<ConciergeSectionId>(initialSection);
  const [submittedRef, setSubmittedRef] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  // Form states
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [city, setCity] = useState("");
  const [contactMethod, setContactMethod] = useState("whatsapp");
  const [message, setMessage] = useState("");
  const [website, setWebsite] = useState("");

  // Section specific states
  const [prefDate, setPrefDate] = useState("");
  const [prefTime, setPrefTime] = useState("Afternoon (2 PM – 5 PM)");

  const [customCategory, setCustomCategory] = useState("Sherwani Buttons");
  const [customMetal, setCustomMetal] = useState("18k gold");
  const [customBudget, setCustomBudget] = useState("Flexible / Discretionary");

  const [enquiryProduct, setEnquiryProduct] = useState(
    initialProduct || products[0]?.name || "Shield of Legacy"
  );
  const [enquiryTopic, setEnquiryTopic] = useState("Gemstone & Purity Certifications");

  const [stylingOccasion, setStylingOccasion] = useState("Royal Wedding Ceremony");
  const [stylingPalette, setStylingPalette] = useState("Ivory & Gold Zari");

  // Read URL query params on client without forcing Next.js SSR bailout
  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    const paramSection = params.get("section") as ConciergeSectionId | null;
    const paramProd = params.get("product");

    if (paramSection && conciergeSections.some((s) => s.id === paramSection)) {
      setActiveTab(paramSection);
    }
    if (paramProd) {
      setEnquiryProduct(paramProd);
    }
  }, []);

  // Order history search
  const [orderQuery, setOrderQuery] = useState("");
  const [searchedOrder, setSearchedOrder] = useState<boolean>(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setApiError(null);
    try {
      const notes = [
        message ? `Notes: ${message}` : null,
        activeTab === "appointments" ? (city ? `City: ${city}` : null) : null,
        activeTab === "custom" ? `Category: ${customCategory}, Metal: ${customMetal}, Budget: ${customBudget}` : null,
        activeTab === "enquiry" ? `Product: ${enquiryProduct}, Topic: ${enquiryTopic}` : null,
        activeTab === "styling" ? `Occasion: ${stylingOccasion}, Palette: ${stylingPalette}` : null,
        activeTab === "contact" ? (city ? `Preferred Salon: ${city}` : null) : null,
        `Preferred Contact: ${contactMethod}`,
      ].filter(Boolean).join(" | ");

      const res = await fetch("/api/concierge", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          phone,
          email,
          type: activeTab,
          message: notes,
          prefDate,
          prefTime,
          website,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Unable to process appointment dispatch.");
      }
      setSubmittedRef(data.reference || `MH-${Math.floor(10000 + Math.random() * 90000)}`);
    } catch (err: unknown) {
      setApiError(err instanceof Error ? err.message : "Error contacting Concierge. Please connect directly via WhatsApp.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setSubmittedRef(null);
    setApiError(null);
    setMessage("");
  };

  return (
    <div className={`relative min-h-dvh bg-black text-ivory ${isModal ? "p-0" : ""}`}>
      <GoldBackdrop scrim={0.8} />

      {/* Header bar */}
      <header className="relative z-20 flex h-16 items-center justify-between border-b border-line px-5 md:h-header md:px-gutter">
        <div className="flex items-center gap-4">
          {onClose ? (
            <button
              type="button"
              onClick={onClose}
              className="flex size-11 cursor-pointer items-center justify-center rounded-pill border border-gold/40 text-ivory transition-colors hover:border-gold hover:text-gold-bright"
              aria-label="Close Concierge"
            >
              <CloseIcon />
            </button>
          ) : (
            <Link
              href="/archive"
              className="font-display text-[13px] tracking-[0.25em] text-gold-bright uppercase transition-colors hover:text-gold-pale"
            >
              ← Return
            </Link>
          )}
          <span className="font-display text-[13px] font-semibold tracking-[0.3em] text-gold uppercase md:text-label">
            Maison Concierge
          </span>
        </div>

        <Link
          href="/"
          className="font-display text-[15px] font-semibold tracking-[0.28em] text-ivory hover:text-gold-bright md:text-lg"
        >
          {site.logo}
        </Link>

        <div className="flex items-center gap-3">
          <a
            href={`https://wa.me/${site.contact.whatsappNumber}?text=Hello%20Maison%20Hariv%C3%A9%2C%20I%20would%20like%20to%20connect%20with%20The%20Concierge.`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 rounded-pill border border-gold/40 bg-gold/10 px-3.5 py-1.5 font-display text-[11px] tracking-[0.18em] text-gold-bright uppercase transition-all duration-300 hover:border-gold hover:bg-gold/20"
          >
            <WhatsAppIcon size={14} />
            <span className="flex flex-col text-left leading-tight sm:flex-row sm:items-center sm:gap-1.5">
              <span className="text-[10px] text-gold/80 sm:text-[11px]">Direct Line:</span>
              <span className="font-semibold text-ivory tracking-wider text-[11px] sm:text-[12px]">+91 88900 22244</span>
            </span>
          </a>
        </div>
      </header>

      {/* Banner Intro */}
      <div className="relative z-10 mx-auto max-w-4xl px-5 pt-10 pb-8 text-center md:pt-14 md:pb-10">
        <Eyebrow>WHITE-GLOVE ROYAL ASSISTANCE</Eyebrow>
        <h1 className="km-gold-text mt-2 font-display text-[clamp(36px,5.5vw,72px)] leading-none font-bold tracking-[0.05em] uppercase">
          The Concierge
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-[18px] text-ivory-soft italic md:text-[21px]">
          Dedicated curators for private salon viewings, bespoke royal commissions, jewellery styling, and tailored acquisitions.
        </p>

        {/* Section Tabs Switcher */}
        <nav
          aria-label="Concierge Sections"
          className="km-scroll-x mt-8 flex snap-x snap-mandatory gap-2 overflow-x-auto pb-2 md:flex-wrap md:justify-center"
        >
          {conciergeSections.map((sec) => {
            const isSelected = activeTab === sec.id;
            return (
              <button
                key={sec.id}
                type="button"
                onClick={() => {
                  setActiveTab(sec.id);
                  setSubmittedRef(null);
                }}
                className={`relative shrink-0 cursor-pointer rounded-pill px-4 py-2.5 font-display text-[12px] tracking-[0.22em] uppercase transition-all duration-300 md:px-5 md:py-3 md:text-[13px] ${
                  isSelected
                    ? "text-gold-bright shadow-[0_0_25px_rgba(201,164,92,0.35)]"
                    : "text-ivory/70 hover:text-ivory"
                }`}
              >
                {isSelected && (
                  <motion.span
                    layoutId="activeConciergeTab"
                    className="absolute inset-0 rounded-pill border border-gold bg-gold/20"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
                {!isSelected && (
                  <span className="absolute inset-0 rounded-pill border border-gold/25 bg-surface/50 transition-colors duration-300 hover:border-gold/50" />
                )}
                <span className="relative z-10">{sec.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Main Content Area */}
      <main className="relative z-10 mx-auto max-w-4xl px-5 pb-24">
        <AnimatePresence mode="wait">
          {submittedRef ? (
            /* Royal Confirmation State */
            <motion.div
              key="confirmation"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="rounded-lg border border-gold/50 bg-surface/90 p-8 text-center backdrop-blur-md md:p-14"
            >
              <div className="mx-auto mb-6 flex size-16 items-center justify-center rounded-full border border-gold bg-gold/15 text-gold-bright shadow-glow">
                <CheckIcon size={32} />
              </div>
              <Eyebrow>DISPATCH CONFIRMED</Eyebrow>
              <h2 className="km-gold-text mt-2 font-display text-h2 font-bold tracking-[0.05em] uppercase">
                Your Request Has Been Received
              </h2>
              <p className="mx-auto mt-4 max-w-lg text-[19px] text-ivory-soft italic">
                A dedicated curator from Maison Harivé has been assigned to your counsel and will reach out through your preferred contact method shortly.
              </p>
              <div className="mx-auto my-8 max-w-xs rounded border border-gold/30 bg-black/60 p-4">
                <span className="font-display text-micro tracking-[0.3em] text-gold uppercase">
                  Royal Protocol Reference
                </span>
                <p className="mt-1 font-display text-[22px] font-bold tracking-[0.2em] text-gold-bright">
                  {submittedRef}
                </p>
              </div>
              <div className="flex flex-wrap justify-center gap-4">
                <Button onClick={resetForm} variant="secondary">
                  Submit Another Request
                </Button>
                <Link
                  href="/archive"
                  className="inline-flex items-center justify-center rounded-btn bg-gold px-8 py-3.5 font-display text-[13px] font-bold tracking-[0.28em] text-on-gold shadow-glow hover:bg-gold-bright"
                >
                  Return to Archive
                </Link>
              </div>
            </motion.div>
          ) : (
            /* Dynamic Section Form */
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.35, ease: [0.2, 0.7, 0.1, 1] }}
              className="overflow-hidden rounded-lg border border-gold/35 bg-surface/80 p-6 backdrop-blur-md md:p-12"
            >
              {apiError && (
                <div role="alert" className="mb-6 rounded border border-rose-500/50 bg-rose-950/40 p-4 text-center font-display text-xs tracking-[0.2em] text-rose-200 uppercase">
                  {apiError}
                </div>
              )}
              {/* 1. PRIVATE APPOINTMENTS */}
              {activeTab === "appointments" && (
                <div>
                  <div className="mb-8 border-b border-line pb-6 text-center md:text-left">
                    <Eyebrow>SECTION I · SALON PRESENTATION</Eyebrow>
                    <h2 className="font-display text-[26px] font-semibold tracking-[0.08em] text-ivory uppercase md:text-[32px]">
                      Private Appointments
                    </h2>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="absolute left-[-9999px]" aria-hidden="true" tabIndex={-1}>
                      <input type="text" name="website" value={website} onChange={(e) => setWebsite(e.target.value)} autoComplete="off" tabIndex={-1} />
                    </div>
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                      <div>
                        <label className="mb-2 block font-display text-[12px] tracking-[0.25em] text-gold uppercase">
                          Full Name *
                        </label>
                        <input
                          required
                          type="text"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="Your Name and Title"
                          autoComplete="name"
                          className="km-field"
                        />
                      </div>
                      <div>
                        <label className="mb-2 block font-display text-[12px] tracking-[0.25em] text-gold uppercase">
                          Phone / WhatsApp *
                        </label>
                        <input
                          required
                          type="tel"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="+91 98765 43210"
                          autoComplete="tel"
                          inputMode="tel"
                          className="km-field"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                      <div>
                        <label className="mb-2 block font-display text-[12px] tracking-[0.25em] text-gold uppercase">
                          Email Address *
                        </label>
                        <input
                          required
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="name@domain.com"
                          autoComplete="email"
                          inputMode="email"
                          className="km-field"
                        />
                      </div>
                      <div>
                        <label className="mb-2 block font-display text-[12px] tracking-[0.25em] text-gold uppercase">
                          City / Residence Location
                        </label>
                        <input
                          type="text"
                          value={city}
                          onChange={(e) => setCity(e.target.value)}
                          placeholder="e.g. Mumbai, New Delhi, London"
                          autoComplete="address-level2"
                          className="km-field"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                      <div>
                        <label className="mb-2 block font-display text-[12px] tracking-[0.25em] text-gold uppercase">
                          Contact Channel
                        </label>
                        <select
                          value={contactMethod}
                          onChange={(e) => setContactMethod(e.target.value)}
                          className="km-field bg-surface text-ivory"
                        >
                          <option value="whatsapp">WhatsApp</option>
                          <option value="phone">Phone Call</option>
                          <option value="email">Email</option>
                        </select>
                      </div>
                      <div>
                        <label className="mb-2 block font-display text-[12px] tracking-[0.25em] text-gold uppercase">
                          Preferred Date
                        </label>
                        <input
                          type="date"
                          value={prefDate}
                          onChange={(e) => setPrefDate(e.target.value)}
                          className="km-field"
                        />
                      </div>
                      <div>
                        <label className="mb-2 block font-display text-[12px] tracking-[0.25em] text-gold uppercase">
                          Preferred Time Window
                        </label>
                        <select
                          value={prefTime}
                          onChange={(e) => setPrefTime(e.target.value)}
                          className="km-field bg-surface text-ivory"
                        >
                          <option value="Morning (11 AM – 1 PM)">Morning (11 AM – 1 PM)</option>
                          <option value="Afternoon (2 PM – 5 PM)">Afternoon (2 PM – 5 PM)</option>
                          <option value="Evening (5 PM – 8 PM)">Evening (5 PM – 8 PM)</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="mb-2 block font-display text-[12px] tracking-[0.25em] text-gold uppercase">
                        Pieces or Interests for Presentation
                      </label>
                      <textarea
                        rows={3}
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Mention any specific artefacts from The Archive, upcoming occasions, or custom requirements..."
                        className="km-field"
                      />
                    </div>

                    <div className="pt-4">
                      <Button type="submit" disabled={isSubmitting} className="w-full md:w-auto">
                        {isSubmitting ? "DISPATCHING REQUEST..." : "REQUEST PRIVATE APPOINTMENT"}
                      </Button>
                    </div>
                  </form>
                </div>
              )}

              {/* 2. CUSTOM ORDERS */}
              {activeTab === "custom" && (
                <div>
                  <div className="mb-8 border-b border-line pb-6 text-center md:text-left">
                    <Eyebrow>SECTION II · BESPOKE COMMISSION</Eyebrow>
                    <h2 className="font-display text-[26px] font-semibold tracking-[0.08em] text-ivory uppercase md:text-[32px]">
                      Custom Orders & Atelier Commissions
                    </h2>
                    <p className="mt-2 text-[17px] text-ivory-soft italic md:text-[19px]">
                      Collaborate with our founders and master goldsmiths to create an eternal, one-of-a-kind jewel for your family lineage.
                    </p>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                      <div>
                        <label className="mb-2 block font-display text-[12px] tracking-[0.25em] text-gold uppercase">
                          Full Name *
                        </label>
                        <input
                          required
                          type="text"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="Your Name"
                          autoComplete="name"
                          className="km-field"
                        />
                      </div>
                      <div>
                        <label className="mb-2 block font-display text-[12px] tracking-[0.25em] text-gold uppercase">
                          Phone / WhatsApp *
                        </label>
                        <input
                          required
                          type="tel"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="+91 Phone Number"
                          autoComplete="tel"
                          inputMode="tel"
                          className="km-field"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                      <div>
                        <label className="mb-2 block font-display text-[12px] tracking-[0.25em] text-gold uppercase">
                          Email Address *
                        </label>
                        <input
                          required
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="Email address"
                          autoComplete="email"
                          inputMode="email"
                          className="km-field"
                        />
                      </div>
                      <div>
                        <label className="mb-2 block font-display text-[12px] tracking-[0.25em] text-gold uppercase">
                          Artefact Type
                        </label>
                        <select
                          value={customCategory}
                          onChange={(e) => setCustomCategory(e.target.value)}
                          className="km-field bg-surface text-ivory"
                        >
                          <option value="Sherwani Buttons">Sherwani Buttons (Set of 7 / 9)</option>
                          <option value="Royal Brooch">Royal Brooch / Breastplate Medallion</option>
                          <option value="Kalangi">Kalangi (Turban Crest Jewel)</option>
                          <option value="Ceremonial Pendant">Ceremonial Pendant & Chain</option>
                          <option value="Imperial Signet Ring">Imperial Signet Ring</option>
                          <option value="Other Custom Artefact">Other Bespoke Piece</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                      <div>
                        <label className="mb-2 block font-display text-[12px] tracking-[0.25em] text-gold uppercase">
                          Precious Metals & Gemstones
                        </label>
                        <select
                          value={customMetal}
                          onChange={(e) => setCustomMetal(e.target.value)}
                          className="km-field bg-surface text-ivory"
                        >
                          <option value="18k gold">18k gold</option>
                          <option value="14k gold">14k gold</option>
                          <option value="9k gold">9k gold</option>
                          <option value="Silver">Silver</option>
                          <option value="Gold with precious stones">Gold with precious stones</option>
                          <option value="Silver with precious stones">Silver with precious stones</option>
                          <option value="Gold with diamonds and polki">Gold with diamonds and polki</option>
                          <option value="Silver with diamond and polki">Silver with diamond and polki</option>
                        </select>
                      </div>
                      <div>
                        <label className="mb-2 block font-display text-[12px] tracking-[0.25em] text-gold uppercase">
                          Estimated Budget Tier
                        </label>
                        <select
                          value={customBudget}
                          onChange={(e) => setCustomBudget(e.target.value)}
                          className="km-field bg-surface text-ivory"
                        >
                          <option value="Flexible / Discretionary">Flexible / Discretionary</option>
                          <option value="₹2,00,000 – ₹5,00,000">₹2,00,000 – ₹5,00,000</option>
                          <option value="₹5,00,000 – ₹15,00,000">₹5,00,000 – ₹15,00,000</option>
                          <option value="₹15,00,000+ (Imperial Bespoke)">₹15,00,000+ (Imperial Bespoke)</option>
                        </select>
                      </div>
                      <div>
                        <label className="mb-2 block font-display text-[12px] tracking-[0.25em] text-gold uppercase">
                          Target Completion Window
                        </label>
                        <input
                          type="text"
                          value={prefDate}
                          onChange={(e) => setPrefDate(e.target.value)}
                          placeholder="e.g. Wedding in November 2026"
                          className="km-field"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="mb-2 block font-display text-[12px] tracking-[0.25em] text-gold uppercase">
                        Design Vision & Narrative
                      </label>
                      <textarea
                        rows={4}
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Describe your vision, symbols of personal significance, family crest motifs, or styling inspirations..."
                        className="km-field"
                      />
                    </div>

                    <div className="pt-4">
                      <Button type="submit" disabled={isSubmitting} className="w-full md:w-auto">
                        {isSubmitting ? "DISPATCHING REQUEST..." : "COMMISSION BESPOKE ARTEFACT"}
                      </Button>
                    </div>
                  </form>
                </div>
              )}

              {/* 3. PRODUCT ENQUIRY */}
              {activeTab === "enquiry" && (
                <div>
                  <div className="mb-8 border-b border-line pb-6 text-center md:text-left">
                    <Eyebrow>SECTION III · ARCHIVE INQUIRY</Eyebrow>
                    <h2 className="font-display text-[26px] font-semibold tracking-[0.08em] text-ivory uppercase md:text-[32px]">
                      Product & Gemstone Enquiry
                    </h2>
                    <p className="mt-2 text-[17px] text-ivory-soft italic md:text-[19px]">
                      Direct questions regarding provenance, assay certificates, gold weight, customization options, or discreet pricing for any piece in our catalogue.
                    </p>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                      <div>
                        <label className="mb-2 block font-display text-[12px] tracking-[0.25em] text-gold uppercase">
                          Your Name *
                        </label>
                        <input
                          required
                          type="text"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="Full Name"
                          autoComplete="name"
                          className="km-field"
                        />
                      </div>
                      <div>
                        <label className="mb-2 block font-display text-[12px] tracking-[0.25em] text-gold uppercase">
                          Contact (Phone / WhatsApp) *
                        </label>
                        <input
                          required
                          type="tel"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="+91 Number"
                          autoComplete="tel"
                          inputMode="tel"
                          className="km-field"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                      <div>
                        <label className="mb-2 block font-display text-[12px] tracking-[0.25em] text-gold uppercase">
                          Email Address *
                        </label>
                        <input
                          required
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="Email address"
                          autoComplete="email"
                          inputMode="email"
                          className="km-field"
                        />
                      </div>
                      <div>
                        <label className="mb-2 block font-display text-[12px] tracking-[0.25em] text-gold uppercase">
                          Piece of Interest
                        </label>
                        <select
                          value={enquiryProduct}
                          onChange={(e) => setEnquiryProduct(e.target.value)}
                          className="km-field bg-surface text-ivory"
                        >
                          {products.map((p) => (
                            <option key={p.id} value={p.name}>
                              {p.name} ({(p.typeLabel || p.category).toUpperCase()})
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="mb-2 block font-display text-[12px] tracking-[0.25em] text-gold uppercase">
                        Nature of Inquiry
                      </label>
                      <select
                        value={enquiryTopic}
                        onChange={(e) => setEnquiryTopic(e.target.value)}
                        className="km-field bg-surface text-ivory"
                      >
                        <option value="Gemstone & Purity Certifications">Gemstone & Purity Certifications</option>
                        <option value="Sizing, Measurements & Weight">Sizing, Measurements & Weight</option>
                        <option value="Bespoke Metal / Stone Alteration">Bespoke Metal / Stone Alteration</option>
                        <option value="Price & Acquisition Terms">Price & Acquisition Terms</option>
                        <option value="Vault Storage & Insured Handover">Vault Storage & Insured Handover</option>
                      </select>
                    </div>

                    <div>
                      <label className="mb-2 block font-display text-[12px] tracking-[0.25em] text-gold uppercase">
                        Your Inquiry Details
                      </label>
                      <textarea
                        rows={3}
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Please write your questions here..."
                        className="km-field"
                      />
                    </div>

                    <div className="pt-4">
                      <Button type="submit" disabled={isSubmitting} className="w-full md:w-auto">
                        {isSubmitting ? "DISPATCHING REQUEST..." : "DISPATCH PRODUCT ENQUIRY"}
                      </Button>
                    </div>
                  </form>
                </div>
              )}

              {/* 4. STYLING */}
              {activeTab === "styling" && (
                <div>
                  <div className="mb-8 border-b border-line pb-6 text-center md:text-left">
                    <Eyebrow>SECTION IV · CURATED STYLING</Eyebrow>
                    <h2 className="font-display text-[26px] font-semibold tracking-[0.08em] text-ivory uppercase md:text-[32px]">
                      Royal Wardrobe & Jewellery Styling
                    </h2>
                    <p className="mt-2 text-[17px] text-ivory-soft italic md:text-[19px]">
                      Harmonize your ceremonial attire — sherwani, bandhgala, tuxedo, or achkan — with heirloom jewels curated to match your stature.
                    </p>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                      <div>
                        <label className="mb-2 block font-display text-[12px] tracking-[0.25em] text-gold uppercase">
                          Full Name *
                        </label>
                        <input
                          required
                          type="text"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="Your Name"
                          autoComplete="name"
                          className="km-field"
                        />
                      </div>
                      <div>
                        <label className="mb-2 block font-display text-[12px] tracking-[0.25em] text-gold uppercase">
                          WhatsApp / Phone *
                        </label>
                        <input
                          required
                          type="tel"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="+91 Number"
                          autoComplete="tel"
                          inputMode="tel"
                          className="km-field"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                      <div>
                        <label className="mb-2 block font-display text-[12px] tracking-[0.25em] text-gold uppercase">
                          Occasion
                        </label>
                        <select
                          value={stylingOccasion}
                          onChange={(e) => setStylingOccasion(e.target.value)}
                          className="km-field bg-surface text-ivory"
                        >
                          <option value="Royal Wedding Ceremony (Groom / Host)">Royal Wedding Ceremony (Groom / Host)</option>
                          <option value="State Banquet / Diplomatic Reception">State Banquet / Diplomatic Reception</option>
                          <option value="High-Society Gala / Black Tie">High-Society Gala / Black Tie</option>
                          <option value="Family Milestone / Heirloom Portraiture">Family Milestone / Heirloom Portraiture</option>
                        </select>
                      </div>
                      <div>
                        <label className="mb-2 block font-display text-[12px] tracking-[0.25em] text-gold uppercase">
                          Attire Color & Fabric
                        </label>
                        <input
                          type="text"
                          value={stylingPalette}
                          onChange={(e) => setStylingPalette(e.target.value)}
                          placeholder="e.g. Raw Silk Ivory Sherwani with Gold Zari"
                          className="km-field"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="mb-2 block font-display text-[12px] tracking-[0.25em] text-gold uppercase">
                        Styling Vision & Preferred Jewellery Mix
                      </label>
                      <textarea
                        rows={3}
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Tell us what you would like to pair: e.g. Turban Kalangi + 7 Sherwani Buttons + Emerald Brooch..."
                        className="km-field"
                      />
                    </div>

                    <div className="pt-4">
                      <Button type="submit" disabled={isSubmitting} className="w-full md:w-auto">
                        {isSubmitting ? "DISPATCHING REQUEST..." : "REQUEST STYLING SESSION"}
                      </Button>
                    </div>
                  </form>
                </div>
              )}

              {/* 5. WHATSAPP CONSULTATION */}
              {activeTab === "whatsapp" && (
                <div>
                  <div className="mb-8 border-b border-line pb-6 text-center md:text-left">
                    <Eyebrow>SECTION V · INSTANT ENQUIRY</Eyebrow>
                    <h2 className="font-display text-[26px] font-semibold tracking-[0.08em] text-ivory uppercase md:text-[32px]">
                      WhatsApp Royal Consultation
                    </h2>
                    <p className="mt-2 text-[17px] text-ivory-soft italic md:text-[19px]">
                      Connect in real time with our Private Client Advisory team over secure WhatsApp. Receive high-definition videos of artefacts in natural light, discreet pricing, and quick answers.
                    </p>
                  </div>

                  {/* Immediate Action Card */}
                  <div className="mb-10 rounded border border-gold/40 bg-surface-raised p-6 text-center md:p-8">
                    <div className="mx-auto mb-4 flex size-14 items-center justify-center rounded-full border border-gold/60 bg-gold/15 text-gold-bright shadow-glow">
                      <WhatsAppIcon size={28} />
                    </div>
                    <h3 className="font-display text-[18px] font-semibold tracking-[0.1em] text-ivory uppercase">
                      Open Immediate WhatsApp Channel
                    </h3>
                    <p className="mx-auto mt-2 max-w-md text-[16px] text-ivory-soft italic">
                      Chat directly with our senior jewellery advisor right now. Available 7 days a week, 10:00 AM – 8:00 PM IST.
                    </p>
                    <div className="mt-6 flex flex-wrap justify-center gap-4">
                      <a
                        href={`https://wa.me/918890022244?text=Hello%20Maison%20Hariv%C3%A9%2C%20I%20am%20interested%20in%20consulting%20with%20The%20Concierge%20regarding%20your%20jewels.`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2.5 rounded-btn bg-gold px-8 py-3.5 font-display text-[13px] font-bold tracking-[0.25em] text-on-gold shadow-glow transition-all duration-300 hover:bg-gold-bright"
                      >
                        <WhatsAppIcon size={18} />
                        START WHATSAPP CHAT
                      </a>
                    </div>
                    <div className="mt-4 flex flex-col items-center gap-1">
                      <a
                        href="tel:+918890022244"
                        className="font-display text-[18px] font-bold tracking-[0.16em] text-gold-bright hover:underline"
                      >
                        +91 88900 22244
                      </a>
                      <span className="text-micro tracking-[0.28em] text-ivory-soft/80 uppercase">
                        Direct Line & WhatsApp
                      </span>
                    </div>
                  </div>

                  {/* Request WhatsApp Callback Form */}
                  <div className="border-t border-line/60 pt-6">
                    <h3 className="mb-2 font-display text-[16px] font-semibold tracking-[0.14em] text-gold uppercase">
                      Or Request A WhatsApp Callback
                    </h3>
                    <p className="mb-6 text-[15px] text-ivory-soft/80 italic">
                      Leave your WhatsApp number and our concierge will initiate a private chat at your convenience.
                    </p>

                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        <div>
                          <label className="mb-2 block font-display text-[12px] tracking-[0.25em] text-gold uppercase">
                            Your Name *
                          </label>
                          <input
                            required
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Full Name"
                            autoComplete="name"
                            className="km-field"
                          />
                        </div>
                        <div>
                          <label className="mb-2 block font-display text-[12px] tracking-[0.25em] text-gold uppercase">
                            WhatsApp Number (with Country Code) *
                          </label>
                          <input
                            required
                            type="tel"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            placeholder="+91 98765 43210"
                            autoComplete="tel"
                            inputMode="tel"
                            className="km-field"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="mb-2 block font-display text-[12px] tracking-[0.25em] text-gold uppercase">
                          Topic or Message for the Advisor
                        </label>
                        <input
                          type="text"
                          value={message}
                          onChange={(e) => setMessage(e.target.value)}
                          placeholder="e.g. Would like video of Shield of Legacy brooch and pricing..."
                          className="km-field"
                        />
                      </div>

                      <div>
                        <Button type="submit" disabled={isSubmitting} variant="secondary">
                          {isSubmitting ? "DISPATCHING REQUEST..." : "REQUEST WHATSAPP REACHOUT"}
                        </Button>
                      </div>
                    </form>
                  </div>
                </div>
              )}

              {/* 6. ORDER HISTORY */}
              {activeTab === "orders" && (
                <div>
                  <div className="mb-8 border-b border-line pb-6 text-center md:text-left">
                    <Eyebrow>SECTION VI · ACQUISITIONS & TRACKING</Eyebrow>
                    <h2 className="font-display text-[26px] font-semibold tracking-[0.08em] text-ivory uppercase md:text-[32px]">
                      Order History & Vault Tracking
                    </h2>
                    <p className="mt-2 text-[17px] text-ivory-soft italic md:text-[19px]">
                      Track the creation lifecycle of your bespoke commissions, assay certifications, and insured diplomatic deliveries.
                    </p>
                  </div>

                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      setSearchedOrder(true);
                    }}
                    className="mb-8 flex flex-col gap-4 sm:flex-row"
                  >
                    <div className="relative flex-1">
                      <input
                        type="text"
                        value={orderQuery}
                        onChange={(e) => {
                          setOrderQuery(e.target.value);
                          setSearchedOrder(false);
                        }}
                        placeholder="Enter Order Reference ID (e.g. MH-88421)"
                        className="km-field pr-10"
                      />
                      <SearchIcon className="absolute right-2 bottom-3 text-gold/60" />
                    </div>
                    <Button type="submit" className="shrink-0">
                      LOOKUP ORDER
                    </Button>
                  </form>

                  {/* Order Result Card */}
                  {searchedOrder && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="rounded border border-gold/45 bg-surface-raised p-6"
                    >
                      <div className="mb-4 flex flex-wrap items-center justify-between gap-2 border-b border-line pb-4">
                        <div>
                          <span className="font-display text-micro tracking-[0.3em] text-gold uppercase">
                            Order Reference
                          </span>
                          <h3 className="font-display text-[18px] font-bold tracking-[0.16em] text-ivory">
                            {orderQuery.trim() ? orderQuery.toUpperCase() : "MH-88421"}
                          </h3>
                        </div>
                        <span className="rounded-pill border border-gold/50 bg-gold/15 px-3 py-1 font-display text-[11px] tracking-[0.2em] text-gold-bright uppercase">
                          In Atelier Vault
                        </span>
                      </div>

                      <div className="grid grid-cols-1 gap-4 text-sm sm:grid-cols-3">
                        <div>
                          <span className="text-micro text-muted uppercase">Artefact</span>
                          <p className="font-display text-[15px] font-semibold text-ivory">
                            Shield of Legacy · Brooch
                          </p>
                        </div>
                        <div>
                          <span className="text-micro text-muted uppercase">Assay Certification</span>
                          <p className="font-display text-[15px] text-gold-bright">
                            22K BIS Hallmarked / Certified
                          </p>
                        </div>
                        <div>
                          <span className="text-micro text-muted uppercase">Estimated Handover</span>
                          <p className="font-display text-[15px] text-ivory">
                            2–3 Days via Armoured Courier
                          </p>
                        </div>
                      </div>

                      {/* Timeline */}
                      <div className="mt-8 border-t border-line/60 pt-6">
                        <span className="mb-4 block font-display text-[11px] tracking-[0.25em] text-gold uppercase">
                          Handcrafting Progression
                        </span>
                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-4">
                          {[
                            { title: "Design Approved", done: true },
                            { title: "Gold Casting & Setting", done: true },
                            { title: "Hallmark & Final Polish", done: true },
                            { title: "Diplomatic Dispatch", done: false },
                          ].map((step, idx) => (
                            <div
                              key={step.title}
                              className={`flex items-center gap-2 rounded border p-2.5 ${
                                step.done
                                  ? "border-gold/50 bg-gold/10 text-gold-bright"
                                  : "border-line bg-black/40 text-muted"
                              }`}
                            >
                              <span className="flex size-5 shrink-0 items-center justify-center rounded-full border border-current text-[10px]">
                                {step.done ? "✓" : idx + 1}
                              </span>
                              <span className="font-display text-[11px] tracking-wider uppercase">
                                {step.title}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {!searchedOrder && (
                    <div className="rounded border border-line bg-black/40 p-6 text-center">
                      <ClockIcon className="mx-auto mb-2 text-gold/60" size={24} />
                      <p className="font-display text-[13px] tracking-[0.2em] text-muted uppercase">
                        Enter your order reference code above to inspect status
                      </p>
                      <p className="mt-1 text-[15px] text-ivory-soft/70 italic">
                        Reference codes are sent to your verified email or WhatsApp upon confirmation of order.
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* 7. CONTACT US */}
              {activeTab === "contact" && (
                <div>
                  <div className="mb-8 border-b border-line pb-6 text-center">
                    <h2 className="km-gold-text font-display text-[26px] font-bold tracking-[0.06em] uppercase md:text-[34px]">
                      Direct Contact & Locations
                    </h2>
                    <p className="mx-auto mt-2 max-w-xl text-[16px] text-ivory-soft italic md:text-[18px]">
                      Experience Maison Harivé jewels in person. Private viewings are conducted by appointment only.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    {/* Jaipur Salon */}
                    <div className="rounded-lg border border-gold/30 bg-surface/80 p-6 backdrop-blur-sm transition-all duration-300 hover:border-gold/60">
                      <div className="border-b border-line pb-3">
                        <span className="font-display text-[16px] font-bold tracking-[0.16em] text-gold uppercase">
                          Jaipur
                        </span>
                      </div>
                      <p className="mt-4 font-display text-[15px] font-semibold text-ivory uppercase">
                        Pearl premier-4, opposite raj mahal palace
                      </p>
                      <p className="mt-1 text-[14px] text-ivory-soft">
                        C Scheme – 302001, Jaipur
                      </p>
                      <div className="mt-4 flex flex-wrap items-center gap-4 border-t border-line/50 pt-3 text-[13px]">
                        <a
                          href="tel:+918890022244"
                          className="font-display font-medium text-gold-bright hover:underline"
                        >
                          +91 88900 22244
                        </a>
                        <span className="text-line">·</span>
                        <a
                          href={site.contact.salons[0].mapUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-ivory/70 hover:text-gold-bright"
                        >
                          View on Map ↗
                        </a>
                      </div>
                    </div>

                    {/* Gurugram Salon */}
                    <div className="rounded-lg border border-gold/30 bg-surface/80 p-6 backdrop-blur-sm transition-all duration-300 hover:border-gold/60">
                      <div className="border-b border-line pb-3">
                        <span className="font-display text-[16px] font-bold tracking-[0.16em] text-gold uppercase">
                          Gurugram
                        </span>
                      </div>
                      <p className="mt-4 font-display text-[15px] font-semibold text-ivory uppercase">
                        The Oberoi Centre, DLF Phase 2
                      </p>
                      <p className="mt-1 text-[14px] text-ivory-soft">
                        Sector 24 – 122002, Gurugram
                      </p>
                      <div className="mt-4 flex flex-wrap items-center gap-4 border-t border-line/50 pt-3 text-[13px]">
                        <a
                          href="tel:+919829122444"
                          className="font-display font-medium text-gold-bright hover:underline"
                        >
                          +91 9829122444
                        </a>
                        <span className="text-line">·</span>
                        <a
                          href={site.contact.salons[1].mapUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-ivory/70 hover:text-gold-bright"
                        >
                          View on Map ↗
                        </a>
                      </div>
                    </div>
                  </div>

                  {/* Quick Contact Bar */}
                  <div className="mt-6 flex flex-wrap items-center justify-between gap-6 rounded-lg border border-gold/30 bg-black/60 p-5 md:px-8">
                    <div className="flex flex-wrap items-center gap-6 sm:gap-10">
                      <div>
                        <span className="block font-display text-[10px] tracking-[0.25em] text-gold uppercase">
                          Contact Numbers
                        </span>
                        <div className="mt-1 flex flex-wrap items-center gap-2 font-display text-[14px] text-ivory">
                          <a href="tel:+918890022244" className="hover:text-gold-bright">+91 88900 22244</a>
                          <span className="text-gold/40">/</span>
                          <a href="tel:+919829122444" className="hover:text-gold-bright">+91 9829122444</a>
                        </div>
                      </div>
                      <div className="hidden h-8 w-px bg-line sm:block" />
                      <div>
                        <span className="block font-display text-[10px] tracking-[0.25em] text-gold uppercase">
                          Direct Email
                        </span>
                        <a
                          href={`mailto:${site.contact.email}`}
                          className="mt-1 block font-display text-[14px] text-gold-bright hover:underline uppercase"
                        >
                          {site.contact.email}
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {!isModal && <MaisonFooter className="mt-16" />}
    </div>
  );
}
