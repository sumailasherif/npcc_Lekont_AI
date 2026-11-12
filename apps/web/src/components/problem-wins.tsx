"use client";

import type { CSSProperties } from "react";

import { Reveal, card } from "@/components/motion";
import type { Messages } from "@/lib/i18n";

type Story = Messages["story"];

const PROBLEM_ICONS = [
  // notebook
  "M6 3h11a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H6V3Zm0 0v18M9 8h6M9 12h6M9 16h3",
  // two languages / papers
  "M8 4h8l4 4v12H8V4Zm8 0v4h4M4 8v12h4",
  // bank / refused
  "M3 10 12 4l9 6M5 10v8m4-8v8m6-8v8m4-8v8M3 20h18",
];

/* ------------------------------------------------------- The problem */

export function ProblemSection({ copy }: { copy: Story["problem"] }) {
  return (
    <section className="mx-auto max-w-6xl px-4 pt-24 md:px-6">
      <Reveal className="mx-auto max-w-3xl text-center">
        <span className="inline-flex items-center gap-2 rounded-full bg-coral-soft px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-coral">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-coral" />
          {copy.eyebrow}
        </span>
        <h2 className="mt-4 text-balance text-3xl font-semibold tracking-tight md:text-5xl">{copy.title}</h2>
        <p className="mx-auto mt-4 max-w-2xl text-pretty text-muted md:text-lg">{copy.sub}</p>
      </Reveal>

      <div className="mt-12 grid gap-4 md:grid-cols-3">
        {copy.items.map((item, index) => (
          <Reveal key={item.title} delay={index * 120} className="h-full">
            <div className={`${card} group relative flex h-full flex-col overflow-hidden p-6`}>
              <span
                aria-hidden
                className="pointer-events-none absolute -right-12 -top-12 h-32 w-32 rounded-full bg-gradient-to-br from-coral/20 to-transparent transition duration-500 group-hover:scale-150"
              />
              <div className="relative flex items-center justify-between">
                <span className="grid h-10 w-10 place-items-center rounded-xl bg-coral-soft text-coral">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                    <path d={PROBLEM_ICONS[index % PROBLEM_ICONS.length]} />
                  </svg>
                </span>
                <span className="font-mono text-sm text-muted">{String(index + 1).padStart(2, "0")}</span>
              </div>
              <h3 className="relative mt-5 text-lg font-semibold">{item.title}</h3>
              <p className="relative mt-2 text-sm leading-6 text-muted">{item.body}</p>
              <p className="relative mt-auto pt-5">
                <span className="problem-cost inline-flex items-center gap-2 rounded-lg border border-coral/30 px-2.5 py-1.5 text-xs font-semibold text-coral">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" aria-hidden>
                    <path d="M12 8v5m0 3h.01" />
                    <circle cx="12" cy="12" r="9" />
                  </svg>
                  {item.cost}
                </span>
              </p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

/* --------------------------------------------------- Why Lekont wins */

function Mark({ value, highlight, delay }: { value: string; highlight: boolean; delay: number }) {
  const style = { "--d": `${delay}ms` } as CSSProperties;
  if (value === "yes") {
    return (
      <span
        className={`wins-check inline-grid h-6 w-6 place-items-center rounded-full ${
          highlight ? "bg-lagoon text-night shadow-[0_0_16px_rgba(20,184,166,0.6)]" : "bg-lagoon-wash text-lagoon-deep"
        }`}
        style={style}
        aria-label="yes"
      >
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <path d="m5 12 5 5 9-10" />
        </svg>
      </span>
    );
  }
  if (value === "no") {
    return (
      <span className="inline-grid h-6 w-6 place-items-center rounded-full bg-surface text-muted" aria-label="no">
        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" aria-hidden>
          <path d="M6 6l12 12M18 6 6 18" />
        </svg>
      </span>
    );
  }
  if (value === "partial") {
    return (
      <span className="inline-grid h-6 w-6 place-items-center rounded-full bg-sun-soft text-sun-ink" aria-label="partly">
        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" aria-hidden>
          <path d="M6 12h12" />
        </svg>
      </span>
    );
  }
  return (
    <span className={`text-sm ${highlight ? "font-semibold text-lagoon-deep" : "text-muted"}`}>{value}</span>
  );
}

export function WhyLekontWins({ copy }: { copy: Story["wins"] }) {
  const last = copy.columns.length - 1;
  return (
    <section className="mx-auto max-w-6xl px-4 pt-24 md:px-6">
      <Reveal className="mx-auto max-w-2xl text-center">
        <span className="text-xs font-semibold uppercase tracking-[0.2em] text-lagoon-deep">{copy.eyebrow}</span>
        <h2 className="mt-3 text-balance text-3xl font-semibold tracking-tight md:text-5xl">
          {copy.title} <span className="text-lagoon-deep">{copy.highlight}</span>
        </h2>
        <p className="mt-4 text-pretty text-muted md:text-lg">{copy.sub}</p>
      </Reveal>

      <div className="mt-12 grid gap-4 md:grid-cols-3">
        {copy.reasons.map((reason, index) => (
          <Reveal key={reason.title} delay={index * 120}>
            <div className="flex h-full gap-4 rounded-2xl border border-lagoon/25 bg-lagoon-wash p-5">
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-lagoon text-sm font-bold text-night">
                {index + 1}
              </span>
              <div>
                <p className="font-semibold">{reason.title}</p>
                <p className="mt-1 text-sm leading-6 text-muted">{reason.body}</p>
              </div>
            </div>
          </Reveal>
        ))}
      </div>

      <Reveal delay={120} className="mt-8">
        <div className={`${card} overflow-x-auto`}>
          <table className="w-full min-w-[640px] border-collapse text-left">
            <thead>
              <tr>
                <th className="sticky left-0 z-10 bg-card px-5 py-4 text-xs font-medium uppercase tracking-[0.14em] text-muted" />
                {copy.columns.map((column, index) => (
                  <th
                    key={column}
                    className={`px-4 py-4 text-center text-sm font-semibold ${
                      index === last ? "rounded-t-2xl bg-night text-white" : "text-muted"
                    }`}
                  >
                    {index === last ? (
                      <span className="inline-flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full bg-lagoon shadow-[0_0_10px_#14b8a6]" />
                        {column}
                      </span>
                    ) : (
                      column
                    )}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {copy.rows.map((row, rowIndex) => (
                <tr key={row.label} className="border-t border-line">
                  <th scope="row" className="sticky left-0 z-10 bg-card px-5 py-3.5 text-sm font-medium">
                    {row.label}
                  </th>
                  {row.values.map((value, index) => (
                    <td
                      key={index}
                      className={`px-4 py-3.5 text-center ${index === last ? "bg-lagoon/[0.08]" : ""}`}
                    >
                      <Mark value={value} highlight={index === last} delay={300 + rowIndex * 110} />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-3 flex flex-wrap items-center justify-center gap-4 text-xs text-muted">
          <span className="inline-flex items-center gap-1.5">
            <Mark value="partial" highlight={false} delay={0} /> {copy.partialLabel}
          </span>
        </p>
      </Reveal>
    </section>
  );
}
