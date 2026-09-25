"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useId, useState, type FormEvent } from "react";
import { featuredProducts } from "@/content/products";
import { site } from "@/content/site";
import { Button, Diamond, Eyebrow, GoldBackdrop } from "../ui";

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

/** Chamber III, opened (spec §3.3): the private-viewing request. Front end only for now. */
export function AtelierChamber() {
  const c = site.chambers.atelier;
  const reduce = useReducedMotion() ?? false;
  const uid = useId();
  const [fields, setFields] = useState<Fields>({ name: "", contact: "", date: "", piece: featuredProducts[0].name });
  const [errors, setErrors] = useState<Errors>({});
  const [sent, setSent] = useState(false);

  const set = (k: keyof Fields) => (v: string) => {
    setFields((f) => ({ ...f, [k]: v }));
    if (errors[k]) setErrors((e) => ({ ...e, [k]: undefined }));
  };

  const submit = (ev: FormEvent<HTMLFormElement>) => {
    ev.preventDefault();
    const e = validate(fields);
    setErrors(e);
    const first = (Object.keys(e) as (keyof Fields)[])[0];
    if (first) {
      document.getElementById(`${uid}-${first}`)?.focus();
      return;
    }
    setSent(true);
  };

  return (
    <section className="relative grid md:min-h-[calc(100dvh-var(--km-header-h))] lg:grid-cols-[minmax(0,640fr)_minmax(0,800fr)]">
      {/* Atelier film (placeholder): gold motion under a light scrim. */}
      <div className="relative min-h-[300px] overflow-hidden border-b border-gold lg:border-r lg:border-b-0">
        <GoldBackdrop scrim={0.5} />
        <span className="absolute inset-x-0 bottom-8 text-center font-display text-xs tracking-[0.25em] text-ivory-soft">
          {site.atelier.footage}
        </span>
      </div>

      <div className="relative flex flex-col justify-center px-5 py-14 md:px-12 lg:py-16 lg:pr-[120px] lg:pl-[100px]">
        {/* The gold edge this chamber slid in from. */}
        <span aria-hidden="true" className="absolute inset-y-0 right-0 hidden w-px bg-gold lg:block" />
        <div className="flex max-w-[580px] flex-col gap-3.5">
          <Eyebrow>{c.eyebrow}</Eyebrow>
          <h1 className="km-gold-text font-display text-[clamp(52px,6vw,88px)] leading-none font-bold">{c.title}</h1>
          <p className="text-[clamp(22px,2vw,28px)] text-ivory italic">{site.atelier.lead}</p>

          <AnimatePresence mode="wait" initial={false}>
            {sent ? (
              <motion.div
                key="sent"
                role="status"
                initial={{ opacity: 0, y: reduce ? 0 : 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.9, ease: [0.2, 0.7, 0.1, 1] }}
                className="mt-8 flex flex-col items-start gap-5 border-y border-line py-10"
              >
                <Diamond filled className="size-2.5" />
                <p className="km-gold-text font-display text-[28px] font-bold tracking-[0.06em] md:text-[34px]">
                  YOUR REQUEST IS RECEIVED
                </p>
                <p className="text-[20px] leading-relaxed text-ivory-soft italic">
                  Thank you, {fields.name.trim().split(" ")[0]}. The atelier will be in touch to arrange your private
                  viewing of {fields.piece}.
                </p>
                <button
                  type="button"
                  onClick={() => setSent(false)}
                  className="cursor-pointer font-display text-micro tracking-[0.35em] text-gold-bright underline-offset-8 hover:underline"
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
                className="mt-[30px] flex flex-col gap-[30px]"
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
                      {featuredProducts.map((p) => (
                        <option key={p.id} value={p.name}>
                          {p.name}
                        </option>
                      ))}
                    </select>
                  </Field>
                </div>
                <div>
                  <Button type="submit" className="px-[30px] py-[17px] md:text-[13px] md:tracking-[0.28em]">
                    REQUEST A PRIVATE VIEWING
                  </Button>
                </div>
              </motion.form>
            )}
          </AnimatePresence>

          <div className="mt-10 flex flex-wrap gap-x-12 gap-y-2 border-t border-line pt-6 text-[18px] text-ivory-soft">
            <span>{site.atelier.address}</span>
            <span>{site.atelier.hours}</span>
          </div>
        </div>
      </div>
    </section>
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
