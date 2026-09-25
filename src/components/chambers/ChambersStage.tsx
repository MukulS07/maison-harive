"use client";

import {
  animate,
  AnimatePresence,
  motion,
  useMotionValue,
  useReducedMotion,
  useTransform,
  type AnimationPlaybackControls,
  type MotionValue,
} from "framer-motion";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useCallback, useEffect, useLayoutEffect, useRef, useState, type ComponentType } from "react";
import { chamberOrder, site, type ChamberId } from "@/content/site";
import { BackButton } from "../BackButton";
import { ArrowDown, ArrowLeft, ArrowRight } from "../icons";
import { HeaderEyebrow, Logo, SiteHeader } from "../SiteHeader";
import { GoldBackdrop, Numeral } from "../ui";
import { AtelierChamber } from "./AtelierChamber";
import { CollectionChamber } from "./CollectionChamber";
import { LegacyChamber } from "./LegacyChamber";

const DETAILS: Record<ChamberId, ComponentType> = {
  legacy: LegacyChamber,
  collection: CollectionChamber,
  atelier: AtelierChamber,
};

const ROYAL = [0.2, 0.7, 0.1, 1] as const;
const SLIDE_S = 1.1; // --km-dur-slide
const SCRIM = [0.76, 0.58, 0.76];

type Axis = "x" | "y";
type Track = { pos: number[]; size: number[]; content: number[]; strip: number[]; fade: number[] };

/**
 * Keyframes (start → middle → end) for every panel when chamber `c` opens along a track of
 * length L. Side chambers grow from their own edge while the other two are squeezed into
 * strips and pushed off; the middle chamber grows both ways while its neighbours slip out.
 */
function openTracks(c: ChamberId, L: number, S: number): Track[] {
  const t = L / 3;
  const squeezed = (pos: number[]): Track => ({
    pos,
    size: [t, S, S],
    content: [1, 0, 0],
    strip: [0, 1, 1],
    fade: [1, 1, 1],
  });
  const opening = (pos: number[], size: number[]): Track => ({
    pos,
    size,
    content: [1, 0, 0],
    strip: [0, 0, 0],
    fade: [1, 1, 1],
  });

  if (c === "legacy")
    return [
      opening([0, 0, 0], [t, L - 2 * S, L]),
      squeezed([t, L - 2 * S, L]),
      squeezed([2 * t, L - S, L + S]),
    ];
  if (c === "atelier")
    return [
      squeezed([0, 0, -2 * S]),
      squeezed([t, S, -S]),
      opening([2 * t, 2 * S, 0], [t, L - 2 * S, L]),
    ];
  const slipOut = (pos: number[]): Track => ({
    pos,
    size: [t, t, t],
    content: [1, 0.4, 0],
    strip: [0, 0, 0],
    fade: [1, 0.4, 0],
  });
  return [slipOut([0, -t / 2, -t]), opening([t, t / 2, 0], [t, 2 * t, L]), slipOut([2 * t, 2.5 * t, L])];
}

const TIMES = [0, 0.55, 1];

/** Piecewise-linear value of `keys` (placed at `times`) at progress p. */
function interpAt(keys: number[], times: number[], p: number) {
  if (p <= times[0]) return keys[0];
  for (let i = 1; i < times.length; i++) {
    if (p <= times[i]) {
      const k = (p - times[i - 1]) / (times[i] - times[i - 1]);
      return keys[i - 1] + (keys[i] - keys[i - 1]) * k;
    }
  }
  return keys[keys.length - 1];
}

const interp = (keys: number[], p: number) => interpAt(keys, TIMES, p);

function chamberFromPath(path: string): ChamberId | null {
  const seg = path.split("/")[2] as ChamberId | undefined;
  return seg && chamberOrder.includes(seg) ? seg : null;
}

type PanelValues = {
  pos: MotionValue<number>;
  size: MotionValue<number>;
  content: MotionValue<number>;
  strip: MotionValue<number>;
  fade: MotionValue<number>;
};

function usePanelValues(): PanelValues {
  return {
    pos: useMotionValue(0),
    size: useMotionValue(0),
    content: useMotionValue(1),
    strip: useMotionValue(0),
    fade: useMotionValue(1),
  };
}

/**
 * Page 2 (spec §2). The three chambers stay mounted; the URL (/chambers/[chamber]) decides
 * which one is open. Opening grows that panel from its own edge (a glowing gold edge with
 * light-streaks trailing behind it) and reveals the chamber's page inside the growing panel;
 * the back button runs the same motion in reverse. On phones the panels stack and open vertically.
 */
