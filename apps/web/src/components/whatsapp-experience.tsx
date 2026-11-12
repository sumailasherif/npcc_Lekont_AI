"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import type { CSSProperties, ReactNode } from "react";

import { useLanguage } from "@/components/language-provider";

import { PageHero, buttonGhost, buttonPrimary, card } from "@/components/motion";
import { FLOW_STAGES, TYPE_MS, useAutoplayChat } from "@/components/whatsapp-autoplay";
import { WhatsAppHub } from "@/components/whatsapp-hub";
import { NotebookPhoto, type LedgerLine } from "@/components/notebook-photo";
import {
  API_BASE,
  apiGet,
  apiPost,
  type WhatsAppMessage,
  type WhatsAppReply,
} from "@/lib/api";

const PHONE = "23050000000";

const QUICK = [
  "invoice Ramesh 2500",
  "how much did I sell this month?",
  "what is low in stock?",
  "sold 3 bags at 250",
  "remind me to call the supplier Friday",
];

const WELCOME_TEXT = `Hi 👋 I'm Lekont, your back office on WhatsApp. Invoices, payslips and your numbers, all from this chat.

🧾 Invoices: "invoice Ramesh 2500" and I draft it, ready to send as a PDF
📊 Know your numbers: sales, spend, VAT and profit, with a live dashboard
💸 Sales and stock: "sold 3 bags at 250", "what is low in stock?"
👥 Payslips: prepare your team's monthly pay in minutes
📥 Imports: send an Excel, CSV or CRM export and I'll bring it in
📤 Exports: PDF, CSV or Excel, whenever you need them
📒 Your notebook: snap a page and I'll read it for you

Just type what you need. Nothing is saved until you confirm.`;

const WELCOME: WhatsAppMessage = {
  id: "welcome",
  direction: "out",
  from_number: PHONE,
  text: WELCOME_TEXT,
  intent: "greeting",
  created_at: new Date().toISOString(),
  data: null,
};

const FEATURES: { title: string; detail: string; icon: string }[] = [
  { title: "Invoices", detail: "“invoice Ramesh 2500” → a draft, ready as PDF", icon: "M6 3h9l4 4v14H6V3Zm8 1v4h4M9 13h6M9 17h4" },
  { title: "Business intelligence", detail: "sales, spend, VAT and profit with a live dashboard", icon: "M4 19V9m5 10V5m5 14v-7m5 7V7" },
  { title: "Sales and stock", detail: "record a sale, see what is running low", icon: "M4 8l8-4 8 4v8l-8 4-8-4V8Zm0 0 8 4 8-4M12 12v8" },
  { title: "Payslips", detail: "prepare the team's monthly pay", icon: "M4 6h16v12H4V6Zm0 4h16M8 15h3" },
  { title: "Imports and exports", detail: "Excel, CSV and CRM exports in; PDF, CSV and Excel out", icon: "M12 3v12m0 0-4-4m4 4 4-4M4 17v2a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-2" },
  { title: "Notebook photo", detail: "send a page, Lekont reads it and asks before saving", icon: "M4 7h3l2-3h6l2 3h3v13H4V7Zm8 10a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z" },
];

/**
 * The WhatsApp experience in two modes:
 * - "demo" (/whatsapp): the conversation plays itself as an animated flow; nothing is clickable.
 * - "live" (/try): the visitor types to the real bot engine through the API.
 */
