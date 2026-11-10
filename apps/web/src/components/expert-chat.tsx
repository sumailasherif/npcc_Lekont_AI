"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

import {
  API_BASE,
  apiGet,
  apiPost,
  type Expert,
  type ExpertAnswer,
  type ExpertCitation,
  type Language,
} from "@/lib/api";

type Message = {
  role: "user" | "assistant";
  content: string;
  source?: string;
  citations?: ExpertCitation[];
  engine?: string;
  reviewRequired?: boolean;
  confidence?: number;
  suggested?: string[];
};

const LANGUAGES: { id: Language; label: string }[] = [
  { id: "en", label: "EN" },
  { id: "fr", label: "FR" },
  { id: "cr", label: "Kreol" },
];

export function ExpertChat({ id }: { id: string }) {
  const [expert, setExpert] = useState<Expert | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [language, setLanguage] = useState<Language>("en");
  const [busy, setBusy] = useState(false);
  const [translating, setTranslating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!id) return;
    apiGet<Expert>(`/api/v1/experts/${id}`)
      .then(setExpert)
      .catch(() =>
        setError("This mind could not be loaded. Is the API running on port 8000?"),
      );
  }, [id]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, busy]);

  async function send(text: string) {
    if (!expert || busy) return;
    const question = text.trim();
    if (question.length < 2) return;

    setError(null);
    setInput("");
    const nextMessages: Message[] = [
      ...messages,
      { role: "user", content: question },
    ];
    setMessages(nextMessages);
    setBusy(true);

    try {
      const answer = await apiPost<ExpertAnswer>(
        `/api/v1/experts/${expert.id}/chat`,
        {
          message: question,
          language,
          history: nextMessages.slice(-6).map((message) => ({
            role: message.role,
            content: message.content,
          })),
        },
      );
      setMessages((current) => [
        ...current,
        {
          role: "assistant",
          content: answer.answer,
          source: answer.source_answer,
          citations: answer.citations,
          engine: answer.engine,
          reviewRequired: answer.review_required,
          confidence: answer.confidence,
          suggested: answer.suggested,
        },
      ]);
    } catch {
      setError("No answer came back. Check that the API is running and try again.");
    } finally {
      setBusy(false);
    }
  }

  async function switchLanguage(next: Language) {
    setLanguage(next);
    const last = messages[messages.length - 1];
    if (!last || last.role !== "assistant" || !last.source) return;

    if (next === "en") {
      replaceLast({ content: last.source, engine: "identity", reviewRequired: false });
      return;
    }

    setTranslating(true);
    try {
      const translated = await apiPost<{
        translated_text: string;
        engine: string;
        review_required: boolean;
      }>("/api/v1/translate", {
        text: last.source,
        target_language: next,
      });
      replaceLast({
        content: translated.translated_text,
        engine: translated.engine,
        reviewRequired: translated.review_required,
      });
    } catch {
      setError("Live translation failed. Try again.");
    } finally {
      setTranslating(false);
    }
  }

  function replaceLast(patch: Partial<Message>) {
    setMessages((current) => {
      if (current.length === 0) return current;
      const next = [...current];
      next[next.length - 1] = { ...next[next.length - 1], ...patch };
      return next;
    });
  }

  if (error && !expert) {
    return (
      <main className="mx-auto flex min-h-screen max-w-2xl flex-col items-center justify-center gap-4 px-6 text-center">
        <p className="text-sm text-red-300">{error}</p>
        <Link href="/" className="text-sm text-orange-300 underline">
          Back to discover
        </Link>
      </main>
    );
  }

  if (!expert) {
    return (
      <main className="mx-auto flex min-h-screen max-w-3xl items-center justify-center px-6">
        <div className="h-40 w-full animate-pulse rounded-3xl border border-white/10 bg-white/[0.03]" />
      </main>
    );
  }

  return (
    <div className="min-h-screen bg-[#08080a] text-zinc-100">
      <main className="mx-auto flex w-full max-w-3xl flex-col gap-6 px-5 pb-40 pt-8">
        <div className="flex items-center justify-between">
          <Link href="/" className="text-sm text-zinc-400 hover:text-zinc-100">
            ← Discover
          </Link>
          <div className="flex items-center gap-1 rounded-full bg-white/5 p-1">
            {LANGUAGES.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => void switchLanguage(item.id)}
                className={`rounded-full px-3 py-1 text-xs font-medium transition ${
                  language === item.id
                    ? "bg-white text-zinc-950"
                    : "text-zinc-400 hover:text-zinc-100"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        <header
          className="flex flex-col gap-3 rounded-3xl p-6"
          style={{ backgroundColor: expert.accent }}
        >
          <div className="flex items-center gap-3">
            <span className="grid h-12 w-12 place-items-center rounded-xl bg-black/20 text-lg font-semibold">
              {expert.initials}
            </span>
            <div>
              <h1 className="text-xl font-semibold leading-tight">{expert.name}</h1>
              <p className="text-sm opacity-80">
                {expert.role} · {expert.organisation}
              </p>
            </div>
          </div>
          <p className="text-sm leading-6 opacity-90">{expert.headline}</p>
          <div className="flex flex-wrap gap-2 text-[11px]">
            <span className="rounded-full bg-black/20 px-2 py-0.5">
              {expert.mauritian ? "Mauritius" : expert.country}
            </span>
            <span className="rounded-full bg-black/20 px-2 py-0.5">
              {expert.profile_type === "composite" ? "Composite profile" : "Public record"}
            </span>
            {expert.languages.map((lang) => (
              <span key={lang} className="rounded-full bg-black/20 px-2 py-0.5">
                {lang}
              </span>
            ))}
          </div>
        </header>

        {messages.length === 0 ? (
          <section className="flex flex-col gap-3">
            <p className="text-sm text-zinc-400">{expert.bio}</p>
            <span className="text-xs uppercase tracking-wide text-zinc-500">
              Suggested questions
            </span>
            <div className="flex flex-col gap-2">
              {expert.sample_questions.map((question) => (
                <button
                  key={question}
                  type="button"
                  onClick={() => void send(question)}
                  className="rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-left text-sm text-zinc-300 transition hover:border-white/25 hover:text-white"
                >
                  {question}
                </button>
              ))}
            </div>
          </section>
        ) : null}

        <section className="flex flex-col gap-4">
          {messages.map((message, index) => (
            <article
              key={`${message.role}-${index}`}
              className={`flex flex-col gap-2 rounded-2xl px-4 py-3 ${
                message.role === "user"
                  ? "ml-8 self-end bg-orange-500/90 text-white"
                  : "mr-8 self-start border border-white/10 bg-white/[0.04]"
              }`}
            >
              <p className="whitespace-pre-line text-sm leading-7">{message.content}</p>

              {message.role === "assistant" ? (
                <>
                  <div className="flex flex-wrap items-center gap-2 text-[11px] text-zinc-500">
                    {typeof message.confidence === "number" ? (
                      <span>confidence {Math.round(message.confidence * 100)}%</span>
                    ) : null}
                    {message.engine ? <span>engine {message.engine}</span> : null}
                    {message.reviewRequired ? (
                      <span className="rounded-full bg-amber-500/15 px-2 py-0.5 text-amber-300">
                        machine translation · review
                      </span>
                    ) : null}
                    {translating ? <span>translating…</span> : null}
                  </div>

                  {message.citations && message.citations.length > 0 ? (
                    <ul className="flex flex-col gap-1 border-t border-white/10 pt-2">
                      {message.citations.map((citation) => (
                        <li key={citation.card_id} className="text-[11px] text-zinc-500">
                          <span className="font-mono text-zinc-400">
                            {citation.title}
                          </span>{" "}
                          · {citation.source}
                          {citation.year ? ` (${citation.year})` : ""}
                        </li>
                      ))}
                    </ul>
                  ) : null}

                  {message.suggested && message.suggested.length > 0 ? (
                    <div className="flex flex-wrap gap-2 pt-1">
                      {message.suggested.map((question) => (
                        <button
                          key={question}
                          type="button"
                          onClick={() => void send(question)}
                          className="rounded-full border border-white/10 px-3 py-1 text-[11px] text-zinc-400 hover:text-white"
                        >
                          {question}
                        </button>
                      ))}
                    </div>
                  ) : null}
                </>
              ) : null}
            </article>
          ))}

          {busy ? (
            <div className="mr-8 self-start rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-zinc-500">
              {expert.name} is thinking…
            </div>
          ) : null}
        </section>

        {error ? (
          <p className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
            {error}
          </p>
        ) : null}

        <p className="text-[11px] leading-5 text-zinc-600">{expert.disclaimer}</p>
        <div ref={bottomRef} />
      </main>

      <div className="fixed inset-x-0 bottom-0 z-20 bg-gradient-to-t from-[#08080a] via-[#08080a] to-transparent px-5 pb-5 pt-10">
        <form
          onSubmit={(event) => {
            event.preventDefault();
            void send(input);
          }}
          className="mx-auto flex w-full max-w-3xl items-end gap-2 rounded-2xl border border-white/12 bg-white/[0.05] p-2 backdrop-blur"
        >
          <textarea
            value={input}
            onChange={(event) => setInput(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter" && !event.shiftKey) {
                event.preventDefault();
                void send(input);
              }
            }}
            rows={1}
            placeholder={`Ask ${expert.name.split(" ")[0]} about ${expert.topics[0]}…`}
            className="max-h-32 w-full resize-none bg-transparent px-3 py-2 text-sm text-zinc-100 outline-none placeholder:text-zinc-500"
          />
          <button
            type="submit"
            disabled={busy || input.trim().length < 2}
            className="rounded-xl bg-orange-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-orange-400 disabled:cursor-not-allowed disabled:bg-white/10 disabled:text-zinc-500"
          >
            {busy ? "…" : "Ask"}
          </button>
        </form>
        <p className="mx-auto mt-2 w-full max-w-3xl text-center text-[10px] text-zinc-600">
          Answers are grounded in the sources shown. API: {API_BASE}
        </p>
      </div>
    </div>
  );
}
