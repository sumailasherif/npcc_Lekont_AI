"use client";

import { useState } from "react";

import { apiPost, type Language } from "@/lib/api";

type Citation = {
  sop_id: string;
  version: number;
  step: number;
  quote: string;
};

type Answer = {
  covered: boolean;
  answer: string;
  source_answer?: string;
  language: Language;
  confidence: number;
  citations: Citation[];
  gap_id?: string | null;
  translation_engine?: string;
  review_required?: boolean;
};

type TranslationMeta = {
  engine: string;
  reviewRequired: boolean;
};

const LANGUAGES: { id: Language; label: string }[] = [
  { id: "en", label: "EN" },
  { id: "fr", label: "FR" },
  { id: "cr", label: "Kreol" },
];

export function AskPanel() {
  const [question, setQuestion] = useState("");
  const [language, setLanguage] = useState<Language>("en");
  const [loading, setLoading] = useState(false);
  const [translating, setTranslating] = useState(false);
  const [result, setResult] = useState<Answer | null>(null);
  const [display, setDisplay] = useState<string>("");
  const [meta, setMeta] = useState<TranslationMeta>({
    engine: "identity",
    reviewRequired: false,
  });
  const [error, setError] = useState<string | null>(null);

  async function ask() {
    if (question.trim().length < 3 || loading) return;
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const answer = await apiPost<Answer>("/api/v1/query", {
        question,
        language,
      });
      setResult(answer);
      setDisplay(answer.answer);
      setMeta({
        engine: answer.translation_engine ?? "identity",
        reviewRequired: answer.review_required ?? false,
      });
    } catch {
      setError(
        "The API is not reachable. Start it in apps/api with: uvicorn app.main:app --reload",
      );
    } finally {
      setLoading(false);
    }
  }

  async function switchLanguage(next: Language) {
    setLanguage(next);
    if (!result) return;

    const source = result.source_answer || result.answer;

    if (next === "en") {
      setDisplay(source);
      setMeta({ engine: "identity", reviewRequired: false });
      return;
    }

    setTranslating(true);
    setError(null);
    try {
      const translated = await apiPost<{
        translated_text: string;
        engine: string;
        review_required: boolean;
      }>("/api/v1/translate", {
        text: source,
        target_language: next,
      });
      setDisplay(translated.translated_text);
      setMeta({
        engine: translated.engine,
        reviewRequired: translated.review_required,
      });
    } catch {
      setError("Live translation failed. Try again.");
    } finally {
      setTranslating(false);
    }
  }

  return (
    <div className="flex w-full flex-col gap-4">
      <div className="rounded-2xl border border-white/12 bg-white/[0.03] p-2 shadow-[0_0_60px_-20px_rgba(255,255,255,0.15)] backdrop-blur">
        <textarea
          value={question}
          onChange={(event) => setQuestion(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter" && !event.shiftKey) {
              event.preventDefault();
              void ask();
            }
          }}
          rows={3}
          placeholder="Ask about a jam, a missing lot number, a vibration, a HACCP step..."
          className="w-full resize-none bg-transparent px-4 py-3 text-base leading-6 text-zinc-100 outline-none placeholder:text-zinc-500"
        />
        <div className="flex flex-wrap items-center justify-between gap-3 px-2 pb-1">
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
          <div className="flex items-center gap-2">
            <button
              type="button"
              title="Voice capture is on the roadmap"
              className="grid h-9 w-9 place-items-center rounded-full border border-white/10 text-zinc-400 transition hover:text-zinc-100"
              aria-label="Voice capture (coming soon)"
            >
              <MicIcon />
            </button>
            <button
              type="button"
              onClick={() => void ask()}
              disabled={loading || question.trim().length < 3}
              className="rounded-full bg-orange-500 px-5 py-2 text-sm font-semibold text-white transition hover:bg-orange-400 disabled:cursor-not-allowed disabled:bg-white/10 disabled:text-zinc-500"
            >
              {loading ? "Searching..." : "Ask"}
            </button>
          </div>
        </div>
      </div>

      {error ? (
        <p className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
          {error}
        </p>
      ) : null}

      {result ? (
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
            <span
              className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                result.covered
                  ? "bg-emerald-500/15 text-emerald-300"
                  : "bg-amber-500/15 text-amber-300"
              }`}
            >
              {result.covered ? "Approved instruction" : "Logged as a gap"}
            </span>
            <div className="flex flex-wrap items-center gap-2 text-xs text-zinc-500">
              <span>confidence {Math.round(result.confidence * 100)}%</span>
              <span>·</span>
              <span>{translating ? "translating…" : `engine ${meta.engine}`}</span>
              {meta.reviewRequired ? (
                <span className="rounded-full bg-amber-500/15 px-2 py-0.5 text-amber-300">
                  machine translation · review
                </span>
              ) : null}
            </div>
          </div>
          <p className="whitespace-pre-line text-sm leading-7 text-zinc-200">
            {display || result.answer}
          </p>
          {result.citations.length > 0 ? (
            <ul className="mt-4 flex flex-col gap-2 border-t border-white/10 pt-3">
              {result.citations.map((citation) => (
                <li key={`${citation.sop_id}-${citation.step}`} className="text-xs text-zinc-500">
                  <span className="font-mono text-zinc-400">
                    {citation.sop_id} v{citation.version} · step {citation.step}
                  </span>
                  <span className="ml-2">{citation.quote}</span>
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}

function MicIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M12 3a3 3 0 0 0-3 3v6a3 3 0 0 0 6 0V6a3 3 0 0 0-3-3Z" />
      <path d="M5 11a7 7 0 0 0 14 0M12 18v3" />
    </svg>
  );
}
