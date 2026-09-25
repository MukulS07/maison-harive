"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useCallback, useEffect, useId, useLayoutEffect, useRef, useState, type ReactNode } from "react";

type VideoTextHeroProps = {
  /** Small italic line above the word, e.g. "Enter the". */
  lead: string;
  /** The giant word filled with video, e.g. "MAISON". */
  word: string;
  /** What a screen reader hears for the whole heading, e.g. "Enter the Maison". */
  label: string;
  tagline: string;
  /** Call to action under the tagline. */
  action: ReactNode;
  /** Header (and anything else) that sits on top of the film. */
  header: ReactNode;
  /** Video URL, or null to show the animated gold fallback. */
  videoSrc: string | null;
  /** Hold the load animation until this is true (e.g. while the intro plays). */
  play?: boolean;
};

type ClipText = { x: number; y: number; size: number; spacing: number; family: string };

const EASE = [0.2, 0.7, 0.1, 1] as const;

/**
 * Full-bleed looping film with the headline word filled by a brighter copy of the same film
 * (spec §1.3).
 *
 * Layer 1 is the film under a scrim. Layer 2 is a second <video>, synced to the first,
 * brightened, and clipped by an inline SVG <clipPath> holding the word as <text>. The clip text
 * is positioned from the real, visible headline (its left edge and baseline, font size and
 * tracking), so it stays aligned at every screen size and through the letter-spacing intro.
 * Until the film is playing, or when there is no film, the word shows the moving-gold
 * `.km-gold-text` fill instead.
 */
