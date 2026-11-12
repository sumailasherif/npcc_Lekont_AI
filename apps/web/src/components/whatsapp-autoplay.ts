"use client";

import { useEffect, useState } from "react";

import type { WhatsAppMessage } from "@/lib/api";

/** One scripted turn: the owner types (or sends a photo), then the bot answers. */
type Turn = { stage: number; user: string; bot: string };

export const FLOW_STAGES = ["Capture", "Read", "Approve", "Analyse", "Report"];

const WELCOME =
  "Hi 👋 I'm Lekont, your business automation and intelligence assistant. Tell me what happened today, or ask for your numbers.";

const TURNS: Turn[] = [
  {
    stage: 0,
    user: "invoice Ramesh 2500",
    bot: "🧾 Invoice INV-0419 drafted for Ramesh · MUR 2,500.\nSent to the Head of Finance for approval.",
  },
  {
    stage: 1,
    user: "[photo]",
    bot: "📒 I read 3 lines from your notebook:\n• Sugar 5 kg · MUR 425\n• Milk 12 packs · MUR 960\n• Transport · MUR 300\nReply YES to save them.",
  },
  {
    stage: 2,
    user: "YES",
    bot: "✅ Saved to your ledger after your approval. Today's spend: MUR 1,685.",
  },
  {
    stage: 3,
    user: "how much did I sell this month?",
    bot: "📊 November so far: MUR 122,600 in sales, up 9% on October. Best day: Saturday.\n⚠ Sugar runs out in about 4 days at this pace.",
  },
  {
    stage: 4,
    user: "send me the daily report",
    bot: "📄 Daily report · 12 Nov.pdf is ready: sales, spend, VAT and stock in one page.",
  },
];

const PHONE = "23050000000";

function message(id: string, direction: "in" | "out", text: string): WhatsAppMessage {
  return { id, direction, from_number: PHONE, text, intent: "demo", created_at: new Date().toISOString(), data: null };
}

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Plays the scripted conversation on a loop: the message is typed into the composer,
 * sent, the bot "types", then replies. Read-only: nothing is sent to the API.
 */
export function useAutoplayChat(enabled: boolean) {
  const [messages, setMessages] = useState<WhatsAppMessage[]>(() => [message("welcome", "out", WELCOME)]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [stage, setStage] = useState(-1);

  useEffect(() => {
    if (!enabled) return;
    let cancelled = false;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    async function play() {
      while (!cancelled) {
        await wait(0);
        if (cancelled) return;
        setMessages([message("welcome", "out", WELCOME)]);
        setStage(-1);
        await wait(1600);
        for (const [index, turn] of TURNS.entries()) {
          if (cancelled) return;
          setStage(turn.stage);
          if (turn.user !== "[photo]" && !reduce) {
            for (let i = 1; i <= turn.user.length; i += 1) {
              if (cancelled) return;
              setInput(turn.user.slice(0, i));
              await wait(55);
            }
            await wait(350);
          }
          setInput("");
          setMessages((current) => [...current, message(`u${index}`, "in", turn.user)]);
          await wait(500);
          setSending(true);
          await wait(1300);
          if (cancelled) return;
          setSending(false);
          setMessages((current) => [...current, message(`b${index}`, "out", turn.bot)]);
          await wait(2600);
        }
        await wait(3000);
      }
    }

    void play();
    return () => {
      cancelled = true;
    };
  }, [enabled]);

  return { messages, input, sending, stage };
}
