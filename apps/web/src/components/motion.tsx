"use client";

import { useEffect, useRef, useState } from "react";
import type { CSSProperties, ElementType, ReactNode } from "react";

/** Fades content in with a blur as it scrolls into view. */
export function Reveal({
  children,
  delay = 0,
  className = "",
  as: Tag = "div",
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
  as?: ElementType;
}) {
  const ref = useRef<HTMLElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    if (typeof IntersectionObserver === "undefined") {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setVisible(true);
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.12 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <Tag
      ref={ref}
      className={`reveal ${visible ? "is-visible" : ""} ${className}`}
      style={{ "--d": `${delay}ms` } as CSSProperties}
    >
      {children}
    </Tag>
  );
}

/** Animates a number from 0 to `value` once it is set. */
export function CountUp({
  value,
  duration = 1200,
  format = (n: number) => Math.round(n).toLocaleString("en-GB"),
}: {
  value: number | null | undefined;
  duration?: number;
  format?: (n: number) => string;
}) {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (value === null || value === undefined) return;
    const reduce =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setDisplay(value);
      return;
    }
    let frame = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      setDisplay(value * eased);
      if (t < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [value, duration]);

  if (value === null || value === undefined) {
    return <span className="skeleton inline-block h-[0.9em] w-16 rounded-md align-middle" />;
  }
  return <span className="tabular-nums">{format(display)}</span>;
}

/** Cycles through phrases with a typewriter effect. */
export function useTypewriter(phrases: string[], enabled = true) {
  const [text, setText] = useState("");

  useEffect(() => {
    if (!enabled || phrases.length === 0) return;
    let phrase = 0;
    let index = 0;
    let deleting = false;
    let timer: ReturnType<typeof setTimeout>;

    const step = () => {
      const current = phrases[phrase];
      if (!deleting) {
        index += 1;
        setText(current.slice(0, index));
        if (index === current.length) {
          deleting = true;
          timer = setTimeout(step, 1800);
          return;
        }
        timer = setTimeout(step, 38);
      } else {
        index -= 1;
        setText(current.slice(0, index));
        if (index === 0) {
          deleting = false;
          phrase = (phrase + 1) % phrases.length;
          timer = setTimeout(step, 300);
          return;
        }
        timer = setTimeout(step, 18);
      }
    };
    timer = setTimeout(step, 600);
    return () => clearTimeout(timer);
  }, [phrases, enabled]);

  return text;
}

const BEAMS: { kind: "h" | "v"; pos: string; delay: string; color: string }[] = [
  { kind: "h", pos: "128px", delay: "0s", color: "#5eead4" },
  { kind: "h", pos: "320px", delay: "6.4s", color: "#ffb199" },
  { kind: "h", pos: "512px", delay: "12.8s", color: "#5eead4" },
  { kind: "v", pos: "18%", delay: "3.2s", color: "#5eead4" },
  { kind: "v", pos: "62%", delay: "9.6s", color: "#ffb199" },
  { kind: "v", pos: "86%", delay: "15s", color: "#5eead4" },
];

/** Dark band with an animated grid, travelling beams and soft glows. */
export function HeroBackdrop() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="animate-glow absolute -top-40 left-1/2 h-[520px] w-[900px] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(20,184,166,0.35),transparent)]" />
      <div className="animate-glow absolute -right-40 top-24 h-[380px] w-[520px] rounded-full bg-[radial-gradient(closest-side,rgba(255,107,74,0.22),transparent)] [animation-delay:1.6s]" />
      <div className="hero-grid" />
      {BEAMS.map((beam, index) => (
        <span
          key={index}
          className={`hero-grid-beam hero-grid-beam--${beam.kind}`}
          style={
            {
              [beam.kind === "h" ? "top" : "left"]: beam.pos,
              "--d": beam.delay,
              "--beam": beam.color,
            } as CSSProperties
          }
        />
      ))}
    </div>
  );
}

/** Small sparkle glyph used in eyebrow badges. */
export function Sparkle({ delay = 0, className = "" }: { delay?: number; className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={`sparkle h-3.5 w-3.5 ${className}`}
      style={{ "--d": `${delay}ms` } as CSSProperties}
      fill="currentColor"
      aria-hidden
    >
      <path d="M12 2c.6 4.6 2.4 7.4 10 10-7.6 2.6-9.4 5.4-10 10-.6-4.6-2.4-7.4-10-10 7.6-2.6 9.4-5.4 10-10Z" />
    </svg>
  );
}

