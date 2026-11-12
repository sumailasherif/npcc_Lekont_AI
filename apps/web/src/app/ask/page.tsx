"use client";

import { useState } from "react";

import { useLanguage } from "@/components/language-provider";
import { MiniChart } from "@/components/mini-chart";
import { PageHero, Sparkle, buttonPrimary, card } from "@/components/motion";
import { apiPost, type AskResponse } from "@/lib/api";

export default function AskPage() {
  const { locale, t } = useLanguage();
  const [question, setQuestion] = useState("");
  const [result, setResult] = useState<AskResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function ask(text: string) {
    if (!text.trim() || loading) return;
    setLoading(true);
    setError(null);
    try {
      setResult(
        await apiPost<AskResponse>("/api/v1/insights/ask", {
          question: text,
          language: locale,
        }),
      );
    } catch {
      setError(t.ask.error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <PageHero
        compact
        eyebrow={t.hero.askEyebrow}
        title={t.hero.askLead}
        highlight={t.hero.askHighlight}
        description={t.ask.subtitle}
      >
        <div className="mx-auto max-w-2xl">
          <form
            onSubmit={(event) => {
              event.preventDefault();
              void ask(question);
            }}
            className="flex items-center gap-2 rounded-2xl border border-white/15 bg-white/[0.06] p-2 text-left shadow-[0_20px_60px_-20px_rgba(20,184,166,0.45)] backdrop-blur-xl transition focus-within:border-lagoon/60"
          >
            <span className="pl-2 text-lagoon">
              <Sparkle />
            </span>
            <input
              value={question}
              onChange={(event) => setQuestion(event.target.value)}
              placeholder={t.ask.placeholder}
              aria-label={t.ask.title}
              className="min-w-0 flex-1 bg-transparent px-1 py-2 text-sm text-white outline-none placeholder:text-slate-400 md:text-base"
            />
            <button type="submit" disabled={loading} className={`${buttonPrimary} px-4 py-2`}>
              {loading ? t.ask.thinking : t.ask.ask}
            </button>
          </form>
          <div className="mt-4 flex flex-wrap justify-center gap-2">
            {t.ask.suggestions.map((suggestion) => (
              <button
                key={suggestion}
                type="button"
                onClick={() => {
                  setQuestion(suggestion);
                  void ask(suggestion);
                }}
                className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-300 transition hover:border-lagoon/50 hover:text-white"
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>
      </PageHero>

      <div className="relative z-10 mx-auto -mt-16 flex max-w-4xl flex-col gap-4 px-4 pb-24 md:px-6">
        {error ? (
          <p className="animate-fade-up rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
            {error}
          </p>
        ) : null}

        {loading && !result ? (
          <div className={`${card} flex flex-col gap-3 p-6`}>
            <span className="skeleton h-5 w-3/4 rounded-md" />
            <span className="skeleton h-5 w-1/2 rounded-md" />
            <span className="skeleton h-40 rounded-xl" />
          </div>
        ) : null}

        {result ? (
          <section
            key={result.answer}
            className={`animate-fade-up ${card} flex flex-col gap-5 p-6 ${loading ? "opacity-60" : ""}`}
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <p className="max-w-2xl text-lg leading-8 text-ink">{result.answer}</p>
              <span className="rounded-full bg-lagoon-wash px-3 py-1 text-xs font-medium text-lagoon-deep ring-1 ring-lagoon/30">
                {Math.round(result.confidence * 100)}% {t.ask.confidence}
              </span>
            </div>

            <div className="overflow-x-auto rounded-xl bg-night px-4 py-3">
              <p className="text-[10px] uppercase tracking-[0.16em] text-lagoon">{t.ask.calculation}</p>
              <code className="mt-1 block font-mono text-xs text-lagoon-soft">{result.calculation}</code>
            </div>

            <div>
              <MiniChart result={result} />
            </div>

            {result.columns.length > 0 && result.rows.length > 0 ? (
              <div className="overflow-x-auto rounded-xl border border-line">
                <table className="w-full text-left text-sm">
                  <thead className="bg-surface text-[11px] uppercase tracking-wide text-muted">
                    <tr>
                      {result.columns.map((column) => (
                        <th key={column.key} className="px-4 py-2.5 font-medium">
                          {column.label}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {result.rows.map((row, index) => (
                      <tr
                        key={index}
                        className="border-t border-line transition-colors hover:bg-lagoon-wash/60"
                      >
                        {result.columns.map((column) => (
                          <td key={column.key} className="px-4 py-2.5 tabular-nums">
                            {typeof row[column.key] === "number"
                              ? Number(row[column.key]).toLocaleString("en-GB")
                              : String(row[column.key] ?? "")}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : null}

            {result.caveats.length > 0 ? (
              <div className="rounded-xl border border-sun/30 bg-sun-soft/60 px-4 py-3">
                <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-sun-ink">
                  {t.ask.caveats}
                </p>
                <ul className="mt-1 flex flex-col gap-1 text-xs text-sun-ink">
                  {result.caveats.map((caveat) => (
                    <li key={caveat}>· {caveat}</li>
                  ))}
                </ul>
              </div>
            ) : null}

            {result.suggested.length > 0 ? (
              <div className="flex flex-wrap gap-2 border-t border-line pt-4">
                {result.suggested.slice(0, 4).map((suggestion) => (
                  <button
                    key={suggestion}
                    type="button"
                    onClick={() => {
                      setQuestion(suggestion);
                      void ask(suggestion);
                    }}
                    className="rounded-full border border-line bg-card px-3 py-1 text-xs text-ink transition hover:-translate-y-0.5 hover:border-lagoon"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            ) : null}
          </section>
        ) : null}
      </div>
    </>
  );
}
