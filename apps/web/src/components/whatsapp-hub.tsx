"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import type { CSSProperties } from "react";

import { Reveal } from "@/components/motion";
import type { Messages } from "@/lib/i18n";

type Hub = Messages["site"]["waHub"];

const NODE_ICONS = [
  // verified badge
  "M12 2l2.4 1.8 3-.2.9 2.9 2.5 1.7-.9 2.8.9 2.8-2.5 1.7-.9 2.9-3-.2L12 22l-2.4-1.8-3 .2-.9-2.9-2.5-1.7.9-2.8-.9-2.8 2.5-1.7.9-2.9 3 .2L12 2Zm-3 10 2 2 4-4",
  // team
  "M16 19v-1a4 4 0 0 0-8 0v1m4-8a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm6 8v-1a3 3 0 0 0-2-2.8M17 5.2a3 3 0 0 1 0 5.6",
  // bell
  "M6 16V11a6 6 0 1 1 12 0v5l2 2H4l2-2Zm4 4a2 2 0 0 0 4 0",
  // plug
  "M9 3v5m6-5v5M7 8h10v3a5 5 0 0 1-10 0V8Zm5 8v5",
  // pdf
  "M6 3h9l4 4v14H6V3Zm8 1v4h4M9 13h6M9 17h4",
  // camera
  "M4 8h3l2-3h6l2 3h3v12H4V8Zm8 9a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z",
];

const PALETTE = [
  ["#6ee7a0", "#25d366", "#128c7e"], // green
  ["#a5b4fc", "#6366f1", "#4338ca"], // indigo
  ["#fde68a", "#f59e0b", "#b45309"], // amber
  ["#ffb199", "#ff6b4a", "#c2410c"], // coral
  ["#7dd3fc", "#0ea5e9", "#0369a1"], // sky
  ["#f0abfc", "#d946ef", "#a21caf"], // orchid
];

function paint(index: number) {
  const [light, mid, deep] = PALETTE[index % PALETTE.length];
  return { "--c1": light, "--c2": mid, "--c3": deep } as CSSProperties;
}

/* Node anchors (percent of the stage) and where each connector meets the phone. */
const NODES: { x: number; y: number; side: "l" | "r" }[] = [
  { x: 13, y: 16, side: "l" },
  { x: 8, y: 50, side: "l" },
  { x: 13, y: 84, side: "l" },
  { x: 87, y: 16, side: "r" },
  { x: 92, y: 50, side: "r" },
  { x: 87, y: 84, side: "r" },
];

function connector(node: (typeof NODES)[number]) {
  const endX = node.side === "l" ? 22 : 78;
  const endY = 32 + (node.y / 100) * 30;
  const midX = (node.x + endX) / 2;
  return `M ${node.x} ${node.y} C ${midX} ${node.y}, ${midX} ${endY}, ${endX} ${endY}`;
}

/** Generic speech-bubble glyph (not a brand logo). */
function BubbleGlyph({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden>
      <path d="M12 3.5c-4.7 0-8.5 3.3-8.5 7.5 0 2.2 1.1 4.2 2.8 5.6L5.5 20.5l4.2-2.1c.7.2 1.5.3 2.3.3 4.7 0 8.5-3.3 8.5-7.5S16.7 3.5 12 3.5Z" fill="var(--c2, #25d366)" />
      <circle cx="8.6" cy="11" r="1.1" fill="white" />
      <circle cx="12" cy="11" r="1.1" fill="white" />
      <circle cx="15.4" cy="11" r="1.1" fill="white" />
    </svg>
  );
}

/** Loops the scripted chat: messages appear one by one, with a typing indicator before each bot reply. */
function useChatLoop(length: number) {
  const [step, setStep] = useState(0);
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      const frame = requestAnimationFrame(() => setStep(length * 2));
      return () => cancelAnimationFrame(frame);
    }
    // Two ticks per message (typing, then shown) plus a pause before restarting.
    const total = length * 2 + 3;
    const timer = window.setInterval(() => setStep((current) => (current + 1) % total), 900);
    return () => window.clearInterval(timer);
  }, [length]);
  return step;
}