export function ChambersStage() {
  const pathname = usePathname();
  const router = useRouter();
  const reduce = useReducedMotion() ?? false;
  const open = chamberFromPath(pathname);

  const trackRef = useRef<HTMLDivElement>(null);
  const [axis, setAxis] = useState<Axis>("x");
  const [L, setL] = useState(0);
  // `shown` is the chamber whose page is on screen; it outlives `open` while the panel closes.
  const [shown, setShown] = useState<ChamberId | null>(open);
  const [settled, setSettled] = useState(true);
  const [moving, setMoving] = useState<ChamberId | null>(null);
  const prevOpen = useRef<ChamberId | null>(open);
  const running = useRef<AnimationPlaybackControls | null>(null);

  const panels = [usePanelValues(), usePanelValues(), usePanelValues()];
  const edgeGlow = useMotionValue(0);
  const detailOpacity = useMotionValue(open ? 1 : 0);
  const detailY = useMotionValue(0);

  const S = axis === "x" ? 180 : 56;

  // Measure the track and pick the axis before the first paint.
  useLayoutEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    const mq = window.matchMedia("(min-width: 768px)");
    const update = () => {
      const a: Axis = mq.matches ? "x" : "y";
      setAxis(a);
      setL(a === "x" ? el.clientWidth : el.clientHeight);
    };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    mq.addEventListener("change", update);
    return () => {
      ro.disconnect();
      mq.removeEventListener("change", update);
    };
  }, []);

  /**
   * Place every panel at progress `p` of chamber `c` opening (0 = three closed panels,
   * 1 = fully open). One eased progress value drives everything, so the whole move reads
   * as a single heavy slide rather than a string of separately eased steps.
   */
  const apply = useCallback(
    (c: ChamberId, p: number) => {
      const tracks = openTracks(c, L, S);
      panels.forEach((pv, i) => {
        const tr = tracks[i];
        pv.pos.set(interp(tr.pos, p));
        pv.size.set(interp(tr.size, p));
        pv.content.set(interp(tr.content, p));
        pv.strip.set(interp(tr.strip, p));
        pv.fade.set(interp(tr.fade, p));
      });
      edgeGlow.set(c === "collection" ? 0 : interpAt([0, 1, 1, 0], [0, 0.05, 0.9, 1], p));
      // The chamber's page fades in from 40% of the move (and drops in, for the Collection).
      detailOpacity.set(interpAt([0, 0, 1], [0, 0.4, 1], p));
      detailY.set(c === "collection" ? interpAt([-40, -40, 0], [0, 0.4, 1], p) : 0);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps -- motion values are stable
    [L, S],
  );

  // Keep the geometry right when the window is resized between transitions.
  useLayoutEffect(() => {
    if (!L || running.current) return;
    apply(open ?? "legacy", open ? 1 : 0);
  }, [L, S, apply]); // eslint-disable-line react-hooks/exhaustive-deps

  // Route change → run the open / close / switch transition. This effect drives imperative
  // animations from the URL, so it has to flip the "what is on screen" state as they start.
  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    const from = prevOpen.current;
    const to = open;
    prevOpen.current = to;
    if (from === to || !L) return;

    running.current?.stop();
    running.current = null;
    window.scrollTo({ top: 0 });

    const play = (
      fromP: number,
      toP: number,
      duration: number,
      onUpdate: (p: number) => void,
      done: () => void,
    ) => {
      const ctrl = animate(fromP, toP, { duration, ease: ROYAL, onUpdate });
      running.current = ctrl;
      void ctrl.then(() => {
        if (running.current !== ctrl) return;
        running.current = null;
        setMoving(null);
        done();
      });
    };

    if (reduce) {
      // Reduced motion: no sliding. The page simply cross-fades in or out.
      setSettled(true);
      if (to) {
        apply(to, 1);
        setShown(to);
        play(0, 1, 0.6, (o) => detailOpacity.set(o), () => {});
      } else {
        play(1, 0, 0.5, (o) => detailOpacity.set(o), () => {
          apply(from!, 0);
          setShown(null);
        });
      }
      return;
    }

    const chamber = to ?? from!;
    setSettled(false);
    setShown(chamber);
    setMoving(chamber === "collection" ? null : chamber);
    if (to) {
      // Opening (from the stage, or straight across from another chamber).
      apply(to, 0);
      play(0, 1, SLIDE_S, (p) => apply(to, p), () => setSettled(true));
    } else {
      play(1, 0, SLIDE_S, (p) => apply(chamber, p), () => {
        setShown(null);
        setSettled(true);
      });
    }
  }, [open, L]); // eslint-disable-line react-hooks/exhaustive-deps
  /* eslint-enable react-hooks/set-state-in-effect */

  // Clip the chamber's page to the growing panel while it moves.
  const clips = panels.map((p) =>
    // eslint-disable-next-line react-hooks/rules-of-hooks -- fixed-length list, same order every render
    useTransform([p.pos, p.size], ([pos, size]: number[]) =>
      axis === "x"
        ? `inset(0px calc(100% - ${pos + size}px) 0px ${pos}px)`
        : `inset(${pos}px 0px calc(100% - ${pos + size}px) 0px)`,
    ),
  );
  const edgeLegacy = useTransform([panels[0].pos, panels[0].size], ([p, s]: number[]) => p + s);
  const edgeAtelier = panels[2].pos;

  const Detail = shown ? DETAILS[shown] : null;
  const shownIndex = shown ? chamberOrder.indexOf(shown) : -1;
  const measured = L > 0;
  const stageHidden = Boolean(shown && settled && open);

  return (
    <div className="relative min-h-dvh bg-black">
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={open ?? "stage"}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
          className="relative z-30 bg-black"
        >
          {open ? <DetailHeader chamber={open} /> : <StageHeader />}
        </motion.div>
      </AnimatePresence>

      <div className="relative">
        {/* The three chambers. */}
        <div
          ref={trackRef}
          aria-hidden={stageHidden}
          className={`absolute inset-x-0 top-0 h-[max(540px,calc(100dvh-64px))] overflow-hidden md:h-[max(600px,calc(100dvh-var(--km-header-h)))] ${stageHidden ? "invisible" : ""}`}
          inert={Boolean(open)}
        >
          {chamberOrder.map((id, i) => (
            <Panel
              key={id}
              id={id}
              index={i}
              axis={axis}
              measured={measured}
              values={panels[i]}
              onOpen={() => router.push(site.chambers[id].href)}
            />
          ))}

          {/* Gold dividers with a diamond at their midpoint. */}
          {[panels[1].pos, panels[2].pos].map((pos, i) => (
            <Divider key={i} pos={pos} axis={axis} measured={measured} index={i + 1} hidden={Boolean(shown)} />
          ))}

          {moving === "legacy" && <MovingEdge pos={edgeLegacy} glow={edgeGlow} axis={axis} trail="before" />}
          {moving === "atelier" && <MovingEdge pos={edgeAtelier} glow={edgeGlow} axis={axis} trail="after" />}
        </div>

        {/* The opened chamber's page, revealed inside the growing panel. */}
        {Detail ? (
          <motion.div
            className="relative z-10 min-h-[calc(100dvh-64px)] bg-black md:min-h-[calc(100dvh-var(--km-header-h))]"
            style={{
              opacity: detailOpacity,
              y: detailY,
              clipPath: settled ? "none" : clips[shownIndex],
            }}
          >
            <Detail />
          </motion.div>
        ) : (
          <div aria-hidden="true" className="h-[max(540px,calc(100dvh-64px))] md:h-[max(600px,calc(100dvh-var(--km-header-h)))]" />
        )}
      </div>
    </div>
  );
}

