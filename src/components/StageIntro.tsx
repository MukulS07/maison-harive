"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";
import { site } from "@/content/site";

/*
 * Light values for this scene come straight from spec §1.0 (stage-lamp whites and the gold
 * bloom). They are light, not palette colours, so they live here rather than in tokens.css.
 */
const LAMP = "#fff6e0";
const LAMP_CORE = "#fffaf0";
const DUST = "#f3dfae";
const FLASH =
  "radial-gradient(circle at 50% 50%, #fff6dc 0%, #efcf8a 28%, #8a5a1c 62%, var(--km-black-deep) 100%)";

const ROYAL = [0.2, 0.7, 0.1, 1] as const;
const LOCK_MS = 900;
const FLASH_MS = 850;

/** 0: darkness and spotlights · 1: the words rise · 2: gold flash, then Home. */
type Scene = 0 | 1 | 2;

/** Deterministic dust so server and client render the same particles. */
const dust = (() => {
  let seed = 7;
  const rnd = () => {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
  };
  return Array.from({ length: 40 }, () => ({
    x: rnd() * 100,
    y: 13 + rnd() * 85,
    size: 1 + rnd() * 2.4,
    duration: 8 + rnd() * 10,
    delay: -rnd() * 16,
  }));
})();

type StageIntroProps = {
  /** Called when the flash starts to clear, so Home can begin its own entrance. */
  onReveal: () => void;
  /** Called once the overlay has fully faded away. */
  onDone: () => void;
};

/**
 * The cinematic intro that plays in front of Home (spec §1.0): spotlights and gold dust,
 * the logo, two rising lines, then a warm gold flash that dissolves into the page.
 * Scroll, swipe, arrow keys or the scroll cue move forward; SKIP INTRO jumps straight to Home.
 */
