"use client";

import { useEffect, useState } from "react";

import type { WaCopy } from "@/components/whatsapp-copy";
import type { WhatsAppMessage } from "@/lib/api";

const PHONE = "23050000000";

/** Milliseconds per typed character in the composer animation. */
export const TYPE_MS = 55;

// Fixed timestamp for the prerendered first frame: cacheComponents forbids new Date() during render.
const INITIAL_AT = "2026-01-01T09:41:00Z";

function message(id: string, direction: "in" | "out", text: string, at?: string): WhatsAppMessage {
  return { id, direction, from_number: PHONE, text, intent: "demo", created_at: at ?? new Date().toISOString(), data: null };
}

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Plays the scripted conversation on a loop: the message is typed into the composer,
 * sent, the bot "types", then replies. Read-only: nothing is sent to the API.
 */
export function useAutoplayChat(enabled: boolean, script: WaCopy["script"]) {
  const [messages, setMessages] = useState<WhatsAppMessage[]>(() => [message("welcome", "out", script.welcome, INITIAL_AT)]);
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
        setMessages([message("welcome", "out", script.welcome)]);
        setStage(-1);
        await wait(1600);
        for (const [index, [user, bot]] of script.turns.entries()) {
          if (cancelled) return;
          setStage(index);
          if (user !== "[photo]" && !reduce) {
            // One state change per message; the composer animates the typing in CSS
            // (re-rendering the page per character froze the browser).
            setInput(user);
            await wait(user.length * TYPE_MS + 450);
            if (cancelled) return;
          }
          setInput("");
          setMessages((current) => [...current, message(`u${index}`, "in", user)]);
          await wait(500);
          setSending(true);
          await wait(1300);
          if (cancelled) return;
          setSending(false);
          setMessages((current) => [...current, message(`b${index}`, "out", bot)]);
          await wait(2600);
        }
        await wait(3000);
      }
    }

    void play();
    return () => {
      cancelled = true;
    };
    // Restart the script when the language changes.
  }, [enabled, script]);

  return { messages, input, sending, stage };
}