function StageHeader() {
  return (
    <SiteHeader
      left={<BackButton href="/" label="The Gate" bare />}
      center={<Logo />}
      right={
        <div className="flex items-center gap-3">
          <Link
            href="/concierge"
            className="hidden items-center gap-1.5 rounded-pill border border-gold/40 px-3.5 py-2 font-display text-[11px] tracking-[0.25em] text-gold-bright uppercase transition-all duration-300 hover:border-gold hover:bg-gold/15 md:inline-flex"
          >
            THE CONCIERGE
          </Link>
          <Link
            href="/sisters"
            className="group flex items-center gap-2.5 rounded-pill border border-gold bg-gold/12 px-4 py-2.5 text-[15px] whitespace-nowrap text-gold-bright italic transition-colors duration-300 hover:bg-gold/20 md:px-[18px] md:text-nav"
          >
            <span className="md:hidden">The Sisters</span>
            <span className="hidden md:inline">The Women Behind the Door</span>
            <ArrowRight size={16} className="transition-transform duration-300 ease-royal group-hover:translate-x-0.5" />
          </Link>
        </div>
      }
    />
  );
}

function DetailHeader({ chamber }: { chamber: ChamberId }) {
  return (
    <SiteHeader
      left={<BackButton href="/chambers" label="The Chambers" />}
      center={<HeaderEyebrow>{site.chambers[chamber].headerLabel}</HeaderEyebrow>}
      centerOnMobile
      right={
        chamber === "atelier" ? (
          <Logo className="hidden md:inline" />
        ) : (
          <Link
            href={site.privateViewing.href}
            className="hidden text-nav whitespace-nowrap text-gold-bright italic transition-colors duration-300 hover:text-gold-pale md:inline"
          >
            {site.privateViewing.label}
          </Link>
        )
      }
    />
  );
}