/** Page header band used across every screen. */
export function PageHero({
  eyebrow,
  title,
  highlight,
  description,
  actions,
  children,
  compact = false,
}: {
  eyebrow: string;
  title: string;
  highlight?: string;
  description: string;
  actions?: ReactNode;
  children?: ReactNode;
  compact?: boolean;
}) {
  return (
    <section
      className={`relative isolate overflow-hidden bg-ink text-white ${
        compact ? "pb-28 pt-32 md:pt-36" : "pb-36 pt-36 md:pt-44"
      }`}
    >
      <HeroBackdrop />
      <div className="relative mx-auto flex max-w-6xl flex-col items-center px-4 text-center md:px-6">
        <span
          className="hero-animated inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs font-medium text-lagoon-soft backdrop-blur"
          style={{ "--d": "0ms" } as CSSProperties}
        >
          <Sparkle className="text-coral" delay={300} />
          {eyebrow}
        </span>
        <h1
          className={`hero-animated mt-5 max-w-4xl text-balance font-semibold tracking-tight ${
            compact ? "text-4xl md:text-5xl" : "text-4xl md:text-6xl"
          }`}
          style={{ "--d": "90ms" } as CSSProperties}
        >
          {title} {highlight ? <span className="text-gradient">{highlight}</span> : null}
        </h1>
        <p
          className="hero-animated mt-5 max-w-[60ch] text-pretty text-base leading-7 text-slate-300 md:text-lg"
          style={{ "--d": "180ms" } as CSSProperties}
        >
          {description}
        </p>
        {actions ? (
          <div
            className="hero-animated mt-8 flex flex-wrap items-center justify-center gap-3"
            style={{ "--d": "270ms" } as CSSProperties}
          >
            {actions}
          </div>
        ) : null}
        {children ? (
          <div
            className="hero-animated mt-10 w-full"
            style={{ "--d": "360ms" } as CSSProperties}
          >
            {children}
          </div>
        ) : null}
      </div>
    </section>
  );
}

/** Infinite horizontal marquee; content is duplicated for a seamless loop. */
export function Marquee({ items }: { items: ReactNode[] }) {
  return (
    <div className="marquee overflow-hidden">
      <div className="marquee-track gap-3">
        {[...items, ...items].map((item, index) => (
          <div key={index} aria-hidden={index >= items.length} className="shrink-0">
            {item}
          </div>
        ))}
      </div>
    </div>
  );
}

export const buttonPrimary =
  "inline-flex items-center justify-center gap-2 rounded-xl bg-lagoon px-5 py-2.5 text-sm font-semibold text-ink shadow-[0_8px_30px_-8px_rgba(20,184,166,0.7)] transition hover:-translate-y-0.5 hover:bg-[#2dd4bf] disabled:translate-y-0 disabled:opacity-60";
export const buttonGhost =
  "inline-flex items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/5 px-5 py-2.5 text-sm font-semibold text-white backdrop-blur transition hover:-translate-y-0.5 hover:bg-white/10";
export const buttonDark =
  "inline-flex items-center justify-center gap-2 rounded-xl bg-ink px-4 py-2 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-ink-3 disabled:translate-y-0 disabled:opacity-50";
export const buttonLagoon =
  "inline-flex items-center justify-center gap-2 rounded-xl bg-lagoon-deep px-4 py-2 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-lagoon disabled:translate-y-0 disabled:opacity-50";
export const buttonOutline =
  "inline-flex items-center justify-center gap-2 rounded-xl border border-line bg-white px-4 py-2 text-sm font-semibold text-ink transition hover:-translate-y-0.5 hover:border-lagoon";
export const card = "rounded-2xl border border-line bg-white shadow-[0_1px_2px_rgba(15,23,42,0.04),0_12px_32px_-16px_rgba(15,23,42,0.12)]";
export const input =
  "rounded-xl border border-line bg-white px-3 py-2 text-sm font-normal text-ink outline-none transition focus:border-lagoon focus:ring-4 focus:ring-lagoon/15";