export function VideoTextHero({
  lead,
  word,
  label,
  tagline,
  action,
  header,
  videoSrc,
  play = true,
}: VideoTextHeroProps) {
  const reduce = useReducedMotion() ?? false;
  const clipId = `km-clip-${useId().replace(/:/g, "")}`;

  const sectionRef = useRef<HTMLElement>(null);
  const wordRef = useRef<HTMLSpanElement>(null);
  const baselineRef = useRef<HTMLSpanElement>(null);
  const bgRef = useRef<HTMLVideoElement>(null);
  const fillRef = useRef<HTMLVideoElement>(null);

  const [clip, setClip] = useState<ClipText | null>(null);
  const [videoReady, setVideoReady] = useState(false);

  /** Copy the visible word's geometry into the SVG clip text. */
  const measure = useCallback(() => {
    const section = sectionRef.current;
    const wordEl = wordRef.current;
    const base = baselineRef.current;
    if (!section || !wordEl || !base) return;
    const s = section.getBoundingClientRect();
    const w = wordEl.getBoundingClientRect();
    const cs = getComputedStyle(wordEl);
    setClip({
      x: w.left - s.left,
      y: base.getBoundingClientRect().top - s.top,
      size: parseFloat(cs.fontSize),
      spacing: parseFloat(cs.letterSpacing) || 0,
      family: cs.fontFamily,
    });
  }, []);

  useLayoutEffect(() => {
    if (!videoSrc) return;
    measure();
    const ro = new ResizeObserver(measure);
    if (sectionRef.current) ro.observe(sectionRef.current);
    void document.fonts?.ready.then(measure);
    return () => ro.disconnect();
  }, [measure, videoSrc]);

  // Keep the bright copy locked to the background film.
  useEffect(() => {
    const bg = bgRef.current;
    const fill = fillRef.current;
    if (!bg || !fill) return;

    const sync = () => {
      if (Math.abs(fill.currentTime - bg.currentTime) > 0.08) fill.currentTime = bg.currentTime;
    };
    const onPlaying = () => {
      sync();
      void fill.play().catch(() => {});
      setVideoReady(true);
    };
    const onPause = () => fill.pause();
    const onLoaded = () => {
      // Reduced motion: hold the first frame, still visible inside the letters.
      if (reduce) {
        sync();
        setVideoReady(true);
      }
    };

    bg.addEventListener("playing", onPlaying);
    bg.addEventListener("pause", onPause);
    bg.addEventListener("seeked", sync);
    bg.addEventListener("loadeddata", onLoaded);
    const timer = window.setInterval(sync, 3000);

    if (reduce) {
      bg.pause();
      fill.pause();
      if (bg.readyState >= 2) onLoaded();
    } else if (bg.paused) {
      void bg.play().catch(() => {});
    } else {
      // Autoplay can start before hydration, so the "playing" event may already have fired.
      onPlaying();
    }

    return () => {
      bg.removeEventListener("playing", onPlaying);
      bg.removeEventListener("pause", onPause);
      bg.removeEventListener("seeked", sync);
      bg.removeEventListener("loadeddata", onLoaded);
      window.clearInterval(timer);
    };
  }, [reduce, videoSrc]);

  const state = play ? "show" : "hidden";

  const rise = (i: number, duration = 0.6) => ({
    initial: "hidden",
    animate: state,
    variants: {
      hidden: reduce ? { opacity: 0 } : { opacity: 0, y: 12 },
      show: { opacity: 1, y: 0, transition: { duration, delay: 0.15 * i, ease: EASE } },
    },
  });

  const videoClass = "absolute inset-0 h-full w-full object-cover";
  const filmReady = Boolean(videoSrc && videoReady && clip);

  return (
    <section ref={sectionRef} className="relative isolate flex min-h-dvh flex-col overflow-hidden">
      {/* Layer 1: the film (or the gold fallback), dimmed. */}
      <div aria-hidden="true" className="absolute inset-0 -z-10">
        {videoSrc ? (
          <video
            ref={bgRef}
            src={videoSrc}
            className={videoClass}
            muted
            playsInline
            loop={!reduce}
            autoPlay={!reduce}
            preload="auto"
          />
        ) : (
          <div className="km-gold-motion absolute inset-0" />
        )}
        <div className="absolute inset-0 bg-scrim" />
      </div>

      {/* Layer 2: the bright copy of the film, seen only through the letters. */}
      {videoSrc && (
        <>
          <svg aria-hidden="true" width="0" height="0" className="absolute">
            <defs>
              <clipPath id={clipId} clipPathUnits="userSpaceOnUse">
                {clip && (
                  <text
                    x={clip.x}
                    y={clip.y}
                    fontFamily={clip.family}
                    fontWeight={700}
                    fontSize={clip.size}
                    style={{ letterSpacing: `${clip.spacing}px` }}
                  >
                    {word}
                  </text>
                )}
              </clipPath>
            </defs>
          </svg>
          <video
            ref={fillRef}
            src={videoSrc}
            aria-hidden="true"
            className={`${videoClass} pointer-events-none -z-10 brightness-[1.35] contrast-[1.1] saturate-[1.2] transition-opacity duration-700 ${filmReady ? "opacity-100" : "opacity-0"}`}
            style={{ clipPath: `url(#${clipId})` }}
            muted
            playsInline
            loop={!reduce}
            preload="auto"
          />
        </>
      )}

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: play ? 1 : 0 }}
        transition={{ duration: 0.4, ease: EASE }}
      >
        {header}
      </motion.div>

      <div className="flex flex-1 flex-col items-center px-5 pt-[clamp(64px,14vh,122px)] pb-16 text-center">
        <h1 className="flex flex-col items-center">
          <span className="sr-only">{label}</span>
          <motion.span
            {...rise(1)}
            aria-hidden="true"
            className="block text-[clamp(38px,4.45vw,64px)] leading-tight tracking-[0.02em] text-ivory italic"
          >
            {lead}
          </motion.span>
          <motion.span
            aria-hidden="true"
            initial="hidden"
            animate={state}
            variants={{
              hidden: reduce ? { opacity: 0 } : { opacity: 0, letterSpacing: "0.2em" },
              show: {
                opacity: 1,
                letterSpacing: "0.06em",
                transition: { duration: 0.9, delay: 0.3, ease: EASE },
              },
            }}
            onUpdate={videoSrc ? measure : undefined}
            className="-mt-[0.05em] block pl-[0.06em] font-display text-[clamp(60px,18.4vw,220px)] leading-[0.95] font-bold whitespace-nowrap"
          >
            <span
              ref={wordRef}
              className={`km-gold-text transition-opacity duration-700 ${filmReady ? "opacity-0" : "opacity-100"}`}
            >
              {word}
              <span ref={baselineRef} className="inline-block h-0 w-0 align-baseline" />
            </span>
          </motion.span>
        </h1>
        <motion.p
          {...rise(3)}
          className="mt-3.5 font-display text-[11px] tracking-[0.42em] text-gold uppercase md:mt-[18px] md:text-sm md:tracking-wide"
        >
          {tagline}
        </motion.p>
        <motion.div {...rise(4)} className="mt-10 md:mt-14">
          {action}
        </motion.div>
      </div>
    </section>
  );
}
