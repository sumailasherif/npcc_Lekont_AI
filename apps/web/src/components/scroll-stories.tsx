"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import type { CSSProperties, ReactNode } from "react";

import { CountUp } from "@/components/count-up";
import { Reveal, card } from "@/components/motion";
import type { Messages } from "@/lib/i18n";

type Story = Messages["story"];

/* ---------------------------------------------------------------- hooks */

/** Matches a media query on the client; `fallback` is used while server rendering. */
function useMedia(query: string, fallback = false) {
  return useSyncExternalStore(
    (callback) => {
      const media = window.matchMedia(query);
      media.addEventListener("change", callback);
      return () => media.removeEventListener("change", callback);
    },
    () => window.matchMedia(query).matches,
    () => fallback,
  );
}

/**
 * Scroll progress (0 → 1) through a tall section: 0 when its top reaches the top of the
 * viewport, 1 when its bottom reaches the bottom. Updates at most once per frame.
 */
function useScrollProgress<T extends HTMLElement>(enabled = true) {
  const ref = useRef<T | null>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    let frame = 0;
    const update = () => {
      frame = 0;
      const rect = node.getBoundingClientRect();
      const travel = rect.height - window.innerHeight;
      const next = travel <= 0 ? 0 : clamp(-rect.top / travel);
      setProgress((previous) => (Math.abs(previous - next) < 0.0005 ? previous : next));
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    schedule();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
    // Re-attach when the tracked section mounts (e.g. after switching from the mobile layout).
  }, [enabled]);

  return [ref, progress] as const;
}

/** True once the element has scrolled into view (never resets). */
function useInView<T extends HTMLElement>() {
  const ref = useRef<T | null>(null);
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    const node = ref.current;
    if (!node || typeof IntersectionObserver === "undefined") {
      const frame = requestAnimationFrame(() => setSeen(true));
      return () => cancelAnimationFrame(frame);
    }
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setSeen(true);
          observer.disconnect();
        }
      },
      { threshold: 0.35 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);
  return [ref, seen] as const;
}

function clamp(value: number, min = 0, max = 1) {
  return Math.min(max, Math.max(min, value));
}

const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);
const lerp = (from: number, to: number, t: number) => from + (to - from) * t;

function Heading({
  eyebrow,
  title,
  sub,
  align = "center",
  dark = false,
}: {
  eyebrow: string;
  title: ReactNode;
  sub?: string;
  align?: "center" | "left";
  dark?: boolean;
}) {
  return (
    <div className={align === "center" ? "mx-auto max-w-2xl text-center" : "max-w-xl"}>
      <span
        className={`text-xs font-semibold uppercase tracking-[0.2em] ${dark ? "text-lagoon-soft" : "text-lagoon-deep"}`}
      >
        {eyebrow}
      </span>
      <h2 className="mt-3 text-balance text-3xl font-semibold tracking-tight md:text-4xl">{title}</h2>
      {sub ? <p className={`mt-4 text-pretty ${dark ? "text-slate-300" : "text-muted"}`}>{sub}</p> : null}
    </div>
  );
}

/* ------------------------------------------------- 1. count-up stat row */

export function StoryStats({ copy }: { copy: Story["stats"] }) {
  const [ref, seen] = useInView<HTMLDivElement>();
  return (
    <section className="mx-auto max-w-6xl px-4 pt-24 md:px-6">
      <Reveal>
        <Heading eyebrow={copy.eyebrow} title={copy.title} />
      </Reveal>
      <div ref={ref} className="mt-12 grid grid-cols-2 gap-px overflow-hidden rounded-3xl border border-line bg-line lg:grid-cols-4">
        {copy.items.map((item, index) => (
          <div key={item.label} className="relative bg-card px-5 py-8 text-center md:px-6 md:py-10">
            <p className="text-4xl font-semibold tracking-tight text-ink md:text-5xl">
              {seen ? (
                <CountUp
                  value={item.value}
                  duration={1400 + index * 200}
                  prefix={item.prefix}
                  suffix={item.suffix}
                  decimals={item.decimals}
                />
              ) : (
                <span className="tabular-nums">
                  {item.prefix}0{item.suffix}
                </span>
              )}
            </p>
            <p className="mx-auto mt-3 max-w-[22ch] text-sm text-muted">{item.label}</p>
            <span
              aria-hidden
              className="stat-underline absolute inset-x-8 bottom-0 h-0.5 origin-left rounded-full bg-gradient-to-r from-lagoon to-coral"
              style={{ transform: `scaleX(${seen ? 1 : 0})`, transitionDelay: `${index * 160}ms` }}
            />
          </div>
        ))}
      </div>
    </section>
  );
}

