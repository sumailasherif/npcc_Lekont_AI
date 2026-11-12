"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import type { CSSProperties } from "react";

import { HeroBackdrop, Reveal, buttonPrimary } from "@/components/motion";
import { NotebookPhoto, type LedgerLine } from "@/components/notebook-photo";
import { ScreenComposite } from "@/components/screen-composite";
import type { Messages } from "@/lib/i18n";

/**
 * Overview value proposition: WhatsApp is the front door to Lekont.
 * A mini phone plays a scripted conversation on a loop and links to /whatsapp.
 */
export function WhatsAppTeaser({ copy }: { copy: Messages["hero"]["wa"] }) {
  return (
    <section className="mx-auto max-w-6xl px-4 pt-24 md:px-6">
      <Reveal>
        <div className="relative isolate overflow-hidden rounded-[32px] bg-night px-6 py-12 text-white md:px-12 md:py-16">
          <HeroBackdrop />
          <div className="pointer-events-none absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-[#00a884]/25 blur-3xl" aria-hidden />
          <div className="relative grid items-center gap-12 lg:grid-cols-[1.1fr_0.9fr]">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full border border-[#25d366]/30 bg-[#25d366]/10 px-3 py-1 text-xs font-semibold text-[#7ee2a8]">
                <span className="h-1.5 w-1.5 rounded-full bg-[#25d366] animate-pulse-soft" />
                {copy.eyebrow}
              </span>
              <h2 className="mt-5 text-balance text-4xl font-semibold tracking-tight md:text-5xl">
                {copy.title} <span className="text-gradient">{copy.highlight}</span>
              </h2>
              <p className="mt-5 max-w-xl text-pretty text-base leading-7 text-slate-300 md:text-lg">{copy.sub}</p>
              <ul className="mt-6 flex flex-wrap gap-2">
                {copy.points.map((point) => (
                  <li
                    key={point}
                    className="flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-slate-200"
                  >
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#25d366" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                      <path d="m5 12 5 5 9-10" />
                    </svg>
                    {point}
                  </li>
                ))}
              </ul>
              <Link href="/whatsapp" className={`${buttonPrimary} mt-8 !bg-[#25d366] hover:!bg-[#3ee07b]`}>
                {copy.cta}
              </Link>
            </div>
            <Link href="/whatsapp" aria-label={copy.cta} className="group mx-auto block w-full max-w-[400px]">
              <MiniPhone script={copy.script} />
            </Link>
          </div>
        </div>
      </Reveal>
    </section>
  );
}

const STEP_MS = 1700;

/** Photo 1 (hand holding a blank iPhone) with the scripted Lekont chat composited onto its screen. */
function MiniPhone({ script }: { script: ScriptLine[] }) {
  return (
    <div className="relative transition duration-500 group-hover:-translate-y-2">
      <div className="pointer-events-none absolute -inset-6 -z-10 rounded-[40px] bg-[radial-gradient(closest-side,rgba(37,211,102,0.35),transparent)] blur-2xl" aria-hidden />
      <div className="relative aspect-[4/5] rotate-[-2deg] overflow-hidden rounded-[28px] bg-white shadow-[0_40px_80px_-30px_rgba(0,0,0,0.8)] ring-1 ring-white/20">
        <ScreenComposite
          src="/photos/hand-phone.jpg"
          alt="A hand holding a phone with the Lekont WhatsApp chat open"
          width={1400}
          height={1400}
          quad={[
            [33.57, 8.86],
            [69.0, 9.29],
            [68.21, 86.29],
            [32.71, 85.93],
          ]}
          screen={{ width: 360, height: 784 }}
          radius={34}
          className="origin-[51%_45%] scale-[1.6]"
        >
          <ChatScreen script={script} />
        </ScreenComposite>
      </div>
    </div>
  );
}

function ChatScreen({ script }: { script: ScriptLine[] }) {
  const [shown, setShown] = useState(2);
  const [typing, setTyping] = useState(false);
  const listRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      const frame = requestAnimationFrame(() => setShown(script.length));
      return () => cancelAnimationFrame(frame);
    }
    let step = 2;
    let timer: ReturnType<typeof setTimeout>;
    const tick = () => {
      if (step >= script.length) {
        timer = setTimeout(() => {
          step = 0;
          setShown(0);
          timer = setTimeout(tick, 500);
        }, 4500);
        return;
      }
      const next = script[step];
      if (next.from === "bot") {
        setTyping(true);
        timer = setTimeout(() => {
          setTyping(false);
          step += 1;
          setShown(step);
          timer = setTimeout(tick, next.kind ? 3400 : STEP_MS);
        }, 900);
      } else {
        step += 1;
        setShown(step);
        timer = setTimeout(tick, next.kind === "photo" ? 1400 : 700);
      }
    };
    timer = setTimeout(tick, 1400);
    return () => clearTimeout(timer);
  }, [script]);

  useEffect(() => {
    const node = listRef.current;
    if (node) node.scrollTo({ top: node.scrollHeight, behavior: "smooth" });
  }, [shown, typing]);

  return (
    <div className="relative flex h-full flex-col bg-[#efeae2]">
      {/* notch, redrawn over our screen */}
      <span className="absolute left-1/2 top-0 z-10 h-[30px] w-[52%] -translate-x-1/2 rounded-b-[18px] bg-black" aria-hidden />
      <div className="bg-[#008069] px-4 pb-3 pt-11 text-white">
        <div className="flex items-center gap-2.5">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden><path d="m15 18-6-6 6-6" /></svg>
          <Image src="/brand/lekont-icon.svg" alt="" width={38} height={38} unoptimized className="h-[38px] w-[38px] rounded-full" />
          <div className="min-w-0">
            <p className="truncate text-[17px] font-semibold leading-tight">Lekont Business</p>
            <p className="text-[12px] text-white/80">{typing ? "typing…" : "online"}</p>
          </div>
        </div>
      </div>
      <div ref={listRef} className="wa-wallpaper flex flex-1 flex-col gap-2 overflow-hidden px-3 py-4">
        {script.slice(0, shown).map((line, index) => (
          <div key={`${index}-${line.text}`} className={`flex ${line.from === "me" ? "justify-end" : "justify-start"}`}>
            <Bubble line={line} />
          </div>
        ))}
        {typing ? (
          <div className="flex justify-start">
            <span className="bubble-in-left flex gap-1 rounded-2xl rounded-tl-none bg-white px-3.5 py-3 shadow-sm">
              {[0, 1, 2].map((dot) => (
                <span key={dot} className="typing-dot h-2 w-2 rounded-full bg-[#8696a0]" style={{ animationDelay: `${dot * 160}ms` }} />
              ))}
            </span>
          </div>
        ) : null}
      </div>
      <div className="flex items-center gap-2 bg-[#efeae2] px-3 pb-7 pt-1">
        <span className="flex-1 rounded-full bg-white px-4 py-2.5 text-[14px] text-[#8696a0] shadow-sm">Message</span>
        <span className="grid h-11 w-11 place-items-center rounded-full bg-[#00a884] text-white" aria-hidden>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M3 20l18-8L3 4v6l12 2-12 2v6Z" /></svg>
        </span>
      </div>
    </div>
  );
}

