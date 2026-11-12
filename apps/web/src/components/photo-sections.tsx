"use client";

import Image from "next/image";
import Link from "next/link";
import type { CSSProperties } from "react";

import { Reveal, buttonLagoon } from "@/components/motion";
import { useWidgetCopy } from "@/components/widget-copy";
import type { Messages } from "@/lib/i18n";

/* ---------- "Built for the counter" photo strip (photos 2 and 12) ---------- */

export function BuiltFor({ copy }: { copy: Messages["hero"]["built"] }) {
  const photos = [
    { src: "/photos/owner-apron.jpg", alt: "A shop owner in an apron checking his phone at the counter", chips: [copy.chips[0], copy.chips[1]] },
    {
      src: "/photos/manager-laptop.jpg",
      alt: "A smiling boutique owner checking her Lekont dashboard on her laptop",
      chips: [copy.chips[2], copy.chips[3]],
      dashboard: true,
    },
  ];
  return (
    <section className="mx-auto max-w-6xl px-4 pt-24 md:px-6">
      <Reveal className="mx-auto max-w-2xl text-center">
        <span className="text-xs font-semibold uppercase tracking-[0.2em] text-lagoon-deep">{copy.eyebrow}</span>
        <h2 className="mt-3 text-balance text-3xl font-semibold tracking-tight md:text-4xl">{copy.title}</h2>
        <p className="mt-4 text-pretty text-muted">{copy.sub}</p>
      </Reveal>
      <div className="mt-12 grid gap-6 md:grid-cols-2">
        {photos.map((photo, index) => (
          <Reveal key={photo.src} delay={index * 120}>
            <figure className="group relative overflow-hidden rounded-[28px] shadow-[0_30px_70px_-35px_rgba(7,20,38,0.55)]">
              <Image
                src={photo.src}
                alt={photo.alt}
                width={1400}
                height={photo.dashboard ? 788 : 933}
                sizes="(min-width: 768px) 560px, 100vw"
                className="aspect-[4/3] h-auto w-full object-cover transition duration-700 group-hover:scale-[1.04]"
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-night/70 via-night/10 to-transparent" aria-hidden />
              {photo.dashboard ? (
                <>
                  {/* Beam from the laptop up into the floating dashboard */}
                  <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="pointer-events-none absolute inset-0 hidden h-full w-full md:block" aria-hidden>
                    <path d="M 24 71 C 22 66, 20 63, 21 57" fill="none" stroke="#5eead4" strokeWidth="0.5" strokeDasharray="1.2 1.6" className="dash-march" vectorEffect="non-scaling-stroke" />
                  </svg>
                  <span className="pointer-events-none absolute left-[23%] top-[70%] hidden h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-lagoon shadow-[0_0_14px_#14b8a6] md:block" aria-hidden>
                    <span className="orbit-pulse absolute inset-0 rounded-full border border-lagoon" />
                  </span>
                  <div className="absolute left-[4%] top-[5%] hidden w-[48%] md:block">
                    <ShopDashboard />
                  </div>
                </>
              ) : null}
              {photo.chips.map((chip, chipIndex) => (
                <span
                  key={chip}
                  className={`side-card float-y absolute rounded-full border border-white/60 bg-white/85 px-3.5 py-2 text-xs font-semibold text-night shadow-[0_18px_40px_-14px_rgba(7,20,38,0.6)] backdrop-blur-md ${
                    photo.dashboard
                      ? chipIndex === 0
                        ? "right-4 top-4 md:right-6 md:top-6"
                        : "bottom-4 right-4 md:bottom-6 md:right-6"
                      : chipIndex === 0
                        ? "left-4 top-4 md:left-6 md:top-6"
                        : "bottom-4 right-4 md:bottom-6 md:right-6"
                  }`}
                  style={{ animationDelay: `${index * 0.8 + chipIndex * 1.4}s` } as CSSProperties}
                >
                  {chip}
                </span>
              ))}
            </figure>
            {photo.dashboard ? (
              <div className="mt-4 md:hidden">
                <ShopDashboard />
              </div>
            ) : null}
          </Reveal>
        ))}
      </div>
    </section>
  );
}

/* ---------- Monthly report: celebrating owner + floating Lekont report panel ---------- */

