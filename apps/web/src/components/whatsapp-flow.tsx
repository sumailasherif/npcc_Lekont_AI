"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";

type Card =
  | "brief"
  | "invoice"
  | "approval"
  | "approved"
  | "pdf"
  | "concentration"
  | "dashboard"
  | "final";

type Line = {
  role: "user" | "bot" | "system";
  text: string;
  card?: Card;
};

const SCRIPT: Line[] = [
  { role: "bot", text: "Hi 👋 I'm Lekont. Ask me for the numbers, or tell me what happened today." },
  { role: "user", text: "board brief" },
  { role: "bot", text: "Board brief — November 2026", card: "brief" },
  { role: "user", text: "invoice Ramesh 2500" },
  { role: "bot", text: "Invoice draft for Ramesh at MUR 2,500.", card: "invoice" },
  { role: "bot", text: "Sent to the Head of Finance for approval (req-8f21).", card: "approval" },
  { role: "system", text: "A. Runghen · Head of Finance approved req-8f21", card: "approved" },
  { role: "bot", text: "Approved. The PDF is stamped and ready to send.", card: "pdf" },
  { role: "user", text: "supplier concentration risk" },
  { role: "bot", text: "Supplier concentration risk: HIGH", card: "concentration" },
  { role: "user", text: "show me the dashboard" },
  { role: "bot", text: "Live view, same numbers as the chat.", card: "dashboard" },
  { role: "bot", text: "Chat, PDF, dashboard, BI and approvals — one thread.", card: "final" },
];

const STAGES = [
  { label: "Capture", detail: "The owner messages in WhatsApp" },
  { label: "Structure", detail: "Invoice draft + PDF" },
  { label: "Analyse", detail: "Board brief and risk" },
  { label: "Decide", detail: "Head of Finance approves" },
  { label: "Act", detail: "Dashboard, export, audit" },
];