export function WhatsAppExperience({ mode }: { mode: "demo" | "live" }) {
  const live = mode === "live";
  const { t } = useLanguage();
  const [messages, setMessages] = useState<WhatsAppMessage[]>([WELCOME]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const autoplay = useAutoplayChat(!live);

  useEffect(() => {
    if (!live) return;
    apiGet<WhatsAppMessage[]>("/api/v1/whatsapp/messages")
      .then((data) => {
        if (data.length > 0) setMessages(data);
      })
      .catch(() => setError("API not reachable. Start it on port 8010."));
  }, [live]);

  async function send(text: string, kind: "text" | "image" = "text") {
    if (sending) return;
    if (kind === "text" && !text.trim()) return;
    setSending(true);
    setError(null);
    setInput("");
    try {
      const reply = await apiPost<WhatsAppReply>("/api/v1/whatsapp/simulate", {
        from_number: PHONE,
        text,
        kind,
      });
      await new Promise((resolve) => setTimeout(resolve, 420));
      setMessages(reply.messages);
    } catch {
      setError("The bot did not answer. Check the API and try again.");
    } finally {
      setSending(false);
    }
  }

  async function reset() {
    try {
      await fetch(`${API_BASE}/api/v1/whatsapp/reset`, { method: "POST" });
      setMessages([WELCOME]);
    } catch {
      setError("Could not reset the conversation.");
    }
  }

  const chat: ChatProps = live
    ? { messages, sending, input, setInput, send }
    : {
        messages: autoplay.messages,
        sending: autoplay.sending,
        input: autoplay.input,
        setInput: () => {},
        send: async () => {},
        demo: true,
      };

  return (
    <>
      {live ? (
        <PageHero
          compact
          eyebrow="Try it live · WhatsApp chatbot"
          title="Talk to Lekont"
          highlight="yourself."
          description="This is the real bot engine. Type your own request, tap a suggestion, or send a notebook photo and see what comes back."
          actions={
            <button type="button" onClick={() => void reset()} className={buttonGhost}>
              Reset conversation
            </button>
          }
        />
      ) : (
        <PageHero
          compact
          eyebrow="Business automation and intelligence · on WhatsApp"
          title="Run the business"
          highlight="from a chat."
          description="Watch one morning in the shop: an invoice, a notebook photo, an approval, the month's numbers and the daily report, all in one thread."
          actions={
            <Link href="/try" className={buttonPrimary}>
              Try it live yourself
            </Link>
          }
        />
      )}

      {/* Device stage */}
      <section id="simulator" className="relative z-10 mx-auto -mt-20 max-w-6xl scroll-mt-24 px-4 md:px-6">
        {error ? (
          <p className="mx-auto mb-4 max-w-xl rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-center text-sm text-rose-700">
            {error}
          </p>
        ) : null}
        {live ? null : <FlowStages stage={autoplay.stage} />}
        <div className="relative grid items-center gap-8 pb-16 lg:grid-cols-[1fr_340px_1fr] lg:gap-10">
          <FloatingDecor />
          <SideCards side="left" />
          <div className="relative z-10 mx-auto w-full max-w-[340px]">
            <IPhone {...chat} />
          </div>
          <SideCards side="right" />
        </div>
      </section>

      {/* Everything on WhatsApp: animated hub (tour page only) */}
      {live ? null : <WhatsAppHub copy={t.site.waHub} />}

      {/* What the bot handles */}
      <section className="mx-auto max-w-6xl px-4 pb-24 md:px-6">
        <div className={`${card} p-6`}>
          <h2 className="text-base font-semibold">What the bot handles</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map((feature) => (
              <div key={feature.title} className="card-lift group flex gap-3 rounded-2xl border border-line bg-surface p-4">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[#00a884]/10 text-[#008069] transition group-hover:bg-[#00a884] group-hover:text-white">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                    <path d={feature.icon} />
                  </svg>
                </span>
                <span>
                  <span className="block text-sm font-semibold">{feature.title}</span>
                  <span className="mt-0.5 block text-xs leading-5 text-muted">{feature.detail}</span>
                </span>
              </div>
            ))}
          </div>
        </div>

      </section>
    </>
  );
}

/* ---------- Flow stages above the phone (demo mode) ---------- */

function FlowStages({ stage }: { stage: number }) {
  return (
    <ol className="relative z-20 mx-auto mb-8 flex max-w-3xl flex-wrap items-center justify-center gap-2" aria-label="Flow">
      {FLOW_STAGES.map((label, index) => {
        const state = index < stage ? "done" : index === stage ? "active" : "next";
        return (
          <li key={label} className="flex items-center gap-2">
            <span
              className={`flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-xs font-semibold shadow-sm backdrop-blur transition-all duration-500 ${
                state === "active"
                  ? "scale-105 border-[#00a884] bg-[#00a884] text-white shadow-[0_10px_24px_-10px_rgba(0,168,132,0.9)]"
                  : state === "done"
                    ? "border-[#00a884]/40 bg-card text-[#008069]"
                    : "border-line bg-card/80 text-muted"
              }`}
            >
              <span
                className={`grid h-4 w-4 place-items-center rounded-full text-[9px] ${
                  state === "next" ? "bg-surface text-muted" : state === "active" ? "bg-white text-[#008069]" : "bg-[#00a884] text-white"
                }`}
              >
                {state === "done" ? "✓" : index + 1}
              </span>
              {label}
            </span>
            {index < FLOW_STAGES.length - 1 ? (
              <span className={`hidden h-px w-5 transition-colors duration-500 sm:block ${index < stage ? "bg-[#00a884]" : "bg-line"}`} />
            ) : null}
          </li>
        );
      })}
    </ol>
  );
}

type ChatProps = {
  demo?: boolean;
  messages: WhatsAppMessage[];
  sending: boolean;
  input: string;
  setInput: (value: string) => void;
  send: (text: string, kind?: "text" | "image") => Promise<void>;
};

/* ---------- Floating 3D-style emoji and chips around the devices ---------- */

const FLOATERS: { content: string; className: string; delay: string; chip?: boolean }[] = [
  { content: "📊", className: "left-[calc(50%-235px)] top-[4%] h-14 w-14 text-2xl", delay: "0s" },
  { content: "⚙️", className: "right-[calc(50%-225px)] top-[10%] h-12 w-12 text-xl", delay: "1.8s" },
  { content: "🧾", className: "left-[calc(50%-225px)] bottom-[14%] hidden h-12 w-12 text-xl sm:grid", delay: "1.2s" },
  { content: "💹", className: "right-[calc(50%-240px)] bottom-[22%] hidden h-14 w-14 text-2xl sm:grid", delay: "2.4s" },
  { content: "📈", className: "left-[calc(50%-24px)] -top-6 hidden h-12 w-12 text-xl lg:grid", delay: "0.6s" },
];

function FloatingDecor() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 z-20">
      {FLOATERS.map((item) =>
        item.chip ? (
          <span
            key={item.content}
            className={`float-y absolute items-center gap-1.5 rounded-full border border-white/60 bg-card/80 px-3.5 py-2 text-xs font-semibold text-ink shadow-[0_18px_40px_-14px_rgba(7,20,38,0.45)] backdrop-blur-md ${item.className}`}
            style={{ animationDelay: item.delay }}
          >
            {item.content}
          </span>
        ) : (
          <span
            key={item.content}
            className={`emoji-orb float-y absolute grid place-items-center rounded-full ${item.className}`}
            style={{ animationDelay: item.delay }}
          >
            <span className="drop-shadow-[0_6px_8px_rgba(0,0,0,0.25)]">{item.content}</span>
          </span>
        ),
      )}
    </div>
  );
}