export function AccountantShowcase({ copy }: { copy: Messages["hero"]["acct"] }) {
  const w = useWidgetCopy();
  return (
    <section className="mx-auto max-w-6xl px-4 pb-24 pt-24 md:px-6">
      <div className="grid items-center gap-10 lg:grid-cols-[0.8fr_1.2fr]">
        <Reveal>
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-lagoon-deep">{copy.eyebrow}</span>
          <h2 className="mt-3 text-balance text-3xl font-semibold tracking-tight md:text-5xl">
            {copy.title} <span className="text-lagoon-deep">{copy.highlight}</span>
          </h2>
          <p className="mt-5 text-pretty leading-7 text-muted md:text-lg">{copy.sub}</p>
          <ul className="mt-6 flex flex-col gap-3">
            {copy.points.map((point) => (
              <li key={point} className="flex items-center gap-3 text-sm font-medium">
                <span className="grid h-6 w-6 place-items-center rounded-full bg-lagoon-wash text-lagoon-deep ring-1 ring-lagoon/30">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                    <path d="m5 12 5 5 9-10" />
                  </svg>
                </span>
                {point}
              </li>
            ))}
          </ul>
          <Link href="/documents" className={`${buttonLagoon} mt-8`}>
            {copy.cta}
          </Link>
        </Reveal>
        <Reveal delay={120}>
          <div className="relative">
            <div className="pointer-events-none absolute -inset-6 -z-10 rounded-[40px] bg-[radial-gradient(closest-side,rgba(20,184,166,0.3),transparent)] blur-2xl" aria-hidden />
            <figure className="relative overflow-hidden rounded-[28px] shadow-[0_40px_90px_-40px_rgba(7,20,38,0.7)]">
              <Image
                src="/photos/celebrating-suit.jpg"
                alt={w.celebrateAlt}
                width={1600}
                height={900}
                sizes="(min-width: 1024px) 680px, 100vw"
                className="block h-auto w-full"
              />
              <div className="absolute right-[3%] top-[6%] hidden w-[38%] md:block">
                <ReportPanel />
              </div>
            </figure>
            <div className="mt-4 md:hidden">
              <ReportPanel />
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/** Compact "today" dashboard floating out of the boutique owner's laptop. */
function ShopDashboard() {
  const w = useWidgetCopy();
  const bars = [32, 46, 38, 58, 52, 70, 88];
  return (
    <div className="report-pop light-scope rounded-2xl border border-white/70 bg-white/90 p-3 text-[#071426] shadow-[0_30px_60px_-20px_rgba(7,20,38,0.6)] backdrop-blur-md">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5">
          <span className="grid h-5 w-5 place-items-center rounded-md bg-[#0d9488] text-[9px] font-bold text-white">L</span>
          <span className="text-[11px] font-semibold">{w.today}</span>
        </div>
        <span className="flex items-center gap-1 rounded-full bg-[#ccfbf1] px-1.5 py-0.5 text-[9px] font-semibold text-[#0d9488]">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#0d9488]" />
          {w.live}
        </span>
      </div>
      <div className="mt-2 grid grid-cols-2 gap-1.5">
        <div className="rounded-lg bg-[#f6f8fb] px-2 py-1.5">
          <p className="text-[9px] uppercase tracking-wide text-[#5b6678]">{w.sales}</p>
          <p className="text-[13px] font-semibold tabular-nums">MUR 48,250</p>
          <p className="text-[9px] font-semibold text-[#0d9488]">{w.vsThu}</p>
        </div>
        <div className="rounded-lg bg-[#f6f8fb] px-2 py-1.5">
          <p className="text-[9px] uppercase tracking-wide text-[#5b6678]">{w.margin}</p>
          <p className="text-[13px] font-semibold tabular-nums">41%</p>
          <p className="text-[9px] text-[#5b6678]">{w.vatDueAmount}</p>
        </div>
      </div>
      <div className="mt-2 flex h-10 items-end gap-1">
        {bars.map((height, index) => (
          <span
            key={index}
            className="bar-breathe flex-1 rounded-t-[3px] bg-gradient-to-t from-[#0d9488] to-[#5eead4]"
            style={{ height: `${height}%`, animationDelay: `${index * 0.15}s` }}
          />
        ))}
      </div>
      <div className="mt-2 flex items-center gap-1.5 rounded-lg bg-[#fef3c7] px-2 py-1 text-[10px] font-medium text-[#b45309]">
        <span>⚠</span>
        <span className="truncate">{w.lowStock}</span>
      </div>
    </div>
  );
}

function ReportPanel() {
  const w = useWidgetCopy();
  const rows = [
    [w.sales, "122,600"],
    [w.spend, "91,900"],
    [w.vat, "5,085"],
    [w.payroll, "141,600"],
  ];
  return (
    <div className="report-pop light-scope rounded-2xl border border-white/70 bg-white/90 p-3.5 text-[#071426] shadow-[0_30px_60px_-20px_rgba(7,20,38,0.6)] backdrop-blur-md">
      <div className="flex items-center gap-2">
        <span className="grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-coral text-[9px] font-bold text-white">PDF</span>
        <div className="min-w-0 flex-1">
          <p className="truncate text-[12px] font-semibold">{w.report}</p>
          <p className="text-[10px] text-[#5b6678]">{w.reportMeta}</p>
        </div>
        <span className="grid h-6 w-6 place-items-center rounded-full bg-[#0d9488] text-white">
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <path d="m5 12 5 5 9-10" />
          </svg>
        </span>
      </div>
      <div className="mt-2.5 h-1 overflow-hidden rounded-full bg-[#e3e8ef]">
        <span className="progress-loop block h-full rounded-full bg-[#0d9488]" />
      </div>
      <div className="mt-2.5 flex flex-col">
        {rows.map(([label, value], index) => (
          <div
            key={label}
            className="cell-fill flex items-center justify-between border-b border-dashed border-[#e3e8ef] py-1 text-[11px] last:border-0"
            style={{ "--d": `${300 + index * 160}ms` } as CSSProperties}
          >
            <span className="text-[#5b6678]">{label}</span>
            <span className="font-semibold tabular-nums">MUR {value}</span>
          </div>
        ))}
      </div>
      <div className="mt-2 flex h-8 items-end gap-1">
        {[40, 55, 48, 66, 60, 78, 92].map((height, index) => (
          <span
            key={index}
            className="bar-breathe flex-1 rounded-t-[3px] bg-gradient-to-t from-[#0d9488] to-[#14b8a6]"
            style={{ height: `${height}%`, animationDelay: `${index * 0.15}s` }}
          />
        ))}
      </div>
      <div className="mt-2.5 grid grid-cols-2 gap-1.5 text-[10px] font-semibold">
        <span className="rounded-lg bg-[#071426] py-1.5 text-center text-white">{w.download}</span>
        <span className="rounded-lg border border-[#e3e8ef] bg-white py-1.5 text-center">Excel</span>
      </div>
    </div>
  );
}