export function StageIntro({ onReveal, onDone }: StageIntroProps) {
  const reduce = useReducedMotion() ?? false;
  const [scene, setScene] = useState<Scene>(0);
  const [leaving, setLeaving] = useState(false);
  const lockedUntil = useRef(0);
  const touchY = useRef<number | null>(null);
  const cueRef = useRef<HTMLButtonElement>(null);

  const left = useRef(false);
  const leave = useCallback(() => {
    if (left.current) return;
    left.current = true;
    setLeaving(true);
    onReveal();
  }, [onReveal]);

  const step = useCallback(
    (dir: 1 | -1) => {
      const now = Date.now();
      if (now < lockedUntil.current || leaving) return;
      lockedUntil.current = now + LOCK_MS;
      setScene((s) => (dir === 1 ? (Math.min(2, s + 1) as Scene) : s === 1 ? 0 : s));
    },
    [leaving],
  );

  // The flash holds for a moment, then the overlay dissolves into Home.
  useEffect(() => {
    if (scene !== 2) return;
    const t = window.setTimeout(leave, FLASH_MS);
    return () => window.clearTimeout(t);
  }, [scene, leave]);

  // Wheel, touch and keyboard all drive the scenes. Page scroll is locked while the intro plays.
  useEffect(() => {
    const root = document.documentElement;
    const prevOverflow = root.style.overflow;
    root.style.overflow = "hidden";
    cueRef.current?.focus({ preventScroll: true });

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      if (e.deltaY > 8) step(1);
      else if (e.deltaY < -8) step(-1);
    };
    const onTouchStart = (e: TouchEvent) => {
      touchY.current = e.touches[0]?.clientY ?? null;
    };
    const onTouchEnd = (e: TouchEvent) => {
      if (touchY.current == null) return;
      const dy = touchY.current - (e.changedTouches[0]?.clientY ?? touchY.current);
      touchY.current = null;
      if (dy > 40) step(1);
      else if (dy < -40) step(-1);
    };
    const onKey = (e: KeyboardEvent) => {
      if (["ArrowDown", "PageDown", " "].includes(e.key)) {
        e.preventDefault();
        step(1);
      } else if (["ArrowUp", "PageUp"].includes(e.key)) {
        e.preventDefault();
        step(-1);
      } else if (e.key === "Escape") {
        leave();
      }
    };

    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchend", onTouchEnd, { passive: true });
    window.addEventListener("keydown", onKey);
    return () => {
      root.style.overflow = prevOverflow;
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchend", onTouchEnd);
      window.removeEventListener("keydown", onKey);
    };
  }, [step, leave]);

  const fade = { duration: 1.1, ease: "easeInOut" as const };
  const move = { duration: 1.3, ease: ROYAL };

  return (
    <AnimatePresence onExitComplete={onDone}>
      {!leaving && (
        <motion.div
          key="stage"
          role="dialog"
          aria-modal="true"
          aria-label={`${site.brand}: introduction`}
          className="fixed inset-0 z-50 overflow-hidden bg-black-deep select-none"
          exit={{ opacity: 0, transition: { duration: 1.1, ease: "easeInOut" } }}
        >
          {/* Four stage lamps shining down. */}
          <motion.svg
            aria-hidden="true"
            viewBox="0 0 1440 900"
            preserveAspectRatio="xMidYMin slice"
            className="absolute inset-0 h-full w-full"
            animate={{ opacity: [1, 0.45, 0.2][scene] }}
            transition={fade}
          >
            <defs>
              <linearGradient id="km-beam" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={LAMP} stopOpacity="0.55" />
                <stop offset="75%" stopColor={LAMP} stopOpacity="0" />
              </linearGradient>
              <filter id="km-beam-blur" x="-50%" y="-10%" width="200%" height="130%">
                <feGaussianBlur stdDeviation="18" />
              </filter>
              <filter id="km-lamp-soft">
                <feGaussianBlur stdDeviation="30" />
              </filter>
            </defs>
            <g className="km-flicker">
              <g filter="url(#km-beam-blur)" fill="url(#km-beam)">
                <polygon points="450,-10 510,-10 526,700 146,700" />
                <polygon points="610,-10 670,-10 782,700 402,700" />
                <polygon points="770,-10 830,-10 1038,700 658,700" />
                <polygon points="930,-10 990,-10 1294,700 914,700" />
              </g>
              <g filter="url(#km-lamp-soft)" fill={LAMP_CORE}>
                {[480, 640, 800, 960].map((cx) => (
                  <ellipse key={cx} cx={cx} cy="0" rx="70" ry="34" />
                ))}
              </g>
            </g>
          </motion.svg>

          {/* Gold dust drifting up through the light. */}
          <div aria-hidden="true" className="absolute inset-0">
            {dust.map((d, i) => (
              <span
                key={i}
                className="km-dust absolute rounded-full"
                style={{
                  left: `${d.x}%`,
                  top: `${d.y}%`,
                  width: d.size,
                  height: d.size,
                  background: DUST,
                  animationDuration: `${d.duration}s`,
                  animationDelay: `${d.delay}s`,
                }}
              />
            ))}
          </div>

          {/* Scene 1: the house's name. */}
          <motion.div
            className="absolute inset-x-0 top-[37.8%] flex flex-col items-center gap-3 px-5 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: scene === 0 ? 1 : 0 }}
            transition={fade}
          >
            <p className="km-gold-text pl-[0.14em] font-display text-[clamp(26px,4.2vw,60px)] leading-none font-bold tracking-[0.14em]">
              {site.logo}
            </p>
            <p className="pl-[0.55em] font-display text-[12px] tracking-[0.55em] text-ivory md:text-base">
              {site.intro.subline}
            </p>
          </motion.div>

          {/* Scene 2: the words rise. */}
          <motion.div
            className="absolute inset-x-0 top-[45.5%] flex flex-col items-center gap-3.5 px-6 text-center font-display text-[12px] leading-relaxed tracking-[0.3em] text-[color-mix(in_srgb,var(--km-gold)_50%,var(--km-gold-bright))] md:text-[15px] md:tracking-[0.5em]"
            initial={false}
            animate={{ opacity: scene === 1 ? 1 : 0, y: scene === 1 || reduce ? 0 : 26 }}
            transition={{ opacity: fade, y: move }}
            aria-live="polite"
          >
            {scene >= 1 && site.intro.words.map((line) => <p key={line}>{line}</p>)}
          </motion.div>

          {/* Scroll cue: also a real button that advances the scene. */}
          <motion.button
            ref={cueRef}
            type="button"
            onClick={() => step(1)}
            className="absolute bottom-[4.5%] left-1/2 flex -translate-x-1/2 cursor-pointer flex-col items-center gap-3 px-6 py-2 font-display text-micro tracking-[0.4em] text-ivory-soft"
            animate={{ opacity: scene <= 1 ? 1 : 0 }}
            transition={fade}
            style={{ pointerEvents: scene <= 1 ? "auto" : "none" }}
          >
            <span className="pl-[0.4em]">{scene === 0 ? site.intro.cueStart : site.intro.cue}</span>
            <span aria-hidden="true" className="relative h-11 w-px bg-gold/35">
              <span className="km-drip absolute -left-0.5 top-0 size-[5px] rounded-full bg-gold-bright" />
            </span>
          </motion.button>

          <button
            type="button"
            onClick={leave}
            className="absolute right-4 bottom-[calc(1rem+env(safe-area-inset-bottom))] flex min-h-[44px] min-w-[44px] cursor-pointer items-center justify-center px-3 py-2 font-display text-micro tracking-[0.3em] text-muted transition-colors duration-300 hover:text-gold-bright sm:right-6 md:right-14 md:bottom-8"
          >
            {site.intro.skip}
          </button>

          {/* Scene 3: the warm gold bloom that opens onto Home. */}
          <motion.div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0"
            style={{ background: FLASH }}
            initial={{ opacity: 0 }}
            animate={{ opacity: scene === 2 ? 1 : 0 }}
            transition={{ duration: 0.55, ease: "easeOut" }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