/* ---------- Shared chat thread ---------- */

function ChatThread({
  messages,
  sending,
  size = "phone",
}: {
  messages: WhatsAppMessage[];
  sending: boolean;
  size?: "phone" | "desktop";
}) {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const node = ref.current;
    if (node) node.scrollTo({ top: node.scrollHeight, behavior: "smooth" });
  }, [messages, sending]);

  const text = size === "desktop" ? "text-[12px] leading-[17px]" : "text-[13px] leading-[18px]";

  return (
    <div
      ref={ref}
      className={`wa-wallpaper flex min-h-0 flex-1 flex-col gap-1.5 overflow-y-auto py-3 ${size === "desktop" ? "px-[6%]" : "px-3"}`}
    >
      <span className="mx-auto mb-1 rounded-lg bg-card/90 px-3 py-1 text-[10px] font-medium uppercase tracking-wide text-[#54656f] shadow-sm">
        Today
      </span>
      <p className="mx-auto mb-2 max-w-[92%] rounded-lg bg-[#ffeecd] px-3 py-1.5 text-center text-[10px] leading-4 text-[#54656f] shadow-sm">
        🔒 Synthetic demo. Messages stay on this machine; no real customer data.
      </p>
      {messages.map((message, index) => {
        const outgoing = message.direction === "in"; // "in" = sent by the owner to the bot
        const prev = messages[index - 1];
        const first = !prev || prev.direction !== message.direction;
        return (
          <div key={message.id} className={`flex ${outgoing ? "justify-end" : "justify-start"} ${first ? "mt-1.5" : ""}`}>
            <div
              className={`relative max-w-[85%] rounded-xl px-2.5 pb-1.5 pt-1.5 ${text} text-[#111b21] shadow-[0_1px_0.5px_rgba(11,20,26,0.13)] ${
                outgoing ? "bubble-in-right bg-[#d9fdd3]" : "bubble-in-left bg-card"
              } ${first ? (outgoing ? "rounded-tr-none" : "rounded-tl-none") : ""}`}
            >
              {first ? <Tail outgoing={outgoing} /> : null}
              {message.text === "[photo]" ? (
                <NotebookPhoto
                  lines={photoLines(messages, index)}
                  heading="Notebook · today"
                  className="-mx-1 -mt-0.5 mb-1 w-[230px] max-w-full rounded-lg"
                />
              ) : (
                <p className="whitespace-pre-line">{message.text}</p>
              )}
              <DataCard data={message.data} />
              <p
                suppressHydrationWarning
                className="-mb-0.5 mt-0.5 flex items-center justify-end gap-1 text-[10px] text-[#667781]"
              >
                {new Date(message.created_at).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })}
                {outgoing ? (
                  <svg width="16" height="11" viewBox="0 0 16 11" aria-label="Read">
                    <path d="m1 6 3 3 6-7M6 9l1 1 6-8" fill="none" stroke="#53bdeb" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                ) : null}
              </p>
            </div>
          </div>
        );
      })}
      {sending ? (
        <div className="mt-1.5 flex justify-start">
          <div className="bubble-in-left relative flex items-center gap-1 rounded-xl rounded-tl-none bg-card px-3.5 py-3 shadow-[0_1px_0.5px_rgba(11,20,26,0.13)]">
            <Tail outgoing={false} />
            {[0, 1, 2].map((dot) => (
              <span key={dot} className="typing-dot h-2 w-2 rounded-full bg-[#8696a0]" style={{ animationDelay: `${dot * 160}ms` }} />
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}

/** Lines the bot read from this photo (from its reply), so the picture matches the answer. */
function photoLines(messages: WhatsAppMessage[], index: number): LedgerLine[] {
  for (const reply of messages.slice(index + 1)) {
    const notebook = (reply.data?.notebook ?? null) as { lines?: LedgerLine[] } | null;
    if (notebook?.lines?.length) return notebook.lines;
    if (reply.direction === "in") break;
  }
  return [
    { date: "11/11", description: "Sugar 5 kg", amount: 425 },
    { date: "11/11", description: "Milk 12 packs", amount: 960 },
    { date: "12/11", description: "Transport", amount: 300 },
  ];
}

function Tail({ outgoing }: { outgoing: boolean }) {
  return (
    <svg
      viewBox="0 0 8 13"
      width="8"
      height="13"
      className={`absolute top-0 ${outgoing ? "-right-2 text-[#d9fdd3]" : "-left-2 -scale-x-100 text-white"}`}
      aria-hidden
    >
      <path fill="currentColor" d="M0 0h8L1.5 9.5C.9 10.4 0 10 0 9V0Z" />
    </svg>
  );
}

function QuickReplies({ send, sending }: Pick<ChatProps, "send" | "sending">) {
  return (
    <div className="flex gap-1.5 overflow-x-auto bg-[#efeae2] px-3 pb-2 pt-1 [scrollbar-width:none]">
      {QUICK.map((item) => (
        <button
          key={item}
          type="button"
          onClick={() => void send(item)}
          disabled={sending}
          className="shrink-0 rounded-full border border-[#00a884]/30 bg-card px-3 py-1.5 text-[11px] font-medium text-[#008069] shadow-sm transition hover:-translate-y-0.5 hover:bg-[#00a884] hover:text-white disabled:opacity-50"
        >
          {item}
        </button>
      ))}
    </div>
  );
}

function Composer({
  input,
  setInput,
  send,
  sending,
  className = "",
  demo = false,
}: Omit<ChatProps, "messages"> & { className?: string }) {
  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        void send(input);
      }}
      className={`flex items-center gap-1.5 ${className}`}
    >
      <div className="flex min-w-0 flex-1 items-center gap-1 rounded-full bg-card px-2 py-1 shadow-sm">
        <span className="grid h-8 w-8 place-items-center text-[#54656f]" aria-hidden>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"><circle cx="12" cy="12" r="9" /><path d="M8.5 14.5a4.5 4.5 0 0 0 7 0M9 9.5h.01M15 9.5h.01" /></svg>
        </span>
        {demo ? (
          <span className="flex min-w-0 flex-1 items-center overflow-hidden py-1.5 text-sm text-[#111b21]" aria-hidden>
            {input ? (
              <span
                key={input}
                className="demo-type whitespace-nowrap"
                style={{ "--n": input.length, animationDuration: `${input.length * TYPE_MS}ms` } as CSSProperties}
              >
                {input}
              </span>
            ) : (
              <span className="text-[#8696a0]">Message</span>
            )}
          </span>
        ) : (
          <input
            value={input}
            onChange={(event) => setInput(event.target.value)}
            placeholder="Message"
            aria-label="Message"
            className="min-w-0 flex-1 bg-transparent py-1.5 text-sm text-[#111b21] outline-none placeholder:text-[#8696a0]"
          />
        )}
        <button
          type="button"
          onClick={() => void send("", "image")}
          title="Send a notebook photo"
          aria-label="Send a notebook photo"
          className="grid h-8 w-8 place-items-center rounded-full text-[#54656f] transition hover:bg-[#f0f2f5]"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round"><path d="M4 7h3l2-3h6l2 3h3v13H4V7Z" /><circle cx="12" cy="13" r="4" /></svg>
        </button>
      </div>
      <button
        type="submit"
        disabled={sending || !input.trim()}
        aria-label="Send"
        className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[#00a884] text-white shadow-md transition hover:scale-105 hover:bg-[#008069] disabled:scale-100 disabled:opacity-60"
      >
        <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor"><path d="M3 20l18-8L3 4v6l12 2-12 2v6Z" /></svg>
      </button>
    </form>
  );
}

function BusinessName({ className = "" }: { className?: string }) {
  return (
    <span className={`flex items-center gap-1 truncate font-semibold leading-tight ${className}`}>
      Lekont Business
      <svg width="14" height="14" viewBox="0 0 24 24" aria-label="Verified business" className="shrink-0">
        <path fill="#25d366" d="m12 1 2.6 2.2 3.4-.4.9 3.3 3 1.7-1.2 3.2 1.2 3.2-3 1.7-.9 3.3-3.4-.4L12 23l-2.6-2.2-3.4.4-.9-3.3-3-1.7L3.3 13 2.1 9.8l3-1.7.9-3.3 3.4.4L12 1Z" />
        <path d="m8 12 3 3 5-6" stroke="#fff" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </span>
  );
}

function Avatar({ size, ring }: { size: number; ring: string }) {
  return (
    <span className="relative shrink-0">
      <Image
        src="/brand/lekont-icon.svg"
        alt=""
        width={size}
        height={size}
        unoptimized
        className="rounded-full"
        style={{ width: size, height: size }}
      />
      <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 bg-[#25d366]" style={{ borderColor: ring }} />
    </span>
  );
}

function StatusIcons() {
  return (
    <span className="flex items-center gap-1" aria-hidden>
      <svg width="16" height="10" viewBox="0 0 16 10" fill="currentColor"><rect x="0" y="6" width="3" height="4" rx="1" /><rect x="4.5" y="4" width="3" height="6" rx="1" /><rect x="9" y="2" width="3" height="8" rx="1" /><rect x="13" y="0" width="3" height="10" rx="1" /></svg>
      <svg width="22" height="11" viewBox="0 0 22 11" fill="none"><rect x="0.5" y="0.5" width="19" height="10" rx="3" stroke="currentColor" /><rect x="2" y="2" width="14" height="7" rx="1.5" fill="currentColor" /><rect x="20.5" y="3.5" width="1.5" height="4" rx="0.75" fill="currentColor" /></svg>
    </span>
  );
}

/* ---------- iPhone ---------- */

function IPhone(chat: ChatProps) {
  const { messages, sending } = chat;
  return (
    <div className="relative">
      <div className="animate-glow pointer-events-none absolute -inset-10 -z-10 rounded-[70px] bg-[radial-gradient(closest-side,rgba(0,168,132,0.38),transparent)] blur-2xl" aria-hidden />
      {/* side buttons */}
      <span className="absolute -left-[3px] top-[110px] h-7 w-[3px] rounded-l bg-[#9aa3ad]" aria-hidden />
      <span className="absolute -left-[3px] top-[150px] h-12 w-[3px] rounded-l bg-[#9aa3ad]" aria-hidden />
      <span className="absolute -left-[3px] top-[206px] h-12 w-[3px] rounded-l bg-[#9aa3ad]" aria-hidden />
      <span className="absolute -right-[3px] top-[170px] h-16 w-[3px] rounded-r bg-[#9aa3ad]" aria-hidden />

      {/* titanium frame */}
      <div className="rounded-[54px] bg-[linear-gradient(145deg,#d9dde2,#7d858f_35%,#c9ced4_60%,#6b737c)] p-[3px] shadow-[0_60px_100px_-30px_rgba(7,20,38,0.65),0_30px_60px_-30px_rgba(0,0,0,0.5)]">
        <div className="rounded-[51px] bg-[#0b0f14] p-[9px]">
          <div className="light-scope relative flex h-[620px] flex-col overflow-hidden rounded-[43px] bg-[#efeae2] md:h-[600px]">
            <div className="bg-[#008069] text-white">
              <div className="relative flex h-11 items-end justify-between px-7 pb-1.5 text-[12px] font-semibold">
                <span>12:06</span>
                <span className="absolute left-1/2 top-2.5 h-[26px] w-[92px] -translate-x-1/2 rounded-full bg-black" aria-hidden />
                <StatusIcons />
              </div>
              <div className="flex items-center gap-2.5 px-3 pb-3 pt-1">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden><path d="m15 18-6-6 6-6" /></svg>
                <Avatar size={36} ring="#008069" />
                <div className="min-w-0 flex-1">
                  <BusinessName className="text-[15px]" />
                  <p className="text-[11px] text-white/80">{sending ? "typing…" : "online"}</p>
                </div>
                <span className="flex items-center gap-4 pr-1 text-white/90" aria-hidden>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="3" y="6" width="13" height="12" rx="2" /><path d="m16 10 5-3v10l-5-3" /></svg>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2Z" /></svg>
                </span>
              </div>
            </div>
            <ChatThread messages={messages} sending={sending} />
            {chat.demo ? null : <QuickReplies send={chat.send} sending={sending} />}
            <Composer {...chat} className={`bg-[#efeae2] px-2 pb-7 ${chat.demo ? "pointer-events-none" : ""}`} />
            <span className="absolute bottom-2 left-1/2 h-1 w-28 -translate-x-1/2 rounded-full bg-black/80" aria-hidden />
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------- Animated capability cards beside the iPhone ---------- */

function SideCards({ side }: { side: "left" | "right" }) {
  const cards = side === "left" ? [<InvoiceCard key="i" />, <DashboardCard key="d" />, <PayslipCard key="p" />] : [<ImportCard key="x" />, <CrmCard key="c" />, <NotebookCard key="n" />];
  return (
    <div className={`relative z-10 hidden flex-col gap-5 lg:flex ${side === "left" ? "items-end" : "items-start"}`}>
      {cards.map((content, index) => (
        <div
          key={index}
          className={`side-card float-y relative w-full max-w-[260px] ${index === 1 ? (side === "left" ? "-mr-6" : "-ml-6") : ""}`}
          style={{ animationDelay: `${index * 1.3 + (side === "right" ? 0.6 : 0)}s` }}
        >
          <span
            aria-hidden
            className={`connector absolute top-1/2 h-px w-10 ${side === "left" ? "-right-10" : "-left-10"}`}
          />
          {content}
        </div>
      ))}
    </div>
  );
}

function SideShell({ icon, title, meta, children }: { icon: string; title: string; meta: string; children: ReactNode }) {
  return (
    <div className="rounded-2xl border border-white/70 bg-card/85 p-3.5 shadow-[0_24px_50px_-24px_rgba(7,20,38,0.45)] backdrop-blur-md">
      <div className="flex items-center gap-2.5">
        <span className="grid h-8 w-8 shrink-0 place-items-center rounded-xl bg-[#00a884]/10 text-base">{icon}</span>
        <div className="min-w-0">
          <p className="truncate text-[13px] font-semibold text-ink">{title}</p>
          <p className="truncate text-[11px] text-muted">{meta}</p>
        </div>
      </div>
      <div className="mt-3">{children}</div>
    </div>
  );
}

function InvoiceCard() {
  return (
    <SideShell icon="🧾" title="Invoice INV-0418" meta="Ramesh Traders · MUR 2,500">
      <div className="flex items-center gap-2">
        <span className="pdf-pop rounded-md bg-coral px-1.5 py-0.5 text-[10px] font-bold text-white">PDF</span>
        <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-line">
          <span className="progress-loop block h-full rounded-full bg-coral" />
        </span>
        <span className="text-[10px] font-semibold text-[#00a884]">ready</span>
      </div>
    </SideShell>
  );
}

function DashboardCard() {
  const bars = [38, 52, 44, 66, 58, 80, 92];
  return (
    <SideShell icon="📊" title="Know your numbers" meta="This month · MUR 91,900">
      <div className="flex h-14 items-end gap-1.5">
        {bars.map((height, index) => (
          <span
            key={index}
            className="bar-breathe flex-1 rounded-t-[4px] bg-gradient-to-t from-lagoon-deep to-lagoon"
            style={{ height: `${height}%`, animationDelay: `${index * 0.15}s` }}
          />
        ))}
      </div>
      <p className="mt-2 text-[11px] font-semibold text-[#00a884]">▲ 12% vs last month</p>
    </SideShell>
  );
}

function PayslipCard() {
  return (
    <SideShell icon="👥" title="Payslips · November" meta="6 employees · MUR 141,600">
      <div className="flex -space-x-1">
        {["AR", "MB", "KJ", "SP", "NL", "DV"].map((initials, index) => (
          <span
            key={initials}
            className="avatar-pop grid h-7 w-7 place-items-center rounded-full border-2 border-white text-[9px] font-bold text-white"
            style={{ background: ["#0d9488", "#ff6b4a", "#6366f1", "#f59e0b", "#0c1f3a", "#14b8a6"][index], animationDelay: `${index * 0.25}s` }}
          >
            {initials}
          </span>
        ))}
        <span className="ml-3 self-center pl-3 text-[11px] font-semibold text-ink">ready to review</span>
      </div>
    </SideShell>
  );
}

function ImportCard() {
  return (
    <SideShell icon="📥" title="Importing sales.xlsx" meta="Excel · 248 rows">
      <div className="h-1.5 overflow-hidden rounded-full bg-line">
        <span className="progress-loop block h-full rounded-full bg-[#00a884]" />
      </div>
      <div className="mt-2 flex gap-1.5 text-[10px] font-semibold">
        {["XLSX", "CSV", "PDF"].map((format) => (
          <span key={format} className="rounded-md border border-line bg-surface px-1.5 py-0.5 text-muted">
            {format}
          </span>
        ))}
      </div>
    </SideShell>
  );
}

function CrmCard() {
  return (
    <SideShell icon="🔄" title="CRM contacts synced" meta="1,204 customers · just now">
      <div className="flex items-center gap-2 text-[11px] text-muted">
        <span className="relative flex h-2.5 w-2.5">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#00a884] opacity-60" />
          <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-[#00a884]" />
        </span>
        Live sync with your CRM and spreadsheets
      </div>
    </SideShell>
  );
}

function NotebookCard() {
  return (
    <SideShell icon="📒" title="Notebook page read" meta="5 lines · MUR 3,450">
      <div className="relative overflow-hidden rounded-lg bg-[#fffbeb] px-2.5 py-2">
        <span aria-hidden className="note-scan" />
        {["3 sacs riz · 750", "Huile 2L · 420", "Savon x6 · 180"].map((line) => (
          <p key={line} className="border-b border-dashed border-sun/40 py-0.5 font-mono text-[10px] text-[#5b4a2a] last:border-0">
            {line}
          </p>
        ))}
      </div>
    </SideShell>
  );
}

function DataCard({ data }: { data: Record<string, unknown> | null }) {
  if (!data) return null;

  const sale = data.sale as { item: string; qty: number; total: number } | undefined;
  if (sale) {
    return (
      <div className="mt-1.5 overflow-hidden rounded-lg border border-[#00a884]/25 bg-[#f7fdfb] text-[11px]">
        <p className="flex items-center gap-1.5 bg-[#00a884] px-2.5 py-1 font-semibold text-white">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="m5 12 5 5 9-10" /></svg>
          Sale recorded
        </p>
        <div className="flex items-center justify-between gap-3 px-2.5 py-1.5 text-[#3b4a54]">
          <span>{sale.qty} × {sale.item}</span>
          <span className="font-semibold tabular-nums text-[#111b21]">MUR {sale.total.toLocaleString("en-GB")}</span>
        </div>
      </div>
    );
  }

  const notebook = data.notebook as { lines: { description: string; amount: number }[]; total: number } | undefined;
  if (notebook) {
    return (
      <div className="mt-1.5 overflow-hidden rounded-lg border border-sun/40 bg-[#fffbeb] text-[11px] text-[#5b4a2a]">
        <p className="flex items-center justify-between bg-sun-soft px-2.5 py-1 font-semibold">
          Notebook preview
          <span className="rounded-full bg-sun px-1.5 text-[9px] text-white">needs review</span>
        </p>
        <div className="px-2.5 py-1.5 font-mono">
          {notebook.lines.map((line) => (
            <p key={line.description} className="flex justify-between gap-2 border-b border-dashed border-sun/30 py-0.5 last:border-0">
              <span className="truncate">{line.description}</span>
              <span className="tabular-nums">{line.amount}</span>
            </p>
          ))}
          <p className="mt-1 flex justify-between border-t border-sun/40 pt-1 font-semibold">
            <span>Total</span>
            <span className="tabular-nums">MUR {notebook.total}</span>
          </p>
        </div>
        <p className="px-2.5 pb-1.5 italic">Reply “post” to add these sales.</p>
      </div>
    );
  }

  const stock = data.stock as { name: string; qty: number }[] | undefined;
  if (Array.isArray(stock)) {
    const max = Math.max(...stock.map((item) => item.qty), 1);
    return (
      <div className="mt-1.5 flex flex-col gap-1 rounded-lg border border-line bg-surface p-2 text-[11px] text-[#3b4a54]">
        {stock.slice(0, 4).map((item) => (
          <div key={item.name} className="grid grid-cols-[1fr_auto] items-center gap-x-2">
            <span className="truncate">{item.name}</span>
            <span className="font-semibold tabular-nums text-[#111b21]">{item.qty}</span>
            <span className="col-span-2 h-1 overflow-hidden rounded-full bg-card">
              <span
                className={`grow-bar block h-full rounded-full ${item.qty / max < 0.3 ? "bg-coral" : "bg-[#00a884]"}`}
                style={{ width: `${Math.max((item.qty / max) * 100, 4)}%` }}
              />
            </span>
          </div>
        ))}
      </div>
    );
  }

  return null;
}