export function WhatsAppFlow() {
  const [visible, setVisible] = useState(1);
  const [playing, setPlaying] = useState(true);
  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!playing || visible >= SCRIPT.length) return;
    const timer = setTimeout(() => setVisible((value) => value + 1), 1700);
    return () => clearTimeout(timer);
  }, [playing, visible]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [visible]);

  const shown = SCRIPT.slice(0, visible);
  const stage = useMemo(() => {
    if (visible <= 2) return 0;
    if (visible <= 4) return 1;
    if (visible <= 5) return 2;
    if (visible <= 8) return 3;
    return 4;
  }, [visible]);

  const finished = visible >= SCRIPT.length;

  return (
    <div className="flex flex-col gap-5">
      <header className="animate-fade-up flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-[#94a3b8]">
            WhatsApp · end-to-end flow
          </p>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight text-[#0f172a]">
            One thread runs the business
          </h1>
          <p className="mt-1 max-w-2xl text-sm text-[#64748b]">
            Capture, structure, analyse, decide, act. The owner stays in WhatsApp;
            the Head of Finance approves what matters; the dashboard stays in sync.
          </p>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => {
              setVisible(1);
              setPlaying(true);
            }}
            className="rounded-xl border border-[#e2e8f0] bg-white px-3 py-2 text-xs font-medium text-[#475569] hover:border-[#c7d2fe] hover:text-[#4f46e5]"
          >
            Replay
          </button>
          <button
            type="button"
            onClick={() => setPlaying((value) => !value)}
            className="rounded-xl bg-[#0f172a] px-3 py-2 text-xs font-medium text-white hover:bg-[#1e293b]"
          >
            {playing ? "Pause" : finished ? "Replay" : "Play"}
          </button>
        </div>
      </header>

      <div className="grid gap-5 xl:grid-cols-[260px_380px_1fr]">
        <aside className="order-2 flex flex-col gap-3 xl:order-1">
          <div className="rounded-2xl border border-[#e6e8f0] bg-white p-4">
            <p className="text-[10px] font-semibold uppercase tracking-wide text-[#94a3b8]">
              The loop
            </p>
            <ol className="mt-3 flex flex-col gap-3">
              {STAGES.map((item, index) => {
                const active = index === stage;
                const done = index < stage;
                return (
                  <li key={item.label} className="flex gap-3">
                    <span
                      className={`mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full text-[10px] font-semibold transition ${
                        active
                          ? "bg-gradient-to-br from-[#4f46e5] to-[#7c3aed] text-white shadow-lg shadow-indigo-500/25"
                          : done
                            ? "bg-emerald-50 text-emerald-600"
                            : "bg-[#f1f5f9] text-[#94a3b8]"
                      }`}
                    >
                      {done ? "✓" : index + 1}
                    </span>
                    <div>
                      <p className={`text-xs font-semibold ${active ? "text-[#0f172a]" : "text-[#475569]"}`}>
                        {item.label}
                      </p>
                      <p className="text-[11px] leading-4 text-[#94a3b8]">{item.detail}</p>
                    </div>
                  </li>
                );
              })}
            </ol>
          </div>

          <div className="rounded-2xl border border-[#e6e8f0] bg-white p-4">
            <p className="text-[10px] font-semibold uppercase tracking-wide text-[#94a3b8]">
              Approval policy
            </p>
            <ul className="mt-2 flex flex-col gap-1.5 text-[11px] leading-4 text-[#475569]">
              <li>• Every invoice: Head of Finance.</li>
              <li>• Notebook posting ≥ MUR 1,000.</li>
              <li>• Sale ≥ MUR 5,000.</li>
              <li>• Rejection leaves the draft in review.</li>
            </ul>
          </div>

          <Link
            href="/whatsapp"
            className="rounded-2xl bg-[#0f172a] px-4 py-3 text-xs font-medium text-white transition hover:bg-[#1e293b]"
          >
            Open the live bot →
          </Link>
        </aside>

        <section className="order-1 xl:order-2">
          <div className="overflow-hidden rounded-[30px] border border-[#d1d5db] bg-[#0b141a] shadow-2xl">
            <div className="flex items-center gap-3 bg-[#075e54] px-4 py-3 text-white">
              <span className="grid h-9 w-9 place-items-center rounded-full bg-white/15 text-sm font-semibold">
                L
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold">Lekont Business</p>
                <p className="text-[10px] text-white/70">
                  {playing ? "typing…" : finished ? "online" : "paused"}
                </p>
              </div>
              <span className="text-xs text-white/60">⋯</span>
            </div>

            <div className="flex h-[560px] flex-col gap-2 overflow-y-auto bg-[#efeae2] p-3">
              <p className="mx-auto rounded-full bg-white/70 px-2 py-0.5 text-[9px] text-[#667781]">
                Today
              </p>
              {shown.map((line, index) => {
                if (line.role === "system") {
                  return (
                    <div key={index} className="animate-scale-in mx-auto max-w-[90%]">
                      <p className="rounded-full bg-[#d1f4cc] px-3 py-1 text-center text-[10px] font-medium text-[#075e54]">
                        {line.text}
                      </p>
                    </div>
                  );
                }
                const mine = line.role === "user";
                return (
                  <div key={index} className={`flex ${mine ? "justify-end" : "justify-start"}`}>
                    <div
                      className={`animate-fade-up max-w-[88%] rounded-lg px-3 py-2 text-[12px] leading-5 shadow-sm ${
                        mine
                          ? "rounded-br-none bg-[#d9fdd3] text-[#111b21]"
                          : "rounded-bl-none bg-white text-[#111b21]"
                      }`}
                    >
                      <p className="whitespace-pre-line">{line.text}</p>
                      {line.card ? <FlowCard card={line.card} active={index < visible - 1 || finished} /> : null}
                      <p className="mt-1 text-right text-[9px] text-[#667781]">
                        09:4{index % 10}
                        {mine ? " ✓✓" : ""}
                      </p>
                    </div>
                  </div>
                );
              })}
              {playing && !finished ? (
                <div className="flex justify-start">
                  <div className="flex gap-1 rounded-lg rounded-bl-none bg-white px-3 py-2">
                    {[0, 1, 2].map((dot) => (
                      <span
                        key={dot}
                        className="h-1.5 w-1.5 animate-bounce rounded-full bg-[#8696a0]"
                        style={{ animationDelay: `${dot * 120}ms` }}
                      />
                    ))}
                  </div>
                </div>
              ) : null}
              <div ref={bottomRef} />
            </div>

            <div className="flex items-center gap-2 bg-[#f0f2f5] px-3 py-2">
              <span className="grid h-8 w-8 place-items-center rounded-full text-[#54656f]">📎</span>
              <span className="flex-1 rounded-full bg-white px-4 py-2 text-[11px] text-[#8696a0]">
                Message
              </span>
              <span className="grid h-8 w-8 place-items-center rounded-full bg-[#25d366] text-white">➤</span>
            </div>
          </div>

          <div className="mt-3 flex justify-center gap-1.5">
            {SCRIPT.map((_, index) => (
              <button
                key={index}
                type="button"
                aria-label={`Go to step ${index + 1}`}
                onClick={() => {
                  setVisible(index + 1);
                  setPlaying(false);
                }}
                className={`h-1.5 rounded-full transition-all ${
                  index < visible ? "w-5 bg-[#4f46e5]" : "w-1.5 bg-[#cbd5e1]"
                }`}
              />
            ))}
          </div>
        </section>

        <section className="order-3 flex flex-col gap-3">
          <div className="animate-fade-up rounded-2xl border border-[#e6e8f0] bg-white p-4">
            <p className="text-[10px] font-semibold uppercase tracking-wide text-[#94a3b8]">
              Viewing as
            </p>
            <div className="mt-2 flex items-center gap-3">
              <span
                className={`grid h-10 w-10 place-items-center rounded-full text-xs font-semibold text-white ${
                  stage >= 3
                    ? "bg-gradient-to-br from-[#0d9488] to-[#059669]"
                    : "bg-gradient-to-br from-[#4f46e5] to-[#7c3aed]"
                }`}
              >
                {stage >= 3 ? "AR" : "SS"}
              </span>
              <div>
                <p className="text-sm font-semibold text-[#0f172a]">
                  {stage >= 3 ? "A. Runghen" : "S. Sumaila"}
                </p>
                <p className="text-[11px] text-[#64748b]">
                  {stage >= 3 ? "Head of Finance · approver" : "Owner · requester"}
                </p>
              </div>
            </div>
          </div>

          <div className="animate-fade-up delay-2 rounded-2xl border border-[#e6e8f0] bg-white p-4">
            <p className="text-[10px] font-semibold uppercase tracking-wide text-[#94a3b8]">
              What the bot produces
            </p>
            <div className="mt-2 grid grid-cols-2 gap-2">
              {["Chat", "Invoice PDF", "Dashboard", "BI answer", "Approvals", "Audit trail"].map(
                (item, index) => (
                  <span
                    key={item}
                    className="animate-fade-up rounded-lg bg-[#f8fafc] px-2.5 py-2 text-[11px] text-[#475569]"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    {item}
                  </span>
                ),
              )}
            </div>
          </div>

          <div className="rounded-2xl bg-gradient-to-br from-[#4f46e5] to-[#7c3aed] p-4 text-white">
            <p className="text-[10px] uppercase tracking-wide text-white/60">The mastermind</p>
            <p className="mt-1 text-sm leading-6 text-white/90">
              The assistant handles the routine. The finance lead keeps the judgment.
              Every number, draft and approval carries its source.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}