function Phone({ chat, step }: { chat: Hub["chat"]; step: number }) {
  return (
    <div className="wa-phone-wrap">
      <div className="wa-phone">
        <div className="wa-phone-screen">
          <div className="flex items-center gap-2 bg-[#008069] px-3 pb-2.5 pt-6 text-white">
            <Image src="/brand/lekont-icon.svg" alt="Lekont" width={28} height={28} unoptimized className="h-7 w-7 rounded-full bg-white" />
            <div className="min-w-0 leading-tight">
              <p className="flex items-center gap-1 text-[12px] font-semibold">
                Lekont
                <svg width="11" height="11" viewBox="0 0 24 24" aria-hidden>
                  <circle cx="12" cy="12" r="10" fill="#25d366" />
                  <path d="m8 12 3 3 5-6" stroke="white" strokeWidth="2.6" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </p>
              <p className="text-[9px] text-white/75">online</p>
            </div>
          </div>
          <div className="wa-wallpaper flex flex-1 flex-col justify-end gap-1.5 p-2.5">
            {chat.map((message, index) => {
              const mine = message.from === "me";
              const shownAt = index * 2 + 1;
              const visible = step >= shownAt;
              const typing = !mine && step === shownAt - 1;
              return (
                <div key={index} className={`flex ${mine ? "justify-end" : "justify-start"}`}>
                  {typing ? (
                    <span className="flex gap-1 rounded-lg bg-white px-2.5 py-2 shadow-sm">
                      {[0, 1, 2].map((dot) => (
                        <span key={dot} className="typing-dot h-1 w-1 rounded-full bg-[#8696a0]" style={{ animationDelay: `${dot * 0.15}s` }} />
                      ))}
                    </span>
                  ) : (
                    <span
                      className={`max-w-[86%] rounded-lg px-2 py-1.5 text-[10px] leading-snug text-[#111b21] shadow-sm transition-all duration-500 ${
                        mine ? "rounded-tr-sm bg-[#d9fdd3]" : "rounded-tl-sm bg-white"
                      }`}
                      style={{
                        opacity: visible ? 1 : 0,
                        transform: visible ? "none" : `translateY(8px) scale(0.92)`,
                        transformOrigin: mine ? "right bottom" : "left bottom",
                      }}
                    >
                      {message.text}
                      <span className="ml-1.5 text-[8px] text-[#667781]">{mine ? "✓✓" : ""}</span>
                    </span>
                  )}
                </div>
              );
            })}
          </div>
          <div className="flex items-center gap-1.5 bg-[#f0f2f5] px-2 py-2">
            <span className="h-6 flex-1 rounded-full bg-white" />
            <span className="grid h-6 w-6 place-items-center rounded-full bg-[#00a884]">
              <svg width="10" height="10" viewBox="0 0 24 24" fill="white" aria-hidden>
                <path d="M3 20.5 21 12 3 3.5 3 10l12 2-12 2z" />
              </svg>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

const LEDGER = [
  { ref: "INV-0416", name: "Sun Packaging", amount: "1,150" },
  { ref: "INV-0417", name: "Chen Wholesale", amount: "4,830" },
  { ref: "INV-0418", name: "Island Fabrics", amount: "3,200" },
];

/** MacBook showing the Lekont web dashboard; reacts to the chat on the phone. */
function MacBook({ step, chatLength }: { step: number; chatLength: number }) {
  const invoiceIn = step >= 2; // the bot has drafted the invoice
  const salesIn = step >= Math.min(4, chatLength * 2); // the bot has answered today's sales
  const bars = [34, 48, 40, 58, 52, 66, salesIn ? 92 : 70];
  return (
    <div className="mac mac-float">
      <div className="mac-lid">
        <div className="mac-screen flex text-[#071426]">
          <div className="flex w-[13%] flex-col items-center gap-[7%] bg-[#071426] py-[4%]">
            <Image src="/brand/lekont-icon.svg" alt="Lekont" width={24} height={24} unoptimized className="aspect-square h-auto w-[56%] rounded-md" />
            {[0, 1, 2, 3, 4].map((dot) => (
              <span key={dot} className={`h-[3px] w-[42%] rounded-full ${dot === 0 ? "bg-[#5eead4]" : "bg-white/20"}`} />
            ))}
          </div>
          <div className="flex min-w-0 flex-1 flex-col gap-[3%] bg-[#f6f8fb] p-[3.5%]">
            <div className="flex items-center justify-between">
              <div className="min-w-0 leading-tight">
                <p className="text-[9px] font-semibold">Lekont · Today</p>
                <p className="truncate text-[6.5px] font-medium uppercase tracking-[0.12em] text-[#0d9488]">
                  Business automation &amp; intelligence
                </p>
              </div>
              <span className="flex items-center gap-1 rounded-full bg-[#ccfbf1] px-1.5 py-[1px] text-[7px] font-semibold text-[#0d9488]">
                <span className="h-1 w-1 animate-pulse rounded-full bg-[#0d9488]" />
                Live
              </span>
            </div>
            <div className="grid grid-cols-3 gap-[3%]">
              {[
                { label: "Sales", value: salesIn ? "48,250" : "41,900", tone: "text-[#0d9488]" },
                { label: "Invoices", value: invoiceIn ? "13" : "12", tone: "text-[#071426]" },
                { label: "VAT due", value: "6,290", tone: "text-[#b45309]" },
              ].map((kpi) => (
                <div key={kpi.label} className="rounded-md bg-white px-[8%] py-[6%] shadow-[0_1px_2px_rgba(7,20,38,0.08)]">
                  <p className="text-[6px] uppercase tracking-wide text-[#5b6678]">{kpi.label}</p>
                  <p className={`text-[10px] font-semibold tabular-nums transition-colors duration-500 ${kpi.tone}`}>{kpi.value}</p>
                </div>
              ))}
            </div>
            <div className="grid min-h-0 flex-1 grid-cols-[1.1fr_1fr] gap-[3%]">
              <div className="flex flex-col rounded-md bg-white p-[5%] shadow-[0_1px_2px_rgba(7,20,38,0.08)]">
                <p className="text-[7px] font-semibold text-[#5b6678]">Sales · 7 days</p>
                <div className="mt-auto flex h-[70%] items-end gap-[6%]">
                  {bars.map((height, index) => (
                    <span
                      key={index}
                      className={`flex-1 rounded-t-[2px] transition-all duration-700 ${
                        index === bars.length - 1
                          ? "bg-gradient-to-t from-[#ff6b4a] to-[#ffb199]"
                          : "bg-gradient-to-t from-[#0d9488] to-[#5eead4]"
                      }`}
                      style={{ height: `${height}%` }}
                    />
                  ))}
                </div>
              </div>
              <div className="flex flex-col gap-[4%] rounded-md bg-white p-[5%] shadow-[0_1px_2px_rgba(7,20,38,0.08)]">
                <p className="text-[7px] font-semibold text-[#5b6678]">Ledger</p>
                <div
                  className="flex items-center justify-between rounded-[3px] px-[4%] py-[2%] text-[7px] transition-all duration-500"
                  style={{
                    background: invoiceIn ? "#ccfbf1" : "transparent",
                    opacity: invoiceIn ? 1 : 0,
                    transform: invoiceIn ? "none" : "translateY(-4px)",
                  }}
                >
                  <span className="font-semibold">INV-0419 · Ramesh</span>
                  <span className="font-semibold tabular-nums text-[#0d9488]">2,500</span>
                </div>
                {LEDGER.map((row) => (
                  <div key={row.ref} className="flex items-center justify-between px-[4%] text-[7px] text-[#5b6678]">
                    <span className="truncate">
                      {row.ref} · {row.name}
                    </span>
                    <span className="tabular-nums text-[#071426]">{row.amount}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="mac-base" />
    </div>
  );
}

function Devices({ copy, step }: { copy: Hub; step: number }) {
  return (
    <div className="relative">
      <MacBook step={step} chatLength={copy.chat.length} />
      <div className="absolute -bottom-[14%] -right-[9%] origin-bottom-right scale-[0.62]">
        <Phone chat={copy.chat} step={step} />
      </div>
    </div>
  );
}

function Node({ title, body, index }: { title: string; body: string; index: number }) {
  return (
    <div className="flex flex-col items-center text-center">
      <span className="wa-icon float-y grid h-12 w-12 place-items-center" style={{ ...paint(index), animationDelay: `${index * 0.5}s` }}>
        <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <path d={NODE_ICONS[index % NODE_ICONS.length]} />
        </svg>
      </span>
      <p className="mt-2 text-sm font-semibold text-ink">{title}</p>
      <p className="max-w-[17ch] text-[11px] leading-4 text-muted">{body}</p>
    </div>
  );
}

export function WhatsAppHub({ copy }: { copy: Hub }) {
  const step = useChatLoop(copy.chat.length);
  return (
    <section className="mx-auto max-w-6xl px-4 pb-16 md:px-6">
      <div className="wa-hub relative isolate overflow-hidden rounded-[36px] px-5 py-14 md:px-10 lg:py-16">
        <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute -left-24 -top-24 h-80 w-80 rounded-full bg-[radial-gradient(closest-side,rgba(37,211,102,0.35),transparent)]" />
          <div className="absolute -bottom-32 right-0 h-96 w-96 rounded-full bg-[radial-gradient(closest-side,rgba(20,184,166,0.3),transparent)]" />
          <div className="wa-hub-dots absolute inset-0" />
        </div>

        <div className="grid items-center gap-10 lg:grid-cols-[0.75fr_1.25fr]">
          <Reveal>
            <span className="inline-flex items-center gap-2 rounded-full bg-[#25d366]/15 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] wa-eyebrow">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#25d366]" />
              {copy.eyebrow}
            </span>
            <h2 className="mt-4 text-balance text-3xl font-semibold tracking-tight text-ink md:text-5xl">
              {copy.title} <span className="wa-gradient-text">{copy.highlight}</span>
            </h2>
            <p className="mt-4 max-w-md text-pretty leading-7 text-muted">{copy.sub}</p>
            <a
              href="/try"
              className="mt-7 inline-flex items-center gap-2 rounded-xl bg-[#00a884] px-5 py-2.5 text-sm font-semibold text-white shadow-[0_12px_30px_-10px_rgba(0,168,132,0.8)] transition hover:-translate-y-0.5 hover:bg-[#029e7b]"
            >
              {copy.cta}
              <span aria-hidden>→</span>
            </a>
          </Reveal>

          {/* Desktop stage: phone in the middle, features wired to it */}
          <Reveal delay={150} className="relative mx-auto hidden aspect-[1.3/1] w-full max-w-[680px] md:block">
            <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 h-full w-full" aria-hidden>
              {NODES.map((node, index) => {
                const path = connector(node);
                return (
                  <g key={index}>
                    <path d={path} fill="none" stroke="rgba(18,140,126,0.25)" strokeWidth="1.4" vectorEffect="non-scaling-stroke" />
                    <path d={path} fill="none" stroke={PALETTE[index][1]} strokeWidth="1.4" strokeDasharray="3 6" className="dash-march" vectorEffect="non-scaling-stroke" />
                    <circle r="0.9" fill={PALETTE[index][1]} opacity="0">
                      <animateMotion dur="3.2s" begin={`${index * 0.55}s`} repeatCount="indefinite" path={path} />
                      <animate attributeName="opacity" values="0;1;1;0" keyTimes="0;0.1;0.85;1" dur="3.2s" begin={`${index * 0.55}s`} repeatCount="indefinite" />
                    </circle>
                  </g>
                );
              })}
            </svg>

            <div className="absolute left-1/2 top-[44%] w-[56%] -translate-x-1/2 -translate-y-1/2">
              <Devices copy={copy} step={step} />
            </div>

            {/* Floating chat-bubble orbs */}
            {[
              { className: "left-[24%] top-[3%] h-12 w-12", delay: "0s", color: 0 },
              { className: "right-[22%] top-[1%] h-10 w-10", delay: "1.2s", color: 4 },
              { className: "left-[30%] bottom-[8%] h-14 w-14", delay: "2.1s", color: 3 },
            ].map((orb) => (
              <span
                key={orb.className}
                aria-hidden
                className={`wa-orb float-y absolute grid place-items-center ${orb.className}`}
                style={{ ...paint(orb.color), animationDelay: orb.delay }}
              >
                <BubbleGlyph className="h-full w-full" />
              </span>
            ))}

            {copy.nodes.map((node, index) => (
              <div
                key={node.title}
                className="absolute w-36 -translate-x-1/2 -translate-y-1/2"
                style={{ left: `${NODES[index].x}%`, top: `${NODES[index].y}%` }}
              >
                <Reveal delay={250 + index * 120}>
                  <Node title={node.title} body={node.body} index={index} />
                </Reveal>
              </div>
            ))}
          </Reveal>

          {/* Mobile: phone, then features in a grid */}
          <div className="md:hidden">
            <div className="mx-auto w-[82%] pb-20 pt-2">
              <Devices copy={copy} step={step} />
            </div>
            <div className="mt-6 grid grid-cols-2 gap-x-3 gap-y-6">
              {copy.nodes.map((node, index) => (
                <Reveal key={node.title} delay={index * 80}>
                  <Node title={node.title} body={node.body} index={index} />
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