/* ---------- Rich messages for the notebook story ---------- */

type ScriptLine = Messages["hero"]["wa"]["script"][number];

const PAGE_LINES: (LedgerLine & { confidence: number })[] = [
  { date: "12/11", description: "3 sak diri 25kg", amount: 750, confidence: 0.97 },
  { date: "12/11", description: "2 lwil 2L", amount: 420, confidence: 0.96 },
  { date: "12/11", description: "6 savon", amount: 180, confidence: 0.94 },
  { date: "12/11", description: "12 lait UHT", amount: 660, confidence: 0.95 },
  { date: "12/11", description: "Ramesh", amount: 1440, note: "krédi", confidence: 0.82 },
];

function Bubble({ line }: { line: ScriptLine }) {
  const mine = line.from === "me";
  const base = `bubble-in-${mine ? "right" : "left"} max-w-[86%] rounded-2xl shadow-[0_1px_0.5px_rgba(11,20,26,0.13)] ${
    mine ? "rounded-tr-none bg-[#d9fdd3]" : "rounded-tl-none bg-white"
  }`;

  if (line.kind === "photo") {
    return (
      <div className={`${base} w-[240px] shrink-0 p-1`}>
        <NotebookPhoto lines={PAGE_LINES} className="rounded-xl" />
        <p className="px-1.5 pb-0.5 pt-1.5 text-[15px] leading-[20px] text-[#111b21]">{line.text}</p>
      </div>
    );
  }

  if (line.kind === "ledger") {
    return (
      <div className={`${base} px-3 py-2 text-[#111b21]`}>
        <p className="text-[15px] leading-[21px]">📒 {line.text}</p>
        <div className="mt-2 overflow-hidden rounded-xl border border-[#e3e8ef] text-[13px]">
          {PAGE_LINES.map((row) => {
            const check = row.confidence < 0.9;
            return (
              <div key={row.description} className={`flex items-center gap-2 border-b border-[#eef1f5] px-2.5 py-1.5 last:border-0 ${check ? "bg-[#fef3c7]" : ""}`}>
                <span className={`grid h-4 w-4 shrink-0 place-items-center rounded-full text-[9px] font-bold text-white ${check ? "bg-[#f59e0b]" : "bg-[#00a884]"}`}>
                  {check ? "!" : "✓"}
                </span>
                <span className="min-w-0 flex-1 truncate">
                  {row.description}
                  {row.note ? <span className="text-[#b45309]"> · {row.note}</span> : null}
                </span>
                <span className="font-semibold tabular-nums">{row.amount.toLocaleString("en-GB")}</span>
                <span className={`w-9 text-right font-mono text-[11px] ${check ? "text-[#b45309]" : "text-[#667781]"}`}>{Math.round(row.confidence * 100)}%</span>
              </div>
            );
          })}
          <div className="flex justify-between bg-[#f6f8fb] px-2.5 py-1.5 font-semibold">
            <span>Total</span>
            <span className="tabular-nums">MUR 3,450</span>
          </div>
        </div>
        <p className="mt-1.5 text-[13px] text-[#667781]">Reply “post” to save, or correct a line.</p>
      </div>
    );
  }

  if (line.kind === "logged") {
    const writes = [
      ["Sales", "4 entries", "+ MUR 2,010"],
      ["Receivables", "Ramesh", "+ MUR 1,440"],
      ["Stock", "rice −3 · oil −2 · soap −6 · milk −12", ""],
    ];
    return (
      <div className={`${base} px-3 py-2 text-[#111b21]`}>
        <p className="text-[15px] font-semibold leading-[21px]">{line.text}</p>
        <div className="mt-2 flex flex-col gap-1.5">
          {writes.map(([table, detail, value], index) => (
            <div
              key={table}
              className="cell-fill flex items-center gap-2 rounded-lg bg-[#f0fdf9] px-2.5 py-1.5 text-[13px]"
              style={{ "--d": `${150 + index * 180}ms` } as CSSProperties}
            >
              <span className="rounded bg-[#0d9488] px-1.5 py-0.5 font-mono text-[10px] font-semibold uppercase text-white">{table}</span>
              <span className="min-w-0 flex-1 truncate text-[#3b4a54]">{detail}</span>
              {value ? <span className="font-semibold tabular-nums">{value}</span> : null}
            </div>
          ))}
        </div>
        <p className="mt-1.5 text-[12px] text-[#667781]">Today: MUR 3,450 sales · stock and debts updated</p>
      </div>
    );
  }

  if (line.kind === "report") {
    return (
      <div className={`${base} w-[78%] overflow-hidden p-1`}>
        <div className="rounded-xl bg-[#f6f8fb] p-2.5">
          <div className="flex h-[70px] items-end gap-1.5 rounded-lg bg-white p-2 shadow-sm">
            {[38, 52, 46, 70, 64, 88].map((height, index) => (
              <span key={index} className="flex-1 rounded-t-[3px] bg-gradient-to-t from-[#0d9488] to-[#14b8a6]" style={{ height: `${height}%` }} />
            ))}
          </div>
        </div>
        <div className="flex items-center gap-2.5 px-2 py-2">
          <span className="grid h-9 w-8 shrink-0 place-items-center rounded-md bg-[#ff6b4a] text-[10px] font-bold text-white">PDF</span>
          <div className="min-w-0">
            <p className="truncate text-[14px] font-semibold text-[#111b21]">{line.text}</p>
            <p className="text-[12px] text-[#667781]">2 pages · PDF · 84 kB</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <p className={`${base} px-3 py-2 text-[15px] leading-[21px] text-[#111b21]`}>{line.text}</p>
  );
}
