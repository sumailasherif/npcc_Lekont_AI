"use client";

import { useState } from "react";

import { MiniChart } from "@/components/mini-chart";
import { apiPost, type AskResponse } from "@/lib/api";

const SUGGESTIONS = [
  "Who are my top 5 suppliers by spend?",
  "How has my monthly spend changed?",
  "How much VAT did I pay in October?",
  "Where is my money going by category?",
  "What did I spend on payroll?",
  "What was my largest invoice?",
];

export default function AskPage() {
  const [question, setQuestion] = useState("");
  const [result, setResult] = useState<AskResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function ask(text: string) {
    if (!text.trim() || loading) return;
    setLoading(true);
    setError(null);
    try {
      setResult(await apiPost<AskResponse>("/api/v1/insights/ask", { question: text }));
    } catch {
      setError("Could not answer. Check the API and try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="animate-fade-in flex flex-col gap-5">
      <header>
        <h1 className="text-2xl font-semibold tracking-tight">Ask your spreadsheet</h1>
        <p className="mt-1 max-w-2xl text-sm text-[#5b5b53]">
          Plain-language questions over the ledger. The answer always shows the
          calculation, the rows behind it, and what it does not cover.
        </p>
      </header>

      <form
        onSubmit={(event) => {
          event.preventDefault();
          void ask(question);
        }}
        className="flex flex-col gap-2 rounded-2xl border border-[#e5e7eb] bg-white p-3 sm:flex-row sm:items-center"
      >
        <input
          value={question}
          onChange={(event) => setQuestion(event.target.value)}
          placeholder="e.g. How much did I spend with Island Packaging this year?"
          className="min-w-0 flex-1 rounded-xl px-3 py-2 text-sm outline-none"
        />
        <button
          type="submit"
          disabled={loading}
          className="rounded-xl bg-[#4f46e5] px-4 py-2 text-sm font-medium text-white disabled:opacity-60"
        >
          {loading ? "Thinking…" : "Ask"}
        </button>
      </form>

      <div className="flex flex-wrap gap-2">
        {SUGGESTIONS.map((suggestion) => (
          <button
            key={suggestion}
            type="button"
            onClick={() => {
              setQuestion(suggestion);
              void ask(suggestion);
            }}
            className="rounded-full border border-[#d1d5db] bg-white px-3 py-1.5 text-xs text-[#374151] hover:border-[#4f46e5]"
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
        <section className="animate-fade-up flex flex-col gap-4 rounded-2xl border border-[#e5e7eb] bg-white p-5">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <p className="max-w-2xl text-base leading-7">{result.answer}</p>
            <span className="rounded-full bg-[#eef2ff] px-3 py-1 text-xs font-medium text-[#4f46e5]">
              {Math.round(result.confidence * 100)}% confidence
            </span>
          </div>

          <div className="rounded-xl bg-[#171717] px-4 py-3">
            <p className="text-[10px] uppercase tracking-wide text-white/50">Calculation</p>
            <code className="mt-1 block font-mono text-xs text-white/90">
              {result.calculation}
            </code>
          </div>

          <MiniChart result={result} />

          {result.columns.length > 0 && result.rows.length > 0 ? (
            <div className="overflow-x-auto rounded-xl border border-[#f1f3f5]">
              <table className="w-full text-left text-sm">
                <thead className="bg-[#f9fafb] text-[11px] uppercase tracking-wide text-[#6b7280]">
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
                    <tr key={index} className="border-t border-[#f1f3f5]">
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
            <ul className="flex flex-col gap-1 text-[11px] text-[#6b7280]">
              {result.caveats.map((caveat) => (
                <li key={caveat}>· {caveat}</li>
              ))}
            </ul>
          ) : null}

          {result.suggested.length > 0 ? (
            <div className="flex flex-wrap gap-2 border-t border-[#f1f3f5] pt-3">
              {result.suggested.slice(0, 4).map((suggestion) => (
                <button
                  key={suggestion}
                  type="button"
                  onClick={() => {
                    setQuestion(suggestion);
                    void ask(suggestion);
                  }}
                  className="rounded-full bg-[#f7f8fa] px-3 py-1 text-[11px] text-[#374151]"
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