function FlowCard({ card, active }: { card: Card; active: boolean }) {
  if (card === "brief") {
    return (
      <div className="mt-2 flex flex-col gap-1 rounded-md border border-[#dbeafe] bg-[#eff6ff] p-2 text-[10px] text-[#1e3a8a]">
        {[
          ["Spend", "MUR 91,900"],
          ["Payroll", "63% of spend"],
          ["VAT", "MUR 5,085"],
          ["Supplier", "Island 43%"],
        ].map(([label, value]) => (
          <p key={label} className="flex justify-between gap-2">
            <span>{label}</span>
            <span className="font-semibold">{value}</span>
          </p>
        ))}
      </div>
    );
  }

  if (card === "invoice") {
    return (
      <div className="mt-2 flex items-center gap-2 rounded-md border border-[#e2e8f0] bg-white p-2 text-[10px]">
        <span className="grid h-9 w-7 place-items-center rounded bg-rose-50 text-[9px] font-bold text-rose-600">
          PDF
        </span>
        <div>
          <p className="font-semibold text-[#0f172a]">INV-2041 · Ramesh</p>
          <p className="text-[#64748b]">MUR 2,500 · draft</p>
        </div>
      </div>
    );
  }

  if (card === "approval") {
    return (
      <div className="mt-2 rounded-md border border-[#fde68a] bg-[#fffbeb] p-2 text-[10px] text-[#92400e]">
        <p className="font-semibold">Approval required · req-8f21</p>
        <p>Head of Finance · invoice over MUR 1,000</p>
        <div className="mt-1 flex gap-1">
          <span className="rounded bg-emerald-600 px-2 py-0.5 text-[9px] text-white">Approve</span>
          <span className="rounded border border-[#fde68a] px-2 py-0.5 text-[9px]">Reject</span>
        </div>
      </div>
    );
  }

  if (card === "approved") {
    return (
      <div className="mt-2 animate-scale-in rounded-md border border-[#bbf7d0] bg-[#f0fdf4] p-2 text-[10px] text-[#166534]">
        <p className="font-semibold">Approved by A. Runghen</p>
        <p>Comment: “Checked the PO.” Audit trail updated.</p>
      </div>
    );
  }

  if (card === "pdf") {
    return (
      <div className="mt-2 flex items-center gap-2 rounded-md border border-[#bbf7d0] bg-white p-2 text-[10px]">
        <span className="grid h-9 w-7 place-items-center rounded bg-emerald-50 text-[9px] font-bold text-emerald-600">
          PDF
        </span>
        <div>
          <p className="font-semibold text-[#0f172a]">INV-2041 · approved</p>
          <p className="text-[#64748b]">Stamped · ready to send</p>
        </div>
      </div>
    );
  }

  if (card === "concentration") {
    return (
      <div className="mt-2 rounded-md border border-rose-200 bg-rose-50 p-2 text-[10px] text-rose-700">
        <p className="font-semibold">HIGH · HHI 3,535</p>
        {[
          ["Island Packaging", 43],
          ["Port Logistics", 34],
          ["Moka Paper", 23],
        ].map(([name, share], index) => (
          <p key={String(name)} className="mt-1 flex items-center gap-2">
            <span className="w-24 truncate">{name}</span>
            <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-rose-100">
              <span
                className="grow-bar block h-full rounded-full bg-rose-500"
                style={{ width: `${share}%`, animationDelay: `${index * 100}ms` }}
              />
            </span>
            <span>{share}%</span>
          </p>
        ))}
      </div>
    );
  }

  if (card === "dashboard") {
    return (
      <div className="mt-2 grid grid-cols-2 gap-1 rounded-md border border-[#e2e8f0] bg-white p-2 text-[10px]">
        {[
          ["Spend", "91,900"],
          ["VAT", "5,085"],
          ["Payroll", "63%"],
          ["Readiness", "58/100"],
        ].map(([label, value]) => (
          <div key={label} className="rounded bg-[#f8fafc] p-1.5">
            <p className="text-[8px] uppercase text-[#94a3b8]">{label}</p>
            <p className="font-semibold text-[#0f172a]">{value}</p>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="mt-2 flex flex-wrap gap-1">
      {["Chat", "PDF", "Dashboard", "BI", "Approval"].map((item, index) => (
        <span
          key={item}
          className={`animate-fade-up rounded-full bg-[#eef2ff] px-2 py-0.5 text-[9px] text-[#4f46e5] ${
            active ? "" : "opacity-60"
          }`}
          style={{ animationDelay: `${index * 80}ms` }}
        >
          {item}
        </span>
      ))}
    </div>
  );
}