/** Where each panel sits before it has been measured (server render / first paint). */
const FALLBACK = [
  "max-md:top-0 md:left-0",
  "max-md:top-1/3 md:left-1/3",
  "max-md:top-2/3 md:left-2/3",
];

function Panel({
  id,
  index,
  axis,
  measured,
  values,
  onOpen,
}: {
  id: ChamberId;
  index: number;
  axis: Axis;
  measured: boolean;
  values: PanelValues;
  onOpen: () => void;
}) {
  const c = site.chambers[id];
  const featured = id === "collection";
  const stripOpacity = useTransform(values.strip, (s) => s * 0.82);
  const style = measured
    ? axis === "x"
      ? { left: values.pos, width: values.size, top: 0, bottom: 0, opacity: values.fade }
      : { top: values.pos, height: values.size, left: 0, right: 0, opacity: values.fade }
    : undefined;

  const arrow =
    axis === "y" ? (
      id === "atelier" ? (
        <ArrowDown size={20} className="rotate-180" />
      ) : (
        <ArrowDown size={20} />
      )
    ) : id === "legacy" ? (
      <ArrowRight size={22} />
    ) : id === "atelier" ? (
      <ArrowLeft size={22} />
    ) : (
      <ArrowDown size={22} strokeWidth={1.8} />
    );

  const control = (
    <Link
      href={c.href}
      aria-label={`Open ${c.title}`}
      onClick={(e) => e.stopPropagation()}
      className={`flex size-12 shrink-0 items-center justify-center rounded-pill border border-gold transition-[box-shadow,background-color] duration-300 md:size-16 ${
        featured
          ? "bg-gold text-on-gold shadow-glow hover:bg-gold-bright hover:shadow-glow-strong"
          : "text-gold-bright hover:bg-gold/10 hover:shadow-glow"
      }`}
    >
      {arrow}
    </Link>
  );
  const hint = (label: string) => (
    <span className="hidden font-display text-micro tracking-[0.35em] text-ivory-soft md:inline">{label}</span>
  );

  return (
    <motion.section
      aria-label={c.title}
      onClick={onOpen}
      style={style}
      className={`group absolute cursor-pointer overflow-hidden max-md:inset-x-0 max-md:h-1/3 md:inset-y-0 md:w-1/3 ${measured ? "" : FALLBACK[index]}`}
    >
      <GoldBackdrop scrim={SCRIM[index]} className="transition-opacity duration-700" />

      {/* Resting content, laid out at one-third width so it never reflows while the panel moves. */}
      <motion.div
        style={{ opacity: values.content }}
        className="absolute inset-y-0 left-0 w-full md:w-[33.334vw]"
      >
        <Numeral className="absolute top-1/2 right-4 -translate-y-1/2 text-[130px] md:inset-x-0 md:top-10 md:translate-y-0 md:text-center md:text-[clamp(160px,16.7vw,240px)]">
          {c.numeral}
        </Numeral>

        <div className="absolute inset-y-0 left-6 flex flex-col justify-center gap-2 md:inset-x-0 md:top-[40.6%] md:bottom-auto md:items-center md:gap-3.5 md:text-center">
          <p className="font-display text-micro tracking-eyebrow text-gold md:text-xs">{c.eyebrow}</p>
          <h2 className="km-gold-text font-display text-[28px] leading-tight font-bold tracking-[0.04em] md:text-[clamp(34px,3.2vw,46px)]">
            {c.title}
          </h2>
          <p className="text-[17px] text-ivory-soft italic md:text-[22px]">{c.subline}</p>
        </div>

        {/* The way in: a round arrow pointing where the chamber will open. */}
        <div
          className={`absolute right-5 bottom-5 flex items-center gap-4 md:bottom-[10.8%] ${
            id === "legacy"
              ? "md:right-8"
              : id === "atelier"
                ? "md:right-auto md:left-8"
                : "md:right-auto md:bottom-[15.8%] md:left-1/2 md:-translate-x-1/2 md:flex-col"
          }`}
        >
          {id === "atelier" ? (
            <>
              {control}
              {hint("SLIDE OPEN")}
            </>
          ) : (
            <>
              {hint(featured ? "DESCEND" : "SLIDE OPEN")}
              {control}
            </>
          )}
        </div>
      </motion.div>

      {/* Squeezed into a strip: dim it and turn the title on its side. */}
      <motion.div aria-hidden="true" style={{ opacity: stripOpacity }} className="absolute inset-0 bg-black" />
      <motion.div
        aria-hidden="true"
        style={{ opacity: values.strip }}
        className="absolute inset-0 flex items-center justify-center"
      >
        <span className="font-display text-sm tracking-[0.4em] text-muted uppercase md:text-lg md:[writing-mode:vertical-rl]">
          {c.title}
        </span>
      </motion.div>
    </motion.section>
  );
}