/* ----------------------------------- 2. pinned scroll story (4 steps) */

export function PinnedStory({ copy }: { copy: Story["pinned"] }) {
  const [ref, progress] = useScrollProgress<HTMLElement>();
  const count = copy.steps.length;
  const position = progress * count;
  const active = Math.min(count - 1, Math.floor(position));
  const local = clamp(position - active);
  const pad = (n: number) => String(n).padStart(2, "0");
  // 0 → 1 as each card flies in; it starts just before its step becomes active.
  const arrivals = PANES.map((_, index) =>
    index === 0 ? 1 : easeOut(clamp((position - index + 0.4) / 0.5)),
  );

  return (
    <section ref={ref} className="relative h-[360vh] bg-night text-white" aria-label={copy.title}>
      <div className="sticky top-0 flex h-svh items-center overflow-hidden">
        <div aria-hidden className="pointer-events-none absolute inset-0">
          <div className="absolute -left-40 top-1/4 h-[420px] w-[520px] rounded-full bg-[radial-gradient(closest-side,rgba(20,184,166,0.28),transparent)]" />
          <div className="absolute -right-32 bottom-10 h-[360px] w-[460px] rounded-full bg-[radial-gradient(closest-side,rgba(255,107,74,0.18),transparent)]" />
          <div className="hero-grid opacity-60" />
        </div>

        <div className="relative mx-auto grid w-full max-w-6xl items-center gap-8 px-4 md:px-6 lg:grid-cols-[1fr_1.05fr] lg:gap-14">
          <div>
            <Heading eyebrow={copy.eyebrow} title={copy.title} sub={copy.sub} align="left" dark />

            <div className="mt-6 flex items-center gap-4 lg:mt-8">
              <span className="font-mono text-sm tabular-nums text-lagoon-soft">
                {pad(active + 1)} <span className="text-slate-500">/ {pad(count)}</span>
              </span>
              <span className="relative h-1 flex-1 overflow-hidden rounded-full bg-white/10">
                <span
                  className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-lagoon to-coral"
                  style={{ width: `${progress * 100}%` }}
                />
              </span>
            </div>

            <ol className="mt-5 flex flex-col gap-1.5 lg:mt-6">
              {copy.steps.map((step, index) => {
                const state = index < active ? "done" : index === active ? "active" : "next";
                return (
                  <li
                    key={step.title}
                    className={`rounded-2xl border px-4 transition-all duration-500 ${
                      state === "active"
                        ? "border-lagoon/40 bg-white/[0.06] py-3.5"
                        : "border-transparent py-2"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className={`grid h-6 w-6 shrink-0 place-items-center rounded-full text-[11px] font-semibold transition-colors duration-500 ${
                          state === "next" ? "bg-white/10 text-slate-400" : "bg-lagoon text-night"
                        }`}
                      >
                        {state === "done" ? "✓" : index + 1}
                      </span>
                      <span
                        className={`font-semibold transition-colors duration-500 ${
                          state === "next" ? "text-slate-500" : "text-white"
                        }`}
                      >
                        {step.title}
                      </span>
                      <span className="ml-auto hidden text-[11px] uppercase tracking-[0.14em] text-slate-500 sm:inline">
                        {step.tag}
                      </span>
                    </div>
                    <div
                      className={`grid transition-all duration-500 ${
                        state === "active" ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                      }`}
                    >
                      <p className="overflow-hidden pl-9 pt-1.5 text-sm leading-6 text-slate-300">{step.body}</p>
                    </div>
                  </li>
                );
              })}
            </ol>
            <p
              className="mt-4 text-xs text-slate-500 transition-opacity duration-500"
              style={{ opacity: progress < 0.04 ? 1 : 0 }}
            >
              {copy.hint} ↓
            </p>
          </div>

          {/* Cards join: each step's card slides up and lands on the pile; earlier cards tuck back */}
          <div className="relative mx-auto hidden w-full max-w-[440px] pt-[78px] sm:block">
            <div className="relative aspect-[5/5.1]">
              {PANES.map((Pane, index) => {
                const depth = arrivals.slice(index + 1).reduce((sum, value) => sum + value, 0);
                const arrive = arrivals[index];
                return (
                  <div
                    key={index}
                    className="absolute inset-0 origin-top will-change-transform"
                    style={{
                      zIndex: index + 1,
                      opacity: Math.min(1, arrive * 1.6),
                      transform: `translateY(calc(${(1 - arrive) * 120}% - ${depth * 26}px)) scale(${1 - depth * 0.055}) rotate(${(1 - arrive) * 5}deg)`,
                      filter: depth > 0.05 ? `brightness(${1 - Math.min(depth, 3) * 0.1})` : undefined,
                    }}
                    aria-hidden={index !== active}
                  >
                    <Pane local={index === active ? local : index < active ? 1 : 0} v={copy.visual} />
                  </div>
                );
              })}
            </div>
            <div
              className="mt-5 flex items-center justify-center gap-2 text-xs font-medium text-lagoon-soft transition-all duration-500"
              style={{ opacity: progress > 0.9 ? 1 : 0, transform: progress > 0.9 ? "none" : "translateY(8px)" }}
            >
              <span className="grid h-4 w-4 place-items-center rounded-full bg-lagoon text-[9px] text-night">✓</span>
              {copy.joined}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

type PaneProps = { local: number; v: Story["pinned"]["visual"] };

// Function declarations below are hoisted, so this list can sit above them.
const PANES = [StepForward, StepRead, StepApprove, StepLedger];

const INVOICE = [
  ["supplier", "Chen Wholesale Ltd"],
  ["date", "12/11/2026"],
  ["net", "MUR 4,200.00"],
  ["vat", "MUR 630.00"],
  ["total", "MUR 4,830.00"],
] as const;

function PaneShell({ children, title }: { children: ReactNode; title: string }) {
  return (
    <div className="light-scope flex h-full flex-col overflow-hidden rounded-[28px] border border-white/15 bg-white text-[#071426] shadow-[0_40px_90px_-30px_rgba(0,0,0,0.7)]">
      <div className="flex items-center gap-2 border-b border-[#e3e8ef] px-4 py-3">
        <span className="h-2.5 w-2.5 rounded-full bg-[#ff6b4a]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#f59e0b]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#14b8a6]" />
        <span className="ml-2 text-xs font-semibold text-[#5b6678]">{title}</span>
      </div>
      <div className="relative flex-1 p-5">{children}</div>
    </div>
  );
}

function StepForward({ local, v }: PaneProps) {
  const sent = local > 0.35;
  return (
    <div className="flex h-full flex-col overflow-hidden rounded-[28px] border border-white/15 bg-[#0b141a] shadow-[0_40px_90px_-30px_rgba(0,0,0,0.7)]">
      <div className="flex items-center gap-3 bg-[#1f2c34] px-4 py-3">
        <span className="grid h-8 w-8 place-items-center rounded-full bg-lagoon text-xs font-bold text-night">L</span>
        <div>
          <p className="text-sm font-semibold text-white">Lekont</p>
          <p className="text-[11px] text-emerald-300">{v.online}</p>
        </div>
      </div>
      <div className="flex flex-1 flex-col justify-end gap-3 bg-[radial-gradient(rgba(255,255,255,0.04)_1px,transparent_1px)] [background-size:14px_14px] p-4">
        <div className="ml-auto w-[72%] rounded-2xl rounded-tr-sm bg-[#005c4b] p-1.5 text-white shadow-lg">
          <div className="relative overflow-hidden rounded-xl bg-[#fdfcf8] p-3 text-[#071426]">
            <p className="text-[10px] font-bold uppercase tracking-wider text-[#5b6678]">Facture · INV-0418</p>
            <p className="mt-1 text-xs font-semibold">Chen Wholesale Ltd</p>
            <div className="mt-2 flex flex-col gap-1">
              {[80, 64, 72, 50].map((width, index) => (
                <span key={index} className="h-1.5 rounded-full bg-[#e3e8ef]" style={{ width: `${width}%` }} />
              ))}
            </div>
            <p className="mt-2 text-right text-xs font-bold">MUR 4,830</p>
          </div>
          <div className="flex items-center justify-between px-1.5 pb-0.5 pt-1 text-[10px] text-emerald-100/80">
            <span>Facture_0418.jpg</span>
            <span className={sent ? "text-sky-300" : ""}>{sent ? "✓✓" : "✓"} 09:41</span>
          </div>
        </div>
        <div
          className="w-[70%] rounded-2xl rounded-tl-sm bg-[#1f2c34] px-3 py-2 text-xs text-white transition-all duration-500"
          style={{ opacity: sent ? 1 : 0, transform: sent ? "none" : "translateY(10px)" }}
        >
          {v.received}
        </div>
      </div>
    </div>
  );
}

function StepRead({ local, v }: PaneProps) {
  const scan = easeOut(clamp(local / 0.8));
  return (
    <PaneShell title={v.reading}>
      <div className="relative h-full overflow-hidden rounded-xl border border-[#e3e8ef] bg-[#fdfcf8] p-4">
        <p className="text-[10px] font-bold uppercase tracking-wider text-[#5b6678]">Facture · INV-0418</p>
        <div className="mt-3 flex flex-col gap-2.5">
          {INVOICE.map(([key, value], index) => {
            const found = scan > (index + 0.6) / INVOICE.length;
            return (
              <div key={key} className="flex items-center justify-between gap-3 text-sm">
                <span className="text-[#5b6678]">{v.fields[key]}</span>
                <span
                  className={`rounded-md px-2 py-0.5 font-semibold tabular-nums transition-all duration-300 ${
                    found ? "bg-[#ccfbf1] text-[#0d9488]" : "text-[#071426]"
                  }`}
                >
                  {value}
                </span>
              </div>
            );
          })}
        </div>
        <span
          aria-hidden
          className="pointer-events-none absolute inset-x-0 h-16 bg-gradient-to-b from-transparent via-[#14b8a6]/25 to-transparent"
          style={{ top: `calc(${scan * 100}% - 2rem)` }}
        />
        <span
          aria-hidden
          className="pointer-events-none absolute inset-x-0 h-px bg-[#14b8a6] shadow-[0_0_12px_#14b8a6]"
          style={{ top: `${scan * 100}%` }}
        />
        <div className="absolute inset-x-4 bottom-4 flex items-center justify-between rounded-lg bg-[#071426] px-3 py-2 text-xs text-white">
          <span>{v.confidence}</span>
          <span className="font-semibold tabular-nums text-[#5eead4]">{Math.round(scan * 96)}%</span>
        </div>
      </div>
    </PaneShell>
  );
}

function StepApprove({ local, v }: PaneProps) {
  const approved = local > 0.55;
  return (
    <PaneShell title={v.review}>
      <div className="flex h-full flex-col gap-3">
        <div className="rounded-xl border border-[#e3e8ef] p-3">
          {INVOICE.slice(0, 3).map(([key, value]) => (
            <div key={key} className="flex justify-between py-1 text-sm">
              <span className="text-[#5b6678]">{v.fields[key]}</span>
              <span className="font-semibold">{value}</span>
            </div>
          ))}
          <div className="mt-1 flex justify-between rounded-lg bg-[#fef3c7] px-2 py-1.5 text-sm">
            <span className="text-[#b45309]">{v.vatCheck}</span>
            <span className="font-semibold text-[#b45309]">630.00 ✓</span>
          </div>
        </div>
        <div className="relative mt-auto">
          <div
            className="grid grid-cols-2 gap-2 transition-all duration-500"
            style={{ opacity: approved ? 0 : 1, transform: approved ? "scale(0.96)" : "none" }}
          >
            <span className="rounded-xl border border-[#e3e8ef] py-2.5 text-center text-sm font-semibold">{v.edit}</span>
            <span className="relative overflow-hidden rounded-xl bg-[#0d9488] py-2.5 text-center text-sm font-semibold text-white">
              {v.approve}
              <span
                aria-hidden
                className="absolute inset-y-0 left-0 bg-white/25"
                style={{ width: `${clamp(local / 0.55) * 100}%` }}
              />
            </span>
          </div>
          <div
            className="absolute inset-0 flex items-center justify-center gap-2 rounded-xl bg-[#ccfbf1] text-sm font-semibold text-[#0d9488] transition-all duration-500"
            style={{ opacity: approved ? 1 : 0, transform: approved ? "none" : "scale(0.9)" }}
          >
            <span className="grid h-5 w-5 place-items-center rounded-full bg-[#0d9488] text-[10px] text-white">✓</span>
            {v.approved}
          </div>
        </div>
      </div>
    </PaneShell>
  );
}

function StepLedger({ local, v }: PaneProps) {
  const rows = [
    ["10/11", "Sun Packaging", "1,150"],
    ["11/11", "Payroll · 6", "141,600"],
    ["12/11", "Chen Wholesale Ltd", "4,830"],
  ];
  const landed = local > 0.15;
  const pdf = local > 0.6;
  return (
    <PaneShell title={v.ledger}>
      <div className="flex h-full flex-col">
        <div className="overflow-hidden rounded-xl border border-[#e3e8ef]">
          {rows.map(([date, name, amount], index) => {
            const isNew = index === rows.length - 1;
            return (
              <div
                key={name}
                className={`flex items-center gap-3 border-b border-[#e3e8ef] px-3 py-2.5 text-sm transition-all duration-500 last:border-0 ${
                  isNew ? (landed ? "bg-[#effcf9]" : "opacity-0") : ""
                }`}
                style={isNew ? { transform: landed ? "none" : "translateY(-12px)" } : undefined}
              >
                <span className="w-10 text-xs text-[#5b6678]">{date}</span>
                <span className="flex-1 truncate font-medium">{name}</span>
                <span className="font-semibold tabular-nums">MUR {amount}</span>
              </div>
            );
          })}
        </div>
        <div
          className="mt-auto flex items-center gap-3 rounded-2xl border border-[#e3e8ef] p-3 shadow-[0_20px_40px_-20px_rgba(7,20,38,0.4)] transition-all duration-700"
          style={{ opacity: pdf ? 1 : 0, transform: pdf ? "none" : "translateY(16px)" }}
        >
          <span className="grid h-10 w-10 place-items-center rounded-lg bg-[#ff6b4a] text-[10px] font-bold text-white">PDF</span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold">{v.report}</p>
            <p className="text-xs text-[#5b6678]">{v.reportSub}</p>
          </div>
          <span className="text-lg">↓</span>
        </div>
      </div>
    </PaneShell>
  );
}

/* --------------------------------------------- 3. orbit of six tools */

const ORBIT_ICONS = [
  "M6 3h9l4 4v14H6V3Zm8 1v4h4",
  "M4 5h16v11H9l-5 4V5Z",
  "M12 3a9 9 0 1 0 9 9h-9V3Z",
  "M7 4h10v16H7zM11 17h2",
  "M5 19 19 5M7 8a1 1 0 1 0 0-2 1 1 0 0 0 0 2Zm10 10a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z",
  "M16 19v-1a4 4 0 0 0-8 0v1M12 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z",
];

function OrbitCard({ item, index }: { item: Story["orbit"]["items"][number]; index: number }) {
  return (
    <Link
      href={item.href}
      className={`${card} group block w-44 p-3.5 text-left transition hover:-translate-y-1 hover:border-lagoon`}
    >
      <span className="grid h-8 w-8 place-items-center rounded-lg bg-lagoon-wash text-lagoon-deep transition group-hover:bg-lagoon group-hover:text-night">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <path d={ORBIT_ICONS[index % ORBIT_ICONS.length]} />
        </svg>
      </span>
      <p className="mt-2 text-sm font-semibold">{item.title}</p>
      <p className="mt-0.5 text-xs leading-5 text-muted">{item.body}</p>
    </Link>
  );
}

function OrbitCore() {
  return (
    <div className="relative grid h-28 w-28 place-items-center rounded-full border border-lagoon/30 bg-card shadow-[0_0_0_10px_rgba(20,184,166,0.08),0_30px_60px_-20px_rgba(20,184,166,0.6)]">
      <span className="orbit-pulse absolute inset-0 rounded-full border border-lagoon/40" aria-hidden />
      <Image src="/brand/lekont-icon.svg" alt="Lekont" width={56} height={56} />
    </div>
  );
}

export function OrbitTools({ copy }: { copy: Story["orbit"] }) {
  const items = copy.items;
  return (
    <section className="mx-auto max-w-6xl px-4 py-24 md:px-6">
      <Reveal>
        <Heading eyebrow={copy.eyebrow} title={copy.title} sub={copy.sub} />
      </Reveal>

      {/* Desktop: cards orbit the Lekont ledger; hover pauses the orbit */}
      <Reveal delay={120} className="mt-6 hidden md:block">
        <div className="orbit relative mx-auto aspect-square w-full max-w-[620px]">
          <svg viewBox="0 0 620 620" className="absolute inset-0 h-full w-full" aria-hidden>
            <circle cx="310" cy="310" r="225" fill="none" stroke="var(--color-line)" strokeWidth="1.5" />
            <circle cx="310" cy="310" r="225" fill="none" stroke="#14b8a6" strokeWidth="1.5" strokeDasharray="4 10" className="dash-march" />
            <circle cx="310" cy="310" r="120" fill="none" stroke="var(--color-line)" strokeDasharray="2 8" />
          </svg>
          <div className="absolute inset-0 grid place-items-center">
            <OrbitCore />
          </div>
          <div className="orbit-ring absolute inset-0">
            <span className="absolute left-1/2 top-[calc(50%-120px)] h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-coral shadow-[0_0_14px_#ff6b4a]" aria-hidden />
            {items.map((item, index) => (
              <div
                key={item.title}
                className="orbit-item"
                style={{ "--a": `${(360 / items.length) * index - 90}deg` } as CSSProperties}
              >
                <div className="orbit-counter">
                  <OrbitCard item={item} index={index} />
                </div>
              </div>
            ))}
          </div>
        </div>
        <p className="mt-2 text-center text-xs text-muted">{copy.hint}</p>
      </Reveal>

      {/* Mobile: core on top, tools in a grid */}
      <div className="mt-10 flex flex-col items-center gap-8 md:hidden">
        <OrbitCore />
        <div className="grid w-full grid-cols-2 gap-3">
          {items.map((item, index) => (
            <Reveal key={item.title} delay={index * 60} className="[&_a]:w-full">
              <OrbitCard item={item} index={index} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------- 4. scroll-dealt card deck */

const ROLE_STYLES = {
  owner: "bg-lagoon-wash text-lagoon-deep ring-lagoon/30",
  accountant: "bg-coral-soft text-coral ring-coral/30",
  staff: "bg-sun-soft text-sun-ink ring-sun/30",
} as const;

function DeckCard({ item, roles, index }: { item: Story["deck"]["cards"][number]; roles: Story["deck"]["roles"]; index: number }) {
  return (
    <div className={`${card} flex h-full flex-col p-4`}>
      <div className="flex items-center justify-between">
        <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ring-1 ${ROLE_STYLES[item.role]}`}>
          {roles[item.role]}
        </span>
        <span className="font-mono text-[11px] text-muted">{String(index + 1).padStart(2, "0")}</span>
      </div>
      <p className="mt-auto pt-4 font-semibold leading-snug">{item.title}</p>
      <p className="mt-1 text-xs leading-5 text-muted">{item.body}</p>
    </div>
  );
}

export function DealtDeck({ copy }: { copy: Story["deck"] }) {
  const desktop = useMedia("(min-width: 768px)");
  const [ref, progress] = useScrollProgress<HTMLElement>(desktop);
  const stage = useRef<HTMLDivElement | null>(null);
  const [width, setWidth] = useState(960);

  useEffect(() => {
    const node = stage.current;
    if (!node) return;
    const observer = new ResizeObserver(([entry]) => setWidth(entry.contentRect.width));
    observer.observe(node);
    return () => observer.disconnect();
  }, [desktop]);

  const cards = copy.cards;

  if (!desktop) {
    return (
      <section className="mx-auto max-w-6xl px-4 py-20">
        <Heading eyebrow={copy.eyebrow} title={copy.title} sub={copy.sub} />
        <div className="mt-10 grid grid-cols-2 gap-3">
          {cards.map((item, index) => (
            <Reveal key={item.title} delay={(index % 2) * 80} className="h-full">
              <DeckCard item={item} roles={copy.roles} index={index} />
            </Reveal>
          ))}
        </div>
      </section>
    );
  }

  const cols = 4;
  const rows = Math.ceil(cards.length / cols);
  const gap = 16;
  const cardW = Math.min(250, (width - gap * (cols - 1)) / cols);
  const cardH = 176;
  const stageH = rows * cardH + (rows - 1) * gap;

  return (
    <section ref={ref} className="relative h-[260vh]" aria-label={copy.title}>
      <div className="sticky top-0 flex h-svh flex-col justify-center overflow-hidden">
        <div className="mx-auto w-full max-w-6xl px-6">
          <Heading eyebrow={copy.eyebrow} title={copy.title} sub={copy.sub} />
          <div ref={stage} className="relative mx-auto mt-10" style={{ height: stageH }}>
            {cards.map((item, index) => {
              const t = easeOut(clamp((progress - 0.06 - index * 0.06) / 0.34));
              const col = index % cols;
              const row = Math.floor(index / cols);
              const targetX = (col - (cols - 1) / 2) * (cardW + gap);
              const targetY = (row - (rows - 1) / 2) * (cardH + gap);
              const pileX = (index - (cards.length - 1) / 2) * 3;
              const pileY = cardH / 2 - index * 2;
              const x = lerp(pileX, targetX, t);
              const y = lerp(pileY, targetY, t);
              const rotate = lerp((index - (cards.length - 1) / 2) * 4, 0, t);
              const scale = lerp(0.9, 1, t);
              return (
                <div
                  key={item.title}
                  className="absolute left-1/2 top-1/2 will-change-transform"
                  style={{
                    width: cardW,
                    height: cardH,
                    zIndex: t > 0.5 ? 20 + index : cards.length - index,
                    transform: `translate(-50%, -50%) translate(${x}px, ${y}px) rotate(${rotate}deg) scale(${scale})`,
                  }}
                >
                  <DeckCard item={item} roles={copy.roles} index={index} />
                </div>
              );
            })}
          </div>
          <p
            className="mt-6 text-center text-xs text-muted transition-opacity duration-500"
            style={{ opacity: progress < 0.05 ? 1 : 0 }}
          >
            {copy.hint} ↓
          </p>
        </div>
      </div>
    </section>
  );
}

/* --------------------------------------- 5. horizontal photo gallery */

const GALLERY = [
  { src: "/photos/owner-apron.jpg", w: 1400, h: 933 },
  { src: "/photos/hand-phone.jpg", w: 1400, h: 933 },
  { src: "/photos/manager-laptop.jpg", w: 1400, h: 788 },
  { src: "/photos/celebrating-suit.jpg", w: 1600, h: 900 },
];

function GalleryPhoto({ photo, caption, index }: { photo: (typeof GALLERY)[number]; caption: string; index: number }) {
  return (
    <figure className="group relative h-full shrink-0 overflow-hidden rounded-[28px] shadow-[0_30px_70px_-35px_rgba(7,20,38,0.55)]">
      <Image
        src={photo.src}
        alt={caption}
        width={photo.w}
        height={photo.h}
        sizes="(min-width: 768px) 640px, 85vw"
        className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.04]"
      />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-night/80 via-night/10 to-transparent" aria-hidden />
      <figcaption className="absolute inset-x-5 bottom-5 flex items-end gap-3 text-white">
        <span className="font-mono text-xs text-lagoon-soft">{String(index + 1).padStart(2, "0")}</span>
        <span className="text-balance text-lg font-semibold leading-snug">{caption}</span>
      </figcaption>
    </figure>
  );
}

export function PhotoGallery({ copy }: { copy: Story["gallery"] }) {
  const desktop = useMedia("(min-width: 768px)");
  const [ref, progress] = useScrollProgress<HTMLElement>(desktop);
  const track = useRef<HTMLDivElement | null>(null);
  const [size, setSize] = useState({ track: 0, view: 0, height: 0 });

  useEffect(() => {
    if (!desktop) return;
    const node = track.current;
    if (!node) return;
    const measure = () =>
      setSize({ track: node.scrollWidth, view: window.innerWidth, height: window.innerHeight });
    const observer = new ResizeObserver(measure);
    observer.observe(node);
    window.addEventListener("resize", measure);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [desktop]);

  const intro = (
    <div className="flex w-[min(80vw,380px)] shrink-0 flex-col justify-center pr-4">
      <Heading eyebrow={copy.eyebrow} title={copy.title} sub={copy.sub} align="left" />
      <p className="mt-6 text-xs text-muted">{copy.hint} →</p>
    </div>
  );
  const outro = (
    <div className="flex w-[min(80vw,360px)] shrink-0 flex-col justify-center rounded-[28px] bg-night p-8 text-white">
      <p className="text-2xl font-semibold tracking-tight">{copy.endTitle}</p>
      <Link
        href="/whatsapp"
        className="mt-6 inline-flex w-fit items-center gap-2 rounded-xl bg-lagoon px-5 py-2.5 text-sm font-semibold text-night transition hover:-translate-y-0.5"
      >
        {copy.endCta} →
      </Link>
    </div>
  );

  if (!desktop) {
    return (
      <section className="py-20">
        <div className="px-4">{intro}</div>
        <div className="mt-8 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-4 [scrollbar-width:none]">
          {GALLERY.map((photo, index) => (
            <div key={photo.src} className="h-[60svh] w-[85vw] shrink-0 snap-center">
              <GalleryPhoto photo={photo} caption={copy.captions[index]} index={index} />
            </div>
          ))}
          <div className="snap-center">{outro}</div>
        </div>
      </section>
    );
  }

  const distance = Math.max(0, size.track - size.view);
  return (
    <section
      ref={ref}
      className="relative"
      style={{ height: size.height ? distance + size.height : "300vh" }}
      aria-label={copy.title}
    >
      <div className="sticky top-0 flex h-svh flex-col justify-center overflow-hidden">
        <div
          ref={track}
          className="flex h-[64vh] w-max items-stretch gap-6 pl-[max(1.5rem,calc((100vw-72rem)/2+1.5rem))] pr-[10vw] will-change-transform"
          style={{ transform: `translate3d(${-progress * distance}px, 0, 0)` }}
        >
          {intro}
          {GALLERY.map((photo, index) => (
            <div key={photo.src} className="aspect-[4/3] h-full">
              <GalleryPhoto photo={photo} caption={copy.captions[index]} index={index} />
            </div>
          ))}
          {outro}
        </div>
        <div className="mx-auto mt-8 h-1 w-48 overflow-hidden rounded-full bg-line">
          <span className="block h-full rounded-full bg-lagoon" style={{ width: `${progress * 100}%` }} />
        </div>
      </div>
    </section>
  );
}
