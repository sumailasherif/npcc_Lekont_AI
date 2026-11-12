"use client";

import Image from "next/image";
import Link from "next/link";
import type { CSSProperties } from "react";

import { Reveal, buttonLagoon } from "@/components/motion";
import type { Messages } from "@/lib/i18n";

/* ---------- "Built for the counter" photo strip (photos 2 and 12) ---------- */

export function BuiltFor({ copy }: { copy: Messages["hero"]["built"] }) {
  const photos = [
    { src: "/photos/owner-apron.jpg", alt: "A shop owner in an apron checking his phone at the counter", chips: [copy.chips[0], copy.chips[1]] },
    { src: "/photos/shop-open.jpg", alt: "A café owner holding a Yes, we're open sign behind her counter", chips: [copy.chips[2], copy.chips[3]] },
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
                height={933}
                sizes="(min-width: 768px) 560px, 100vw"
                className="aspect-[4/3] h-auto w-full object-cover transition duration-700 group-hover:scale-[1.04]"
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-night/70 via-night/10 to-transparent" aria-hidden />
              {photo.chips.map((chip, chipIndex) => (
                <span
                  key={chip}
                  className={`side-card float-y absolute rounded-full border border-white/60 bg-white/85 px-3.5 py-2 text-xs font-semibold text-night shadow-[0_18px_40px_-14px_rgba(7,20,38,0.6)] backdrop-blur-md ${
                    chipIndex === 0 ? "left-4 top-4 md:left-6 md:top-6" : "bottom-4 right-4 md:bottom-6 md:right-6"
                  }`}
                  style={{ animationDelay: `${index * 0.8 + chipIndex * 1.4}s` } as CSSProperties}
                >
                  {chip}
                </span>
              ))}
            </figure>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

/* ---------- Monthly report: celebrating owner + floating Lekont report panel ---------- */

export function AccountantShowcase({ copy }: { copy: Messages["hero"]["acct"] }) {
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
                alt="A business owner in a suit celebrating at his laptop after Lekont produced his monthly report"
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

function ReportPanel() {
  const rows = [
    ["Sales", "122,600"],
    ["Spend", "91,900"],
    ["VAT", "5,085"],
    ["Payroll", "141,600"],
  ];
  return (
    <div className="report-pop light-scope rounded-2xl border border-white/70 bg-white/90 p-3.5 text-[#071426] shadow-[0_30px_60px_-20px_rgba(7,20,38,0.6)] backdrop-blur-md">
      <div className="flex items-center gap-2">
        <span className="grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-coral text-[9px] font-bold text-white">PDF</span>
        <div className="min-w-0 flex-1">
          <p className="truncate text-[12px] font-semibold">October report.pdf</p>
          <p className="text-[10px] text-[#5b6678]">46 documents · 4 seconds</p>
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
        <span className="rounded-lg bg-[#071426] py-1.5 text-center text-white">Download PDF</span>
        <span className="rounded-lg border border-[#e3e8ef] bg-white py-1.5 text-center">Excel</span>
      </div>
    </div>
  );
}