function Divider({
  pos,
  axis,
  measured,
  index,
  hidden,
}: {
  pos: MotionValue<number>;
  axis: Axis;
  measured: boolean;
  index: number;
  hidden: boolean;
}) {
  const style = measured ? (axis === "x" ? { left: pos } : { top: pos }) : undefined;
  return (
    <motion.div
      aria-hidden="true"
      style={style}
      className={`pointer-events-none absolute transition-opacity duration-500 max-md:inset-x-0 max-md:h-px md:inset-y-0 md:w-px ${
        hidden ? "opacity-0" : ""
      } ${measured ? "" : index === 1 ? "max-md:top-1/3 md:left-1/3" : "max-md:top-2/3 md:left-2/3"}`}
    >
      <span className="absolute inset-0 bg-gold" />
      <span className="absolute top-1/2 left-1/2 size-2.5 -translate-x-1/2 -translate-y-1/2 rotate-45 border border-gold bg-black" />
    </motion.div>
  );
}

const STREAKS = [
  { at: 13, len: 380, thick: 1 },
  { at: 30, len: 260, thick: 1 },
  { at: 48, len: 460, thick: 2 },
  { at: 67, len: 300, thick: 1 },
  { at: 84, len: 400, thick: 1 },
];

/** The leading edge of a sliding chamber: a glowing gold bar trailing streaks of light. */
function MovingEdge({
  pos,
  glow,
  axis,
  trail,
}: {
  pos: MotionValue<number>;
  glow: MotionValue<number>;
  axis: Axis;
  trail: "before" | "after";
}) {
  const horizontal = axis === "x";
  const scale = horizontal ? 1 : 0.4;
  return (
    <motion.div
      aria-hidden="true"
      style={{ ...(horizontal ? { left: pos } : { top: pos }), opacity: glow }}
      className={`pointer-events-none absolute z-10 ${horizontal ? "inset-y-0 w-0" : "inset-x-0 h-0"}`}
    >
      <span
        className={`absolute bg-gold-bright shadow-[0_0_28px_rgba(255,200,110,0.8)] ${
          horizontal ? "inset-y-0 -left-[1.5px] w-[3px]" : "inset-x-0 -top-[1.5px] h-[3px]"
        }`}
      />
      {STREAKS.map((s, i) => {
        const len = s.len * scale;
        const along = `${s.at}%`;
        const style = horizontal
          ? {
              top: along,
              height: s.thick,
              width: len,
              [trail === "before" ? "right" : "left"]: 0,
              background: `linear-gradient(${trail === "before" ? 90 : 270}deg, transparent, color-mix(in srgb, var(--km-gold-bright) 80%, transparent))`,
            }
          : {
              left: along,
              width: s.thick,
              height: len,
              [trail === "before" ? "bottom" : "top"]: 0,
              background: `linear-gradient(${trail === "before" ? 180 : 0}deg, transparent, color-mix(in srgb, var(--km-gold-bright) 80%, transparent))`,
            };
        return <span key={i} className="absolute" style={style} />;
      })}
    </motion.div>
  );
}
