"use client";

import { useState } from "react";

import { useLanguage } from "@/components/language-provider";
import { MiniChart } from "@/components/mini-chart";
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
    <div className="flex flex-col gap-5">
      <header>
        <h1 className="text-2xl font-semibold tracking-tight">{t.ask.title}</h1>
        <p className="mt-1 max-w-2xl text-sm text-[#5b5b53]">{t.ask.subtitle}</p>
      </header>

      <form
        onSubmit={(event) => {
          event.preventDefault();
          void ask(question);
        }}
        className="flex flex-col gap-2 rounded-2xl border border-[#e2e2da] bg-white p-3 sm:flex-row sm:items-center"
      >
        <input
          value={question}
          onChange={(event) => setQuestion(event.target.value)}
          placeholder={t.ask.placeholder}
          className="min-w-0 flex-1 rounded-xl px-3 py-2 text-sm outline-none"
        />
        <button
          type="submit"
          disabled={loading}
          className="rounded-xl bg-[#0f5f56] px-4 py-2 text-sm font-medium text-white disabled:opacity-60"
        >
          {loading ? t.ask.thinking : t.ask.ask}
        </button>
      </form>

      <div className="flex flex-wrap gap-2">
        {t.ask.suggestions.map((suggestion) => (
          <button
            key={suggestion}
            type="button"
            onClick={() => {
              setQuestion(suggestion);
              void ask(suggestion);
            }}
            className="rounded-full border border-[#d8d8cf] bg-white px-3 py-1.5 text-xs text-[#4b4b45] hover:border-[#0f5f56]"
          >
            {suggestion}
          </button>
        ))}
      </div>

      {error ? (
        <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </p>
      ) : null}

      {result ? (
        <section className="flex flex-col gap-4 rounded-2xl border border-[#e2e2da] bg-white p-5">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <p className="max-w-2xl text-base leading-7">{result.answer}</p>
            <span className="rounded-full bg-[#f0f6f4] px-3 py-1 text-xs font-medium text-[#0f5f56]">
              {Math.round(result.confidence * 100)}% {t.ask.confidence}
            </span>
          </div>

          <div className="rounded-xl bg-[#171717] px-4 py-3">
            <p className="text-[10px] uppercase tracking-wide text-white/50">
              {t.ask.calculation}
            </p>
            <code className="mt-1 block font-mono text-xs text-white/90">
              {result.calculation}
            </code>
          </div>

          <MiniChart result={result} />

          {result.columns.length > 0 && result.rows.length > 0 ? (
            <div className="overflow-x-auto rounded-xl border border-[#efefe9]">
              <table className="w-full text-left text-sm">
                <thead className="bg-[#fafaf7] text-[11px] uppercase tracking-wide text-[#8a8a80]">
                  <tr>
                    {result.columns.map((column) => (
                      <th key={column.key} className="px-4 py-2 font-medium">
                        {column.label}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {result.rows.map((row, index) => (
                    <tr key={index} className="border-t border-[#efefe9]">
                      {result.columns.map((column) => (
                        <td key={column.key} className="px-4 py-2 tabular-nums">
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
            <ul className="flex flex-col gap-1 text-[11px] text-[#8a8a80]">
              {result.caveats.map((caveat) => (
                <li key={caveat}>· {caveat}</li>
              ))}
            </ul>
          ) : null}

          {result.suggested.length > 0 ? (
            <div className="flex flex-wrap gap-2 border-t border-[#efefe9] pt-3">
              {result.suggested.slice(0, 4).map((suggestion) => (
                <button
                  key={suggestion}
                  type="button"
                  onClick={() => {
                    setQuestion(suggestion);
                    void ask(suggestion);
                  }}
                  className="rounded-full bg-[#f5f5f1] px-3 py-1 text-[11px] text-[#4b4b45]"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          ) : null}
        </section>
      ) : null}
    </div>
  );
}
