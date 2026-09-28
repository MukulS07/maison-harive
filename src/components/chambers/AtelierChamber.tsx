"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useId, useRef, useState, type FormEvent } from "react";
import { featuredProducts, products } from "@/content/products";
import { site } from "@/content/site";
import { Button, ButtonLink, Diamond, Eyebrow, GoldBackdrop } from "../ui";

type Fields = { name: string; contact: string; date: string; piece: string };
type Errors = Partial<Record<keyof Fields, string>>;

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE = /^\+?[\d\s()-]{7,}$/;

function validate(f: Fields): Errors {
  const e: Errors = {};
  if (f.name.trim().length < 2) e.name = "Please tell us your name.";
  if (!EMAIL.test(f.contact.trim()) && !PHONE.test(f.contact.trim()))
    e.contact = "Please give a phone number or an email address.";
  if (!f.date) e.date = "Please choose a date.";
  else if (f.date < new Date().toISOString().slice(0, 10)) e.date = "Please choose a date from today onwards.";
  return e;
}

/** Chamber II, opened: New Chapter with cinematic video and private viewing. */
export function AtelierChamber() {
  const c = site.chambers.atelier;
  const reduce = useReducedMotion() ?? false;
  const uid = useId();

  // Video state & controls
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      void videoRef.current.play();
      setIsPlaying(true);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !videoRef.current.muted;
    setIsMuted(videoRef.current.muted);
  };

  // Viewing form state
  const [fields, setFields] = useState<Fields>({
    name: "",
    contact: "",
    date: "",
    piece: featuredProducts[0]?.name ?? "Bespoke Creation",
  });
  const [errors, setErrors] = useState<Errors>({});
  const [sent, setSent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const set = (k: keyof Fields) => (v: string) => {
    setFields((f) => ({ ...f, [k]: v }));
    if (errors[k]) setErrors((e) => ({ ...e, [k]: undefined }));
    if (submitError) setSubmitError(null);
  };

  const submit = async (ev: FormEvent<HTMLFormElement>) => {
    ev.preventDefault();
    const e = validate(fields);
    setErrors(e);
    const first = (Object.keys(e) as (keyof Fields)[])[0];
    if (first) {
      document.getElementById(`${uid}-${first}`)?.focus();
      return;
    }
    setSubmitting(true);
    setSubmitError(null);
    try {
      const isEmail = EMAIL.test(fields.contact.trim());
      const res = await fetch("/api/concierge", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: fields.name,
          phone: isEmail ? "" : fields.contact,
          email: isEmail ? fields.contact : "",
          type: "Private Viewing",
          message: `Piece requested: ${fields.piece}`,
          prefDate: fields.date,
          prefTime: "Atelier Viewing Session",
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Unable to dispatch viewing request.");
      }
      setSent(true);
    } catch (err: unknown) {
      setSubmitError(err instanceof Error ? err.message : "Error dispatching viewing request. Please connect directly via Concierge.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      {/* ── Section 1: Cinematic Video Showcase with Title & Tagline ── */}
      <section className="relative overflow-hidden px-5 py-14 md:px-gutter lg:py-20">
        <GoldBackdrop scrim={0.78} />
        {/* Subtle decorative gold edge matching chamber motion */}
        <span aria-hidden="true" className="absolute inset-y-0 right-0 hidden w-px bg-gold lg:block" />

        <div className="relative mx-auto flex max-w-5xl flex-col items-center text-center">
          {/* Header Typography */}
          <Eyebrow>{c.eyebrow}</Eyebrow>
          <h1 className="km-gold-text mt-2 font-display text-[clamp(52px,6.5vw,96px)] leading-none font-bold tracking-[0.02em]">
            {c.title}
          </h1>
          <p className="mt-4 max-w-3xl text-[clamp(22px,2.4vw,32px)] leading-snug text-ivory italic">
            {site.atelier.lead}
          </p>

          {/* ── Cinema Video Frame ── */}
          <div className="mt-10 w-full border border-gold p-2 md:p-3.5 bg-black/60 shadow-[0_16px_60px_rgba(0,0,0,0.85)]">
            <div className="relative aspect-[16/9] w-full overflow-hidden border border-gold/40 bg-surface">
              <video
                ref={videoRef}
                preload="auto"
                src={site.atelier.video}
                autoPlay
                loop
                muted={isMuted}
                playsInline
                className="h-full w-full object-cover bg-black"
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
              >
                <source src={site.atelier.video} type="video/mp4" />
                <source src={site.atelier.video} type="video/quicktime" />
              </video>

              {/* Top Film Badge */}
              <div className="pointer-events-none absolute inset-x-0 top-0 flex items-center justify-between p-4 md:p-6 bg-gradient-to-b from-black/80 via-black/30 to-transparent">
                <span className="font-display text-[10px] tracking-[0.3em] text-gold uppercase md:text-xs">
                  {site.atelier.footage}
                </span>
                <span className="font-display text-[10px] tracking-[0.25em] text-ivory-soft md:text-xs">
                  CHAMBER II
                </span>
              </div>

              {/* Bottom Video Controls Overlay */}
              <div className="absolute inset-x-0 bottom-0 flex items-center justify-between p-4 md:p-6 bg-gradient-to-t from-black/90 via-black/40 to-transparent">
                <button
                  type="button"
                  onClick={togglePlay}
                  className="flex items-center gap-2 rounded-pill border border-gold/60 bg-black/60 px-3.5 py-1.5 font-display text-[11px] tracking-[0.25em] text-gold-bright backdrop-blur transition-all duration-300 hover:border-gold hover:bg-gold/20"
                  aria-label={isPlaying ? "Pause video" : "Play video"}
                >
                  {isPlaying ? (
                    <>
                      <span className="inline-block size-2 bg-gold-bright" />
                      <span>PAUSE</span>
                    </>
                  ) : (
                    <>
                      <span className="inline-block border-y-4 border-y-transparent border-l-6 border-l-gold-bright ml-0.5" />
                      <span>PLAY</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={toggleMute}
                  className="flex items-center gap-2 rounded-pill border border-gold/60 bg-black/60 px-3.5 py-1.5 font-display text-[11px] tracking-[0.25em] text-gold-bright backdrop-blur transition-all duration-300 hover:border-gold hover:bg-gold/20"
                  aria-label={isMuted ? "Unmute video audio" : "Mute video audio"}
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={1.6}
                    className="size-3.5"
                    aria-hidden="true"
                  >
                    {isMuted ? (
                      <>
                        <path d="M11 5L6 9H2v6h4l5 4V5z" />
                        <line x1="23" y1="9" x2="17" y2="15" />
                        <line x1="17" y1="9" x2="23" y2="15" />
                      </>
                    ) : (
                      <>
                        <path d="M11 5L6 9H2v6h4l5 4V5z" />
                        <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
                        <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
                      </>
                    )}
                  </svg>
                  <span>{isMuted ? "UNMUTE" : "MUTE"}</span>
                </button>
              </div>
            </div>
          </div>

          {/* ── Below the Video: Narrative Text & CTAs ── */}
          <div className="mt-10 flex max-w-3xl flex-col items-center gap-6">
            <p className="max-w-2xl text-[19px] leading-[1.75] text-ivory-soft italic md:text-[21px] whitespace-pre-line">
              {site.atelier.body}
            </p>

            <div className="mt-2 flex flex-wrap justify-center gap-4">
              <ButtonLink href="#private-viewing" className="px-8 py-4 md:text-[13px] md:tracking-[0.28em]">
                REQUEST A PRIVATE VIEWING
              </ButtonLink>
              <ButtonLink href="/archive" variant="secondary" className="px-8 py-4 md:text-[13px] md:tracking-[0.28em]">
                EXPLORE THE ARCHIVE
              </ButtonLink>
            </div>
          </div>
        </div>
      </section>

      {/* ── Section 2: Private Viewing Appointment Booking ── */}
      <section id="private-viewing" className="relative border-t border-line px-5 py-20 md:py-24 scroll-mt-20">
        <div className="mx-auto flex max-w-4xl flex-col items-center text-center">
          <Eyebrow>EXCLUSIVE ACCESS</Eyebrow>
          <h2 className="km-gold-text mt-2 font-display text-[clamp(32px,3.8vw,52px)] font-bold tracking-[0.03em]">
            {site.atelier.viewingTitle}
          </h2>
          <p className="mt-2 text-[19px] text-ivory-soft italic md:text-[21px]">
            {site.atelier.viewingSubtitle}
          </p>

          <div className="mt-10 w-full max-w-2xl text-left">
            <AnimatePresence mode="wait" initial={false}>
              {sent ? (
                <motion.div
                  key="sent"
                  role="status"
                  initial={{ opacity: 0, y: reduce ? 0 : 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.9, ease: [0.2, 0.7, 0.1, 1] }}
                  className="flex flex-col items-center gap-5 border border-gold/40 bg-surface/40 p-8 text-center md:p-12"
                >
                  <Diamond filled className="size-2.5 text-gold" />
                  <p className="km-gold-text font-display text-[26px] font-bold tracking-[0.06em] md:text-[32px]">
                    YOUR REQUEST IS RECEIVED
                  </p>
                  <p className="max-w-lg text-[19px] leading-relaxed text-ivory-soft italic">
                    Thank you, {fields.name.trim().split(" ")[0]}. The Maison Harivé atelier will be in touch shortly to arrange your private viewing of {fields.piece}.
                  </p>
                  <button
                    type="button"
                    onClick={() => setSent(false)}
                    className="mt-2 cursor-pointer font-display text-micro tracking-[0.35em] text-gold-bright underline-offset-8 hover:underline"
                  >
                    MAKE ANOTHER REQUEST
                  </button>
                </motion.div>
              ) : (
                <motion.form
                  key="form"
                  noValidate
                  onSubmit={submit}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0, transition: { duration: 0.3 } }}
                  className="border border-gold/30 bg-surface/20 p-6 md:p-10 flex flex-col gap-7"
                >
                  <div className="grid grid-cols-1 gap-x-8 gap-y-7 sm:grid-cols-2">
                    <Field id={`${uid}-name`} label="NAME" error={errors.name}>
                      <input
                        id={`${uid}-name`}
                        className="km-field"
                        placeholder="Your name"
                        autoComplete="name"
                        value={fields.name}
                        onChange={(e) => set("name")(e.target.value)}
                        aria-invalid={!!errors.name}
                        aria-describedby={errors.name ? `${uid}-name-err` : undefined}
                      />
                    </Field>
                    <Field id={`${uid}-contact`} label="PHONE OR EMAIL" error={errors.contact}>
                      <input
                        id={`${uid}-contact`}
                        className="km-field"
                        placeholder="How we reach you"
                        autoComplete="email"
                        value={fields.contact}
                        onChange={(e) => set("contact")(e.target.value)}
                        aria-invalid={!!errors.contact}
                        aria-describedby={errors.contact ? `${uid}-contact-err` : undefined}
                      />
                    </Field>
                    <Field id={`${uid}-date`} label="PREFERRED DATE" error={errors.date}>
                      <input
                        id={`${uid}-date`}
                        type="date"
                        className="km-field"
                        value={fields.date}
                        onChange={(e) => set("date")(e.target.value)}
                        aria-invalid={!!errors.date}
                        aria-describedby={errors.date ? `${uid}-date-err` : undefined}
                      />
                    </Field>
                    <Field id={`${uid}-piece`} label="PIECE OF INTEREST">
                      <select
                        id={`${uid}-piece`}
                        className="km-field cursor-pointer"
                        value={fields.piece}
                        onChange={(e) => set("piece")(e.target.value)}
                      >
                        {products.map((p) => (
                          <option key={p.id} value={p.name}>
                            {p.name}
                          </option>
                        ))}
                        <option value="Bespoke New Chapter Creation">Bespoke New Chapter Creation</option>
                      </select>
                    </Field>
                  </div>
                  <div className="flex flex-col items-center gap-3 pt-2">
                    {submitError && (
                      <p role="alert" className="text-center font-display text-xs tracking-[0.2em] text-rose-300 uppercase">
                        {submitError}
                      </p>
                    )}
                    <Button
                      type="submit"
                      disabled={submitting}
                      className="w-full sm:w-auto px-10 py-[17px] md:text-[13px] md:tracking-[0.28em]"
                    >
                      {submitting ? "DISPATCHING REQUEST..." : "REQUEST A PRIVATE VIEWING"}
                    </Button>
                  </div>
                </motion.form>
              )}
            </AnimatePresence>

            <div className="mt-10 flex flex-wrap items-center justify-between gap-6 border-t border-line pt-6 text-[16px] text-ivory-soft md:text-[18px]">
              <div className="flex flex-col">
                <span className="font-display text-[11px] tracking-[0.25em] text-gold uppercase">Locations</span>
                <span>{site.atelier.address}</span>
              </div>
              <div className="flex flex-col sm:text-right">
                <span className="font-display text-[11px] tracking-[0.25em] text-gold uppercase">Access</span>
                <span>{site.atelier.hours}</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

function Field({
  id,
  label,
  error,
  children,
}: {
  id: string;
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="font-display text-micro tracking-[0.3em] text-gold">
        {label}
      </label>
      {children}
      {error && (
        <p id={`${id}-err`} className="text-[16px] text-gold-bright italic">
          {error}
        </p>
      )}
    </div>
  );
}
